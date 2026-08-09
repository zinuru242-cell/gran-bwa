const assert = require('assert');
const {createVoiceController, createRequestCoordinator, speechText} = require('../voice.js');

assert.strictEqual(
  speechText('**Possible plant:** Aloe vera 🌿\n[PLANT: Aloe vera | Aloe | hidden card metadata]\nDo not taste it. https://example.com'),
  'Possible plant: Aloe vera Do not taste it.'
);

let transcript = '';
let states = [];
let statuses = [];
class MockRecognition {
  constructor(){ MockRecognition.instance = this; }
  start(){ this.started = true; }
  stop(){ this.stopped = true; }
}
class MockUtterance {
  constructor(text){ this.text = text; }
}
const synth = {
  cancelled: 0, spoken: [],
  cancel(){ this.cancelled++; },
  speak(utterance){ this.spoken.push(utterance); },
  getVoices(){ return [{lang:'en-US',name:'English'}, {lang:'xh-ZA',name:'isiXhosa'}]; },
};
const controller = createVoiceController({
  Recognition: MockRecognition,
  speechSynthesis: synth,
  Utterance: MockUtterance,
  getLanguage: () => 'xh-ZA',
  onTranscript: text => { transcript = text; },
  onState: state => states.push(state),
  onStatus: status => statuses.push(status),
});

assert.strictEqual(controller.isRecognitionSupported(), true);
assert.strictEqual(controller.startListening(), true);
assert.strictEqual(synth.cancelled, 1);
assert.strictEqual(MockRecognition.instance.lang, 'xh-ZA');
assert.strictEqual(MockRecognition.instance.interimResults, false);
assert.deepStrictEqual(states, ['listening']);
MockRecognition.instance.onresult({results:[{isFinal:true, 0:{transcript:'  Ndixelele ngekhala  '}}]});
assert.strictEqual(transcript, 'Ndixelele ngekhala');
assert.deepStrictEqual(states, ['listening', 'idle']);

assert.strictEqual(controller.speak('**Aloe vera** 🌿 [PLANT: Aloe vera | Aloe | metadata]'), true);
assert.strictEqual(synth.spoken.length, 1);
assert.strictEqual(synth.spoken[0].text, 'Aloe vera');
assert.strictEqual(synth.spoken[0].lang, 'xh-ZA');
assert.strictEqual(synth.spoken[0].voice.name, 'isiXhosa');
controller.setEnabled(false);
assert.strictEqual(controller.speak('This must remain silent'), false);
assert.strictEqual(synth.spoken.length, 1);

const unsupported = createVoiceController({
  Recognition: null,
  speechSynthesis: null,
  Utterance: null,
  getLanguage: () => 'en-ZA',
  onTranscript: () => {},
  onState: state => states.push(state),
  onStatus: status => statuses.push(status),
});
assert.strictEqual(unsupported.startListening(), false);
assert.ok(statuses.some(text => /not available/i.test(text)));

function makeHarness(){
  const sent=[];
  const stateLog=[];
  class Recognition {
    constructor(){ Recognition.instances.push(this); }
    start(){ this.started=true; }
    stop(){ this.stopped=true; }
  }
  Recognition.instances=[];
  class Utterance { constructor(text){ this.text=text; } }
  const speech={
    spoken:[], cancelled:0,
    cancel(){ this.cancelled++; },
    speak(item){ this.spoken.push(item); },
    getVoices(){ return [{lang:'en-ZA',name:'South African English'}]; },
  };
  const instance=createVoiceController({
    Recognition,
    speechSynthesis:speech,
    Utterance,
    getLanguage:()=> 'en-ZA',
    onTranscript:text=>sent.push(text),
    onState:state=>stateLog.push(state),
    onStatus:()=>{},
  });
  return {instance, Recognition, speech, sent, stateLog};
}

// A person's explicit Stop invalidates anything delivered by the old browser session.
const stopped=makeHarness();
stopped.instance.startListening();
const stoppedRecognizer=stopped.Recognition.instances[0];
stopped.instance.stopListening();
stoppedRecognizer.onresult({results:[{isFinal:true,0:{transcript:'private words after stop'}}]});
assert.deepStrictEqual(stopped.sent, []);

// A browser replaying a final event can submit that transcript only once.
const duplicate=makeHarness();
duplicate.instance.startListening();
const duplicateRecognizer=duplicate.Recognition.instances[0];
const duplicateEvent={results:[{isFinal:true,0:{transcript:'one healing question'}}]};
duplicateRecognizer.onresult(duplicateEvent);
duplicateRecognizer.onresult(duplicateEvent);
assert.deepStrictEqual(duplicate.sent, ['one healing question']);

