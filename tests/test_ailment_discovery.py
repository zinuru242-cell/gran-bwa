from fastapi.testclient import TestClient
import base64
import json

import gran_bwa


app = gran_bwa.app


client = TestClient(app)


def test_live_shell_exposes_upgrade_marker_and_disables_stale_html_cache():
    response = client.get('/')
    assert response.status_code == 200
    assert 'VOICE & LAND · LIVE' in response.text
    assert 'v2.4' in response.text
    assert response.headers['cache-control'] == 'no-store, no-cache, must-revalidate'


def test_service_worker_is_always_revalidated():
    response = client.get('/sw.js')
    assert response.status_code == 200
    assert response.headers['cache-control'] == 'no-store, no-cache, must-revalidate'
    assert "granbwa-v8" in response.text
    assert "/identify-plant" in response.text
    assert "/location-search" in response.text
    assert "/resolve-location" in response.text
    assert "/regional-context" in response.text


def test_mobile_shell_has_camera_capture_and_photo_identification_flow():
    html = client.get('/').text
    assert 'id="photoInput"' in html
    assert 'accept="image/*"' in html
    assert 'capture="environment"' in html
    assert 'identifyPhoto' in html
    assert 'resizePhoto' in html
    assert 'Photo identification is a hypothesis' in html


def test_photo_endpoint_rejects_non_image_data():
    response = client.post('/identify-plant', json={'image': 'data:text/plain;base64,SGVsbG8='})
    assert response.status_code == 415
    assert response.json()['detail'] == 'Use a JPEG, PNG, or WebP plant photograph.'


def test_two_exact_vision_votes_create_only_medium_confidence_candidate():
    votes = [
        {'identified': True, 'scientific_name': 'Aloe vera', 'common_name': 'Aloe vera',
         'confidence': 'high', 'visible_traits': ['fleshy toothed leaves'], 'lookalikes': ['Agave']},
        {'identified': True, 'scientific_name': 'Aloe vera', 'common_name': 'Medicinal aloe',
         'confidence': 'high', 'visible_traits': ['basal succulent rosette'], 'lookalikes': ['Aloe arborescens']},
    ]
    result = gran_bwa.build_photo_consensus(votes)
    assert result['identified'] is True
    assert result['scientific_name'] == 'Aloe vera'
    assert result['confidence'] == 'medium'
    assert '[PLANT: Aloe vera' in result['text']
    assert 'not proof' in result['text'].casefold()


def test_disagreeing_vision_votes_expose_both_candidates_without_plant_card():
    votes = [
        {'identified': True, 'scientific_name': 'Aloe vera', 'common_name': 'Aloe vera'},
        {'identified': True, 'scientific_name': 'Aloe arborescens', 'common_name': 'Krantz aloe'},
    ]
    result = gran_bwa.build_photo_consensus(votes)
    assert result['identified'] is False
    assert result['confidence'] == 'low'
    assert result['candidates'] == ['Aloe vera', 'Aloe arborescens']
    assert 'Aloe vera' in result['text']
    assert 'Aloe arborescens' in result['text']
    assert '[PLANT:' not in result['text']


def test_fenced_vision_json_is_parsed_without_model_prose():
    raw = '''```json
    {"identified": true, "scientific_name": "Aloe vera", "common_name": "Aloe vera",
     "confidence": "high", "visible_traits": ["toothed leaves"], "lookalikes": ["Agave"]}
    ```'''
    vote = gran_bwa.parse_vision_vote(raw)
    assert vote['scientific_name'] == 'Aloe vera'
    assert vote['visible_traits'] == ['toothed leaves']


def test_malformed_vision_vote_is_rejected_without_crashing_endpoint(monkeypatch):
    malformed = {
        'identified': 'false', 'scientific_name': 'Aloe vera',
        'common_name': 'Aloe vera', 'confidence': 'high',
        'visible_traits': 7, 'lookalikes': {'bad': 'shape'},
    }
    assert gran_bwa.parse_vision_vote(json.dumps(malformed)) is None
    assert gran_bwa.normalize_vision_vote({
        'identified': True, 'scientific_name': 'Aloe vera',
        'common_name': 'Aloe vera', 'confidence': [],
        'visible_traits': [], 'lookalikes': [],
    }) is None
    assert gran_bwa.build_photo_consensus([malformed])['identified'] is False

    async def fake_analysis(raw, mime):
        return [malformed], ['malformed-reader']

    monkeypatch.setattr(gran_bwa, 'analyze_plant_photo', fake_analysis)
    raw = b'\x89PNG\r\n\x1a\n' + b'transient-malformed-vote'
    image = 'data:image/png;base64,' + base64.b64encode(raw).decode()
    response = client.post('/identify-plant', json={'image': image})
    assert response.status_code == 200
    assert response.json()['identified'] is False


