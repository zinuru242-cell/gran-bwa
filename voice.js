(function(root, factory){
  const api = factory();
  if(typeof module === 'object' && module.exports) module.exports = api;
  else root.GranBwaVoice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';

  function speechText(value){
    return String(value == null ? '' : value)
      .replace(/\[PLANT:[^\]]*\]/gi, ' ')
      .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/gi, '$1')
      .replace(/https?:\/\/\S+/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/[*_`~#>]/g, '')
      .replace(/^\s*[-•]\s*/gm, '')
      .replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}|\uFE0F/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speechChunks(value, maxLength=220){
    const text=speechText(value);
    if(!text) return [];
    const chunks=[];
    let remaining=text;
    while(remaining.length>maxLength){
      const window=remaining.slice(0,maxLength+1);
      let cut=-1;
      const boundary=/[.!?;:]\s/g;
      let match;
      while((match=boundary.exec(window))) cut=match.index+1;
      if(cut<Math.floor(maxLength*0.45)) cut=window.lastIndexOf(' ',maxLength);
      if(cut<1) cut=maxLength;
      chunks.push(remaining.slice(0,cut).trim());
      remaining=remaining.slice(cut).trim();
    }
    if(remaining) chunks.push(remaining);
    return chunks;
  }

  function createRequestCoordinator(AbortControllerType){
    let generation=0;
    let active=null;
    let greeting=null;

    function token(kind){
      const controller=AbortControllerType?new AbortControllerType():{signal:undefined,abort(){}};
      return {kind,generation,controller};
    }
    function abort(value){
      if(!value) return;
      try{value.controller.abort();}catch(e){}
    }
    function current(value){
      if(!value || value.generation!==generation || (value.controller.signal&&value.controller.signal.aborted)) return false;
      return value.kind==='greeting'?greeting===value:active===value;
    }
    function begin(kind){
      if(active) return null;
      abort(greeting);
      greeting=null;
      active=token(kind);
      return active;
    }
    function beginGreeting(){
      if(active) return null;
      abort(greeting);
      greeting=token('greeting');
      return greeting;
    }
    function finish(value){
      if(!current(value)) return false;
      if(value.kind==='greeting') greeting=null;
      else active=null;
      return true;
    }
    function clear(){
      generation++;
      abort(active);
      abort(greeting);
      active=null;
      greeting=null;
    }
    return {begin,beginGreeting,current,finish,clear,isBusy:()=>!!active};
  }

  function createVoiceController(options){
    const Recognition = options.Recognition || null;
    const synthesis = options.speechSynthesis || null;
    const Utterance = options.Utterance || null;
    const getLanguage = options.getLanguage || (() => 'en-US');
    const onTranscript = options.onTranscript || (() => {});
    const onState = options.onState || (() => {});
    const onStatus = options.onStatus || (() => {});
    let recognition = null;
    let listening = false;
    let recognitionGeneration = 0;
    let activeRecognitionGeneration = 0;
    let speechGeneration = 0;
    let activeSpeechGeneration = 0;
    let enabled = true;

    function language(){
      const selected = String(getLanguage() || '').trim();
      return selected || 'en-US';
    }

    function invalidateSpeech(announceIdle){
      const wasActive=activeSpeechGeneration!==0;
      speechGeneration++;
      activeSpeechGeneration=0;
      try{if(synthesis) synthesis.cancel();}catch(e){}
      if(announceIdle && wasActive) onState('idle');
      return wasActive;
    }

    function startListening(){
      if(!Recognition){
        onStatus('Voice listening is not available in this browser. You can still type below.');
        onState('unsupported');
        return false;
      }
      if(listening) return true;

      invalidateSpeech(false);
      const recognizer=new Recognition();
      const generation=++recognitionGeneration;
      let consumed=false;
      recognition=recognizer;
      activeRecognitionGeneration=generation;
      listening=true;
      recognizer.continuous=false;
      recognizer.interimResults=false;
      recognizer.maxAlternatives=1;
      recognizer.lang=language();

      function isCurrent(){
        return listening && activeRecognitionGeneration===generation && recognition===recognizer;
      }
      function finish(status){
        if(!isCurrent()) return false;
        listening=false;
        activeRecognitionGeneration=0;
        recognition=null;
        onState('idle');
        if(status) onStatus(status);
        return true;
      }

      recognizer.onresult=event=>{
        if(!isCurrent() || consumed) return;
        let finalText='';
        for(let i=0;i<event.results.length;i++){
          const result=event.results[i];
          if(result && result.isFinal && result[0]) finalText+=' '+String(result[0].transcript||'');
        }
        finalText=finalText.replace(/\s+/g,' ').trim();
        if(!finalText) return;
        consumed=true;
        if(!finish('Voice heard. Sending to Gran Bwa…')) return;
        try{recognizer.stop();}catch(e){}
        onTranscript(finalText);
      };
      recognizer.onerror=event=>{
        if(!isCurrent()) return;
        const code=event&&event.error;
        const message=code==='not-allowed'||code==='service-not-allowed'
          ? 'Microphone permission is off. Allow it in your browser, or type below.'
          : code==='no-speech'
            ? 'No voice was heard. Tap the microphone and try again.'
            : 'Voice listening stopped. Try again or type below.';
        finish(message);
      };
      recognizer.onend=()=>{
        if(isCurrent()) finish('Tap the microphone when you are ready to speak.');
      };

      try{
        recognizer.start();
        onState('listening');
        onStatus('Listening… speak your plant or healing question now.');
        return true;
      }catch(e){
        if(isCurrent()){
          listening=false;
          activeRecognitionGeneration=0;
          recognition=null;
        }
        onStatus('The microphone is busy. Wait a breath and tap it again.');
        onState('idle');
        return false;
      }
    }

    function stopListening(){
      if(!recognition || !listening) return false;
      const recognizer=recognition;
      listening=false;
      activeRecognitionGeneration=0;
      recognitionGeneration++;
      recognition=null;
      try{recognizer.stop();}catch(e){}
      onState('idle');
      onStatus('Voice listening stopped.');
      return true;
    }

    function matchingVoice(lang){
      if(!synthesis || typeof synthesis.getVoices!=='function') return null;
      try{
        const voices=synthesis.getVoices()||[];
        const exact=voices.find(voice=>String(voice.lang||'').toLowerCase()===lang.toLowerCase());
        if(exact) return exact;
        const base=lang.split('-')[0].toLowerCase();
        return voices.find(voice=>String(voice.lang||'').toLowerCase().split('-')[0]===base)||null;
      }catch(e){return null;}
    }

    function speak(value){
      const chunks=speechChunks(value);
      if(!enabled || !chunks.length || !synthesis || !Utterance) return false;
      stopListening();
      const generation=++speechGeneration;
      activeSpeechGeneration=generation;
      try{synthesis.cancel();}catch(e){}
      const lang=language();
      const voice=matchingVoice(lang);
      let available=[];
      try{available=typeof synthesis.getVoices==='function'?(synthesis.getVoices()||[]):[];}catch(e){}
      if(!voice && available.length) onStatus('No installed voice matches this language; your device will use its closest voice.');

      function speakChunk(index){
        if(activeSpeechGeneration!==generation) return;
        if(index>=chunks.length){
          activeSpeechGeneration=0;
          onState('idle');
          return;
        }
        try{
          const utterance=new Utterance(chunks[index]);
          utterance.lang=lang;
          if(voice) utterance.voice=voice;
          utterance.rate=0.92;
          utterance.pitch=0.92;
          utterance.onstart=()=>{
            if(activeSpeechGeneration===generation) onState('speaking');
          };
          utterance.onend=()=>{
            if(activeSpeechGeneration===generation) speakChunk(index+1);
          };
          utterance.onerror=()=>{
            if(activeSpeechGeneration!==generation) return;
            activeSpeechGeneration=0;
            onState('idle');
            onStatus('This device could not finish speaking the reply. The words remain on screen; tap Replay to try again.');
          };
          synthesis.speak(utterance);
        }catch(e){
          if(activeSpeechGeneration!==generation) return;
          activeSpeechGeneration=0;
          onState('idle');
          onStatus('This device could not speak the reply. The words remain on screen; tap Replay to try again.');
        }
      }
      speakChunk(0);
      return true;
    }

    function stopSpeaking(){
      if(!synthesis) return false;
      invalidateSpeech(true);
      return true;
    }

    function setEnabled(value){
      enabled=value===true;
      if(!enabled) stopSpeaking();
      return enabled;
    }

    return {
      isRecognitionSupported:()=>!!Recognition,
      isSpeechSupported:()=>!!(synthesis&&Utterance),
      isListening:()=>listening,
      startListening,
      stopListening,
      speak,
      stopSpeaking,
      setEnabled,
      isEnabled:()=>enabled,
    };
  }

  return {createVoiceController, createRequestCoordinator, speechText, speechChunks};
});
