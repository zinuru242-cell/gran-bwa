from fastapi.testclient import TestClient

from gran_bwa import app


client = TestClient(app)


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