def test_photo_endpoint_returns_consensus_from_transient_image(monkeypatch):
    votes = [
        {'identified': True, 'scientific_name': 'Aloe vera', 'common_name': 'Aloe vera'},
        {'identified': True, 'scientific_name': 'Aloe vera', 'common_name': 'Medicinal aloe'},
    ]

    async def fake_analysis(raw, mime):
        assert raw.startswith(b'\x89PNG\r\n\x1a\n')
        assert mime == 'image/png'
        return votes, ['reader-one', 'reader-two']

    monkeypatch.setattr(gran_bwa, 'analyze_plant_photo', fake_analysis, raising=False)
    raw = b'\x89PNG\r\n\x1a\n' + b'transient-test-image'
    image = 'data:image/png;base64,' + base64.b64encode(raw).decode()
    response = client.post('/identify-plant', json={'image': image})
    body = response.json()
    assert response.status_code == 200
    assert body['identified'] is True
    assert body['confidence'] == 'medium'
    assert body['vision_readers'] == ['reader-one', 'reader-two']


def ask(question: str) -> dict:
    response = client.post('/chat', json={'messages': [{'role': 'user', 'content': question}]})
    assert response.status_code == 200
    return response.json()


def test_high_blood_pressure_question_gets_fast_layered_education():
    body = ask('What plant heals high blood pressure?')
    text = body['text'].casefold()
    assert body['brain'] == 'curated-ailment-ledger'
    assert body['condition'] == 'high blood pressure'
    assert '[plant: hibiscus sabdariffa' in text
    assert 'tradition' in text
    assert 'evidence' in text
    assert 'safety' in text
    assert 'not a cure' in text
    assert 'doctor or trained healer now' not in text


def test_psoriasis_question_educates_instead_of_false_emergency_refusal():
    body = ask('Which herb treats psoriasis?')
    text = body['text'].casefold()
    assert body['condition'] == 'psoriasis'
    assert '[plant: aloe vera' in text
    assert 'evidence' in text
    assert 'safety' in text
    assert 'doctor or trained healer now' not in text


def test_unlisted_condition_still_gets_condition_specific_education():
    body = ask('Which plant heals sarcoidosis?')
    text = body['text'].casefold()
    assert body['condition'] == 'sarcoidosis'
    assert body['candidates'] == []
    assert 'sarcoidosis' in text
    assert 'no verified condition record' in text
    assert 'tradition' in text
    assert 'evidence' in text
    assert 'safety' in text


def test_danger_sign_overrides_ailment_discovery_and_names_no_plant():
    body = ask("What leaf helps a baby who won't wake?")
    text = body['text'].casefold()
    assert body['brain'] == 'hard-safety-gate'
    assert 'doctor' in text or 'emergency' in text
    assert '[plant:' not in text


def test_trailing_emergency_survives_chat_history_truncation():
    body = ask(('ordinary gardening notes ' * 250) + " my baby won't wake")
    assert body['brain'] == 'hard-safety-gate'
    assert '[PLANT:' not in body['text']


def test_chest_pain_never_falls_into_unknown_condition_education():
    body = ask('Which herb treats chest pain?')
    assert body['brain'] == 'hard-safety-gate'
    assert '[PLANT:' not in body['text']


def test_named_plant_question_still_uses_the_existing_brain_ladder(monkeypatch):
    # A named-plant question is not an illness-discovery query and must not be
    # swallowed by the curated condition router. Empty BRAINS makes the seam
    # deterministic without making a network call.
    monkeypatch.setattr('gran_bwa.BRAINS', [])
    body = ask('Tell me about bitter leaf')
    assert body['error'] == 'no_key'
