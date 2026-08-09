import subprocess

from fastapi.testclient import TestClient

import gran_bwa


client = TestClient(gran_bwa.app)


def test_voice_controller_behavior_in_node():
    result = subprocess.run(
        ['node', 'tests/voice_controller_test.cjs'],
        cwd=gran_bwa.BASE,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr


def test_voice_ui_is_accessible_private_and_has_text_fallback():
    response = client.get('/')
    html = response.text

    assert response.status_code == 200
    assert 'id="micBtn"' in html
    assert 'aria-label="Speak to Gran Bwa"' in html
    assert 'id="voiceStatus"' in html and 'aria-live="polite"' in html
    assert 'id="voiceLanguage"' in html
    assert 'id="voiceToggle"' in html
    assert 'id="replayBtn"' in html
    assert 'Your phone or browser may send audio to its speech provider' in html
    assert "provider's own retention policy" in html
    assert 'The transcript is sent through Gran Bwa' in html
    assert 'Gran Bwa does not store your recording' in html
    assert 'voiceController.speak(reply)' in html
    assert 'onTranscript:text=>ask(text)' in html
    assert '<textarea id="input"' in html
    assert '@media (prefers-reduced-motion:reduce)' in html
    assert '.voice-language select{min-height:44px' in html
    assert 'createRequestCoordinator' in html
    assert "beginOperation('chat')" in html
    assert "beginOperation('photo')" in html
    assert 'requestCoordinator.clear();' in html
    assert "signal:operation.controller.signal" in html

    language_block = html.split("voiceLanguage.addEventListener('change'", 1)[1].split('updateVoiceControls();', 1)[0]
    assert 'voiceController.stopListening();' in language_block

    clear_block = html.split('function clearHistory(){', 1)[1].split('function greet(){', 1)[0]
    assert 'stopVoiceActivity();' in clear_block
    assert "lastVoiceReply=''" in clear_block
    assert "replayBtn.style.display='none'" in clear_block
    assert html.count('stopVoiceActivity();') >= 2


def test_voice_script_is_fresh_javascript_and_service_worker_never_caches_it():
    script = client.get('/voice.js')
    worker = client.get('/sw.js').text

    assert script.status_code == 200
    assert script.headers['content-type'].startswith('application/javascript')
    assert 'no-store' in script.headers.get('cache-control', '')
    assert '/voice.js' in worker
