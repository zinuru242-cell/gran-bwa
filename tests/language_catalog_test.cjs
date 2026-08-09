const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const {
  buildLanguageOptions,
  countryLanguages,
  normalizeLanguageTag,
}=require('../languages.js');

assert.strictEqual(normalizeLanguageTag('zh_Hant_TW'),'zh-Hant-TW');
assert.strictEqual(normalizeLanguageTag('EN_us'),'en-US');
assert.strictEqual(normalizeLanguageTag('en-US-u-ca-gregory'),'en-US-u-ca-gregory');
assert.strictEqual(normalizeLanguageTag('zh_Hant_TW',null),'zh-Hant-TW');
assert.strictEqual(normalizeLanguageTag('EN_us',null),'en-US');
assert.strictEqual(normalizeLanguageTag('en-US-u-ca-gregory',null),'en-US-u-ca-gregory');
assert.strictEqual(normalizeLanguageTag('bad--tag',null),'');

const za=countryLanguages('ZA');
for(const code of ['en','af','zu','xh','nso','st','tn','ts','ss','ve','nr']){
  assert(za.includes(code),`South Africa is missing ${code}`);
}
const gh=countryLanguages('GH');
for(const code of ['en','ak','tw','ee']) assert(gh.includes(code),`Ghana is missing ${code}`);

const options=buildLanguageOptions({countryCode:'ZA',voices:[]});
assert(options.length>=200,`expected a global catalog, got ${options.length}`);
const values=options.map(option=>option.value);
for(const code of ['','ar','hi','ja','ko','sw','th','uk','vi','xh-ZA','zu-ZA','nso-ZA']){
  assert(values.includes(code),`global selector is missing ${code||'device language'}`);
}
assert.strictEqual(new Set(values).size,values.length,'language values must be unique');
assert(options.find(option=>option.value==='xh-ZA').group==='Suggested for selected land');

const ghOptions=buildLanguageOptions({countryCode:'GH',voices:[]});
const twi=ghOptions.find(option=>option.value==='tw-GH');
assert(twi&&twi.label.startsWith('Twi'),`Twi must keep its living name, got ${twi&&twi.label}`);
assert.strictEqual(twi.languageName,'Twi');

const withDeviceVoice=buildLanguageOptions({
  countryCode:'GH',
  voices:[{lang:'yue-HK',name:'Hong Kong Cantonese'}],
});
const cantonese=withDeviceVoice.find(option=>option.value==='yue-HK');
assert(cantonese,'exact installed voices must be available');
assert(cantonese.label.includes('Hong Kong Cantonese'));
assert.strictEqual(new Set(withDeviceVoice.map(item=>item.value)).size,withDeviceVoice.length,'values must be unique');

const legacySandbox={module:{exports:{}},exports:{},Intl:{},globalThis:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../languages.js'),'utf8'),legacySandbox);
const legacyOptions=legacySandbox.module.exports.buildLanguageOptions({countryCode:'GH',voices:[]});
assert(legacyOptions.length>=785,`legacy browser catalog collapsed to ${legacyOptions.length}`);
assert(legacyOptions.some(item=>item.value==='tw-GH'),'legacy browser lost Twi');
assert(legacyOptions.some(item=>item.value==='zh-Hant'),'legacy browser lost script-tagged languages');

console.log('global language catalog tests passed');