// An old session stays invalid even after a new listening session starts.
const renewed=makeHarness();
renewed.instance.startListening();
const oldRecognizer=renewed.Recognition.instances[0];
renewed.instance.stopListening();
renewed.instance.startListening();
const newRecognizer=renewed.Recognition.instances[1];
oldRecognizer.onresult({results:[{isFinal:true,0:{transcript:'old private speech'}}]});
newRecognizer.onresult({results:[{isFinal:true,0:{transcript:'current question'}}]});
assert.deepStrictEqual(renewed.sent, ['current question']);

// Canceling nonexistent speech must not visually cancel active microphone listening.
const listeningState=makeHarness();
listeningState.instance.startListening();
listeningState.instance.stopSpeaking();
assert.strictEqual(listeningState.instance.isListening(), true);
assert.strictEqual(listeningState.stateLog.at(-1), 'listening');

// Canceled utterance callbacks may not overwrite the state of a newer utterance.
const speechRace=makeHarness();
speechRace.instance.speak('First reply.');
const oldUtterance=speechRace.speech.spoken[0];
speechRace.instance.speak('Second reply.');
const currentUtterance=speechRace.speech.spoken[1];
currentUtterance.onstart();
oldUtterance.onend();
assert.strictEqual(speechRace.stateLog.at(-1), 'speaking');
currentUtterance.onend();
assert.strictEqual(speechRace.stateLog.at(-1), 'idle');

// Long replies are sequenced in bounded utterances through the final safety sentence.
const longSpeech=makeHarness();
const longReply=('A traditional-use statement with evidence limits. '.repeat(18))+
  'Final safety: do not taste an unidentified plant and seek urgent medical care when needed.';
assert.strictEqual(longSpeech.instance.speak(longReply), true);
let utteranceIndex=0;
while(utteranceIndex<longSpeech.speech.spoken.length && utteranceIndex<30){
  const utterance=longSpeech.speech.spoken[utteranceIndex++];
  assert.ok(utterance.text.length<=240, `oversized speech chunk: ${utterance.text.length}`);
  utterance.onend();
}
assert.ok(longSpeech.speech.spoken.length>1);
assert.ok(longSpeech.speech.spoken.map(item=>item.text).join(' ').includes('Final safety: do not taste'));
assert.strictEqual(longSpeech.stateLog.at(-1), 'idle');

// Speech always terminates active capture before any replay starts.
const replaySafety=makeHarness();
replaySafety.instance.startListening();
const replayRecognizer=replaySafety.Recognition.instances[0];
assert.strictEqual(replaySafety.instance.speak('Repeat the safe answer.'), true);
assert.strictEqual(replaySafety.instance.isListening(), false);
assert.strictEqual(replayRecognizer.stopped, true);
replaySafety.speech.spoken[0].onstart();
assert.strictEqual(replaySafety.stateLog.at(-1), 'speaking');

// Optional speech-engine exceptions never escape into a successful chat request.
class ThrowingUtterance { constructor(){ throw new Error('voice unavailable'); } }
const throwingSpeech={cancel(){},getVoices(){return[];},speak(){throw new Error('speak failed');}};
const speechFailure=createVoiceController({
  Recognition:null,speechSynthesis:throwingSpeech,Utterance:ThrowingUtterance,
  getLanguage:()=> 'en-ZA',onTranscript:()=>{},onState:()=>{},onStatus:()=>{},
});
assert.doesNotThrow(()=>speechFailure.speak('The text answer remains available.'));
class SafeUtterance { constructor(text){this.text=text;} }
const throwingSpeakController=createVoiceController({
  Recognition:null,speechSynthesis:throwingSpeech,Utterance:SafeUtterance,
  getLanguage:()=> 'en-ZA',onTranscript:()=>{},onState:()=>{},onStatus:()=>{},
});
assert.doesNotThrow(()=>throwingSpeakController.speak('This answer also remains on screen.'));

class MockAbortController {
  constructor(){this.signal={aborted:false};}
  abort(){this.signal.aborted=true;}
}
const requests=createRequestCoordinator(MockAbortController);
const greeting=requests.beginGreeting();
const chatRequest=requests.begin('chat');
assert.strictEqual(greeting.controller.signal.aborted,true);
assert.strictEqual(requests.current(greeting),false);
assert.strictEqual(requests.current(chatRequest),true);
assert.strictEqual(requests.begin('photo'),null);
requests.clear();
assert.strictEqual(chatRequest.controller.signal.aborted,true);
assert.strictEqual(requests.current(chatRequest),false);
assert.strictEqual(requests.isBusy(),false);
const freshPhoto=requests.begin('photo');
assert.strictEqual(requests.current(freshPhoto),true);
assert.strictEqual(requests.finish(freshPhoto),true);
assert.strictEqual(requests.isBusy(),false);
const clearedGreeting=requests.beginGreeting();
requests.clear();
assert.strictEqual(clearedGreeting.controller.signal.aborted,true);
assert.strictEqual(requests.current(clearedGreeting),false);

console.log('voice controller tests passed');
