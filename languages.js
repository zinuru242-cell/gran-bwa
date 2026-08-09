(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.GranBwaLanguages=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const GLOBAL_LANGUAGE_CODES=["aa","ab","abq","abq-Latn","abr","ace","ach","acr","ada","ady","ae","aeb","af","agq","agu","ak","aln","alt","am","amo","an","ann","aoz","apc","apd","ar","arn","aro","arq","ars","ary","arz","as","asa","ast","atj","av","awa","ay","az","az-Arab","az-Cyrl","ba","bal","ban","ban-Bali","bap","bar","bas","bax","bbc","bbj","bci","be","bej","bem","bew","bez","bfd","bfq","bft","bfy","bg","bgc","bgn","bgx","bhb","bhi","bho","bi","bik","bin","bjj","bjn","bjt","bkm","bku","bla","blo","blt","bm","bm-Nkoo","bmq","bn","bo","bpy","bqi","bqv","br","bra","brh","brx","bs","bs-Cyrl","bsc","bsq","bss","bto","btv","bua","buc","bug","bum","bvb","byn","byv","bza","bze","bzj","ca","caa","cab","cac","cad","cak","cch","ccp","ccr","ce","ceb","cgg","ch","chk","chm","cho","chp","chr","cic","cja","cjm","ckb","ckz","clc","co","cop","cps","cr","crg","crh","crk","crl","crs","cs","csb","csw","cu","cv","cy","da","dak","dar","dav","dcc","de","den","dgr","dje","dnj","doi","dsb","dtm","dtp","dty","dua","dv","dyo","dyu","dz","ebu","ecy","ee","efi","egl","el","en","en-Shaw","eo","es","esu","et","eu","ewo","ext","fa","fan","fbl","ff","ff-Adlm","ffm","fi","fia","fil","fit","fj","fo","fon","fr","frc","frp","frr","frs","fud","fuq","fur","fuv","fvr","fy","ga","gaa","gag","gan","gay","gbm","gbz","gcr","gd","gez","gil","gjk","gju","gl","glk","gmy","gn","gon","gor","gos","grb","grc","grr","grt","gsw","gu","gub","guc","gur","guz","gv","gvr","gwi","ha","ha-Arab","hak","hak-Hant","haw","haz","he","hi","hi-Latn","hif","hil","hnd","hne","hnj","hnn","hno","ho","hoc","hoj","hr","hsb","hsn","ht","hu","hur","hy","hz","ia","iba","ibb","id","ie","ife","ig","ii","ik","ilo","inh","io","is","it","itz","iu","iu-Latn","ixl","izh","ja","jac","jam","jbo","jgo","jmc","jml","jut","jv","ka","kaa","kab","kac","kaj","kam","kao","kaw","kbd","kcg","kck","kde","kdt","kea","kek","ken","kfo","kfr","kfy","kg","kge","kgp","kha","khb","khn","khq","kht","khw","ki","kiu","kj","kjb","kjg","kk","kk-Arab","kkj","kl","kln","km","kmb","kn","knf","knj","knn","ko","koi","kok","kos","kpe","kqn","kr","krc","kri","krj","krl","kro","kru","ks","ksb","ksf","ksh","kss","ku","ku-Arab","ku-Cyrl","kum","kv","kvr","kvx","kw","kwk","kxm","kxp","kxv","ky","ky-Arab","ky-Latn","la","lad","lag","lah","laj","lb","lbe","lbw","lcp","leb","len","lep","lez","lg","li","lif","lij","lil","lir","lis","ljp","lki","lkt","lld","lmn","lmo","ln","lo","lol","loz","lrc","lt","ltg","lu","lua","lue","lun","luo","luy","luz","lv","lwl","lzh","lzz","lzz-Geor","mad","maf","mag","mai","mak","mam","man","man-Nkoo","mas","maz","mdf","mdh","mdr","men","mer","mev","mey","mey-Latn","mfa","mfe","mfv","mg","mgh","mgo","mgp","mgy","mh","mhn","mi","mic","min","mk","ml","mls","mn","mn-Mong","mni","mnw","moe","moh","mop","mos","mr","mrd","mrj","mro","ms","ms-Arab","mt","mtr","mua","mus","mvy","mwk","mwr","mwv","mww","mxc","my","myv","myx","mzb","mzn","na","nan","nan-Hant","nap","naq","nb","nch","nd","ndc","nds","ne","new","ng","ngl","nhe","nhw","nij","niu","njo","nl","nmg","nn","nnh","no","nod","noe","nqo","nr","nse","nsk","nso","nus","nv","nxq","ny","nym","nyn","nzi","oc","oj","ojs","ojw","oka","om","or","os","osa","pa","pa-Arab","pag","pam","pap","pau","pcd","pcm","pdc","pdt","pfl","pi","pi-Deva","pi-Mymr","pi-Sinh","pi-Thai","pis","pko","pl","pms","pnt","pnt-Cyrl","pnt-Latn","poc","poh","pon","ppl","pqm","prd","prg","ps","pt","puu","qu","quc","qug","qum","quv","raj","rcf","rej","rgn","rhg","ria","rif","rif-Tfng","rjs","rkt","rm","rmf","rmo","rmt","rmu","rn","rng","ro","rob","rof","rtm","ru","rue","rug","rw","rwk","ryu","sa","saf","sah","saq","sas","sat","sav","saz","sbp","sc","sck","scn","sco","sd","sd-Deva","sdc","sdh","se","sef","seh","sei","ses","sg","sgs","sh","shi","shi-Latn","shn","si","sid","sk","skr","sl","sli","sly","sm","sma","smj","smn","sms","sn","snf","snk","so","sou","sq","sr","sr-Latn","srn","srr","srx","ss","ssy","st","stq","stu","stu-Tale","su","suk","sus","suz","sv","sw","swb","swg","swv","sxn","syl","syr","szl","ta","taj","tbw","tcy","tdd","tdg","tdh","te","tem","teo","tet","tg","tg-Arab","th","thl","thq","thr","ti","tig","tiv","tk","tkl","tkr","tkt","tl","tly","tmh","tn","tnr","to","tog","toi","tpi","tr","tru","trv","trw","ts","tsd","tsg","tsj","tt","ttc","ttj","tts","ttt","tum","tvl","tw","twq","ty","tyv","tzj","tzm","udm","ug","ug-Cyrl","uk","uli","umb","und","unr","unr-Deva","unx","ur","usp","uz","uz-Arab","uz-Cyrl","vai","vai-Latn","ve","vec","vep","vi","vic","vls","vmf","vmw","vo","vot","vro","vun","wa","wae","wal","war","wbp","wbq","wbr","wls","wni","wo","wtm","wuu","xav","xh","xin","xmf","xnr","xog","xsr","yao","yap","yav","ybb","yi","yo","yrl","yua","yue","yue-Hans","za","zag","zdj","zea","zgh","zh","zh-Hant","zmi","zu","zza"];
  const COUNTRY_LANGUAGE_CODES={"AC":["en"],"AD":["ca","es","fr"],"AE":["ar","en","ml","ps","bal","fa"],"AF":["fa","ps","uz-Arab","tk","haz","prd","bgn","kaa","ug","kk-Arab"],"AG":["en","pt"],"AI":["en"],"AL":["sq","el","mk"],"AM":["hy","ru","ku","ku-Cyrl","az"],"AO":["pt","umb","kmb","ln"],"AQ":["und"],"AR":["es","en","cy","gn"],"AS":["sm","en"],"AT":["de","hr","sl","hu","bar","en","fr","it"],"AU":["en","zh-Hant","it","wbp","hnj"],"AW":["nl","pap","en"],"AX":["sv"],"AZ":["az","az-Cyrl","tly","ku","ku-Cyrl","ttt","tkr"],"BA":["bs","bs-Cyrl","hr","sr","sr-Latn","en"],"BB":["en"],"BD":["bn","en","rkt","syl","rhg","ccp","my","grt","mro","mni"],"BE":["nl","fr","de","en","vls","wa"],"BF":["fr","mos","dyu","ff","ff-Adlm"],"BG":["bg","en","ru","tr","de"],"BH":["ar","ml"],"BI":["rn","fr","en","sw"],"BJ":["fr","fon","yo","blo"],"BL":["fr"],"BM":["en"],"BN":["ms","ms-Arab","zh-Hant","en"],"BO":["es","qu","ay","gn","aro"],"BQ":["nl","pap"],"BR":["pt","vec","en","de","it","ja","es","kgp","ko","yrl","gub","xav"],"BS":["en"],"BT":["dz","ne","tsj","en","lep"],"BV":["no"],"BW":["en","tn","af"],"BY":["ru","be"],"BZ":["en","es","bzj","kek","mop","cab"],"CA":["en","fr","iu","iu-Latn","crk","chp","den","dgr","gwi","es","zh","pa","ar","hi","fil","yue","it","de","ur","pt","ru","ta","vi","fa","gu","ko","pl","el","uk","bn","ro","nl","ja","sr","tr","hr","hu","so","pdt","oj","ojs","moe","mic","atj","bla","cr","crl","csw","war","ojw","crg","moh","dak","hur","nsk","clc","kwk","pqm","oka","lil"],"CC":["en","ms-Arab"],"CD":["fr","sw","lua","ln","kg","lu","lol","rw"],"CF":["sg","fr","ln"],"CG":["fr","ln"],"CH":["de","fr","it","gsw","rm","en","lmo","pt","rmo","wae"],"CI":["fr","bci","sef","dnj","kfo","bqv"],"CK":["en"],"CL":["es","en","arn"],"CM":["fr","en","bum","ff","ewo","ybb","bbj","nnh","bkm","bas","bax","byv","mua","maf","bfd","bss","kkj","dua","mgo","ar","jgo","ksf","ken","agq","ha-Arab","nmg","yav","ff-Adlm"],"CN":["zh","ug","za","mn-Mong","bo","ko","wuu","yue","yue-Hans","hsn","hak","nan","gan","ii","kk-Arab","lis","ky-Arab","nxq","khb","tdd","mww","lcp","en","hnj","ru","vi","uz-Cyrl","lzh","stu-Tale"],"CO":["es","guc","yrl"],"CP":["und"],"CQ":["en"],"CR":["es"],"CU":["es"],"CV":["pt","kea"],"CW":["nl","pap","es"],"CX":["en"],"CY":["el","tr","en","fr","hy","ar","ecy"],"CZ":["cs","en","sk","de","pl"],"DE":["de","frr","en","fr","bar","nds","nl","it","es","ru","vmf","tr","gsw","da","swg","hr","ku","el","ksh","pl","hsb","dsb","frs","stq","pfl"],"DG":["en"],"DJ":["fr","ar","aa","so"],"DK":["da","de","kl","en","sv","fo","jut"],"DM":["en"],"DO":["es","en"],"DZ":["ar","fr","arq","mey","kab","en","mzb","grr"],"EA":["es"],"EC":["es","qu","qug"],"EE":["et","ru","en","fi","vro","ie"],"EG":["ar","arz","en","cop","el"],"EH":["ar","mey"],"ER":["en","ar","ti","tig","aa","ssy","byn"],"ES":["es","ca","gl","eu","ast","oc","en","ext","an"],"ET":["am","en","om","so","ti","sid","wal","aa","gez"],"FI":["fi","sv","sms","en","de","ru","et","rmf","se","smn"],"FJ":["en","hif","fj","hi","rtm"],"FK":["en"],"FM":["en","chk","pon","kos","yap","uli"],"FO":["fo"],"FR":["fr","en","es","de","oc","it","pt","pcd","gsw","br","co","hnj","ca","eu","nl","frp","mww","ia"],"GA":["fr","puu"],"GB":["en","cy","ga","gd","fr","de","es","pl","pa","ur","ta","gu","sco","ro","bn","ar","zh-Hant","it","lt","pt","so","tr","kw","pi","en-Shaw"],"GD":["en"],"GE":["ka","ab","os","xmf","ru","hy","ku-Cyrl","lzz-Geor"],"GF":["fr","gcr","zh-Hant","hnj"],"GG":["en"],"GH":["en","ak","ee","gaa","abr","gur","ada","nzi","ha","saf","ff","ff-Adlm"],"GI":["en","es"],"GL":["kl","da"],"GM":["en","man","man-Nkoo","ff","ff-Adlm"],"GN":["fr","ff","man","man-Nkoo","sus","nqo","kpe","ff-Adlm"],"GP":["fr"],"GQ":["es","fr","pt","fan","bvb"],"GR":["el","en","fr","de","pnt","mk","tr","bg","sq","tsd","gmy","grc"],"GS":["en"],"GT":["es","cak","quc","ixl","caa","quv","usp","xin","kek","mam","en","kjb","poh","acr","tzj","knj","cac","jac","agu","poc","qum","cab","ttc","ckz","mop","itz"],"GU":["ch","en"],"GW":["pt","fr","knf","ff","ff-Adlm"],"GY":["en"],"HK":["zh-Hant","en","yue","zh"],"HM":["und"],"HN":["es","cab","en"],"HR":["hr","it","vec","en"],"HT":["ht","fr"],"HU":["hu","en","de","fr","ro","hr","sk","sl"],"IC":["es"],"ID":["id","jv","su","mad","ms","min","bew","ban","bug","bjn","ace","ms-Arab","sas","bbc","zh-Hant","mak","ljp","rej","gor","nij","kge","aoz","kvr","lbw","gay","rob","mdr","sxn","sly","mwv","ban-Bali","kaw"],"IE":["en","ga","fr"],"IL":["he","ar","en","apc","ru","ro","yi","pl","lad","hu","am","ti","ml"],"IM":["en","gv"],"IN":["hi","en","bn","te","mr","ta","ur","gu","kn","ml","or","pa","as","mai","ne","sat","ks","kok","sd","sd-Deva","kha","sa","bho","awa","bgc","mag","mwr","hne","dcc","bjj","wtm","rkt","knn","swv","gbm","lmn","gon","kfy","doi","kru","sck","wbq","xnr","khn","tcy","wbr","brx","noe","bhb","mni","hi-Latn","raj","hoc","mtr","unr","bhi","hoj","kfr","grt","unx","bfy","srx","saz","ccp","bfq","njo","ria","bo","bpy","bft","bra","lep","kxv","btv","lif","lah","kht","dv","dz","pi-Deva"],"IO":["en"],"IQ":["ar","ckb","az-Arab","en","ku-Arab","fa","lrc","syr"],"IR":["fa","az-Arab","mzn","glk","sdh","tk","lrc","ar","bal","rmt","bqi","luz","lki","kaa","ckb","bgn","ku-Arab","prd","hy","ps","ka","gbz","kk-Arab"],"IS":["is","da"],"IT":["it","fr","vec","en","lmo","sc","de","pms","nap","lij","scn","sdc","sl","fur","egl","lld","ca","el","hr","mhn","rgn"],"JE":["en"],"JM":["en","jam"],"JO":["ar","apc","en"],"JP":["ja","ryu","ko"],"KE":["sw","en","ki","luy","luo","kam","kln","guz","mer","mas","ebu","so","dav","teo","pko","om","saq","ar","pa","gu"],"KG":["ky","ru","kaa"],"KH":["km","cja","kdt"],"KI":["en","gil"],"KM":["ar","zdj","wni","fr"],"KN":["en"],"KP":["ko"],"KR":["ko"],"KW":["ar"],"KY":["en"],"KZ":["ru","kk","en","de","ug-Cyrl","kaa"],"LA":["lo","kjg","hnj","mww","kdt"],"LB":["ar","apc","en","fr","hy","ku-Arab"],"LC":["en"],"LI":["de","gsw","wae"],"LK":["si","ta","en","pi-Sinh"],"LR":["en","lir","kpe","bsq","kro","grb","dnj","mev","kss","vai","bza","men","ff","ff-Adlm","vai-Latn"],"LS":["st","en","zu","ss","xh"],"LT":["lt","ru","en","de","sgs"],"LU":["fr","lb","de","en","pt"],"LV":["lv","en","ru","ltg"],"LY":["ar"],"MA":["ar","tzm","fr","ary","zgh","en","shi","shi-Latn","rif","rif-Tfng","mey","es"],"MC":["fr"],"MD":["ro","uk","bg","gag","ru"],"ME":["sr-Latn","sq","sr"],"MF":["fr"],"MG":["mg","fr","en"],"MH":["en","mh"],"MK":["mk","sq","tr"],"ML":["fr","bm","ffm","snk","mwk","ses","tmh","bm-Nkoo","khq","dtm","kao","ar","bmq","bze"],"MM":["my","shn","kac","rhg","mnw","hnj","stu","kht","pi-Mymr"],"MN":["mn","kk-Arab","zh","ru","ug-Cyrl"],"MO":["zh-Hant","pt","yue","en","zh","nan-Hant","fil"],"MP":["en","ch"],"MQ":["fr"],"MR":["ar","mey","fr","ff","wo","ff-Adlm"],"MS":["en"],"MT":["mt","en","it","fr"],"MU":["fr","en","mfe","bho","ur","ta"],"MV":["dv","en"],"MW":["en","ny","tum","tog","zu"],"MX":["es","en","yua","nhe","nhw","maz","nch","vec","sei"],"MY":["ms","en","zh","ta","iba","jv","zmi","dtp","ml","bug","bjn"],"MZ":["pt","vmw","ndc","ts","ngl","seh","mgh","rng","ny","yao","sw","zu"],"NA":["en","af","kj","ng","naq","hz","de","tn"],"NC":["fr"],"NE":["fr","ha","dje","fuq","tmh","ar","twq","ff","ff-Adlm"],"NF":["en"],"NG":["en","yo","pcm","ha","ig","fuv","tiv","efi","ibb","ha-Arab","bin","kaj","kcg","ar","cch","amo","ann","ff","ff-Adlm"],"NI":["es"],"NL":["nl","fy","en","de","fr","nds","li","gos","id","zea","rif","tr"],"NO":["nb","no","nn","se"],"NP":["ne","mai","bho","new","jml","en","dty","awa","thl","bap","tdg","thr","lif","mgp","thq","mrd","bfy","xsr","rjs","taj","hi","gvr","bo","tkt","suz","tdh","bn","unr-Deva","lep"],"NR":["en","na"],"NU":["en","niu"],"NZ":["mi","en"],"OM":["ar","bal","fa"],"PA":["es","en","zh-Hant"],"PE":["es","qu","ay"],"PF":["fr","ty","zh-Hant"],"PG":["tpi","en","ho"],"PH":["en","fil","ceb","ilo","hil","war","pag","mdh","tsg","es","bik","fbl","pam","zh-Hant","cps","krj","bto","hnn","tbw","bku"],"PK":["ur","en","pa-Arab","lah","ps","sd","skr","bal","hno","brh","fa","bgn","hnd","tg-Arab","gju","bft","kvx","khw","mvy","gjk","kxp","ks","trw","btv"],"PL":["pl","de","csb","lt","en","ru","szl","be","uk","sli","prg"],"PM":["fr","en"],"PN":["en"],"PR":["es","en"],"PS":["ar","apc"],"PT":["pt","en","fr","es","gl"],"PW":["pau","en"],"PY":["gn","es","de"],"QA":["ar","fa","ml"],"RE":["fr","rcf","ta"],"RO":["ro","en","fr","es","hu","de","tr","sr-Latn","bg","el","pl"],"RS":["sr","sr-Latn","hu","ro","hr","sk","uk","sq"],"RU":["ru","tt","ba","ce","av","udm","sah","kbd","myv","bua","mdf","kum","kv","lez","krc","inh","tyv","az-Cyrl","ady","lbe","koi","cv","hy","chm","os","dar","krl","pnt-Cyrl","abq","mrj","alt","fi","sr","vep","mn","kaa","izh","cu","vot"],"RW":["rw","en","fr"],"SA":["ar","ars"],"SB":["en","pis","rug"],"SC":["fr","en","crs"],"SD":["ar","en","apd","bej","fvr","ha-Arab","mls","fia","zag"],"SE":["sv","fi","en","fit","se","rmu","yi","smj","sma","ia"],"SG":["en","zh","ms","ta","ml","pa"],"SH":["en"],"SI":["sl","vec","hr","en","de","hu","it"],"SJ":["nb","ru"],"SK":["sk","cs","en","de","hu","uk","pl"],"SL":["en","kri","men","tem","ff","ff-Adlm"],"SM":["it","eo"],"SN":["fr","wo","ff","srr","dyo","sav","mfv","bjt","snf","knf","bsc","mey-Latn","tnr","ff-Adlm"],"SO":["so","ar","sw","om"],"SR":["nl","srn","zh-Hant","hnj"],"SS":["en","ar","nus"],"ST":["pt","fr"],"SV":["es","ccr","ppl","len"],"SX":["en","nl","es","vic"],"SY":["ar","apc","ku","fr","hy","syr"],"SZ":["en","ss","zu","ts"],"TA":["en"],"TC":["en"],"TD":["ar","fr"],"TF":["fr"],"TG":["fr","ee","ife","blo"],"TH":["th","en","tts","nod","sou","mfa","zh-Hant","kxm","kdt","mnw","hnj","shn","mww","lcp","lwl","pi-Thai"],"TJ":["tg","ru","fa","ar"],"TK":["tkl","en","sm"],"TL":["pt","tet"],"TM":["tk","ru","uz","ku-Cyrl","kaa"],"TN":["ar","fr","aeb"],"TO":["to","en"],"TR":["tr","en","ku","apc","zza","kbd","az","az-Arab","ar","bgx","bg","ady","kiu","kaa","hy","ka","sr-Latn","lzz","sq","abq-Latn","pnt-Latn","ab","el","tru","uz","ky-Latn","kk"],"TT":["en","es"],"TV":["tvl","en"],"TW":["zh-Hant","nan-Hant","hak-Hant","trv"],"TZ":["sw","en","suk","nym","kde","bez","ksb","mas","mgy","asa","lag","jmc","rof","vun","rwk","sbp"],"UA":["uk","ru","pl","yi","rue","be","crh","ro","bg","tr","hu","el"],"UG":["sw","en","lg","nyn","cgg","xog","teo","laj","ach","myx","rw","ttj","hi"],"UM":["en"],"US":["en","es","haw","zh-Hant","fr","de","fil","it","vi","ko","ru","mww","nv","yi","pdc","hnj","frc","chr","esu","dak","cho","lkt","ik","mus","oka","cad","cic","io","jbo","osa"],"UY":["es"],"UZ":["uz","uz-Cyrl","ru","kaa","tr"],"VA":["it","la"],"VC":["en"],"VE":["es","yrl"],"VG":["en"],"VI":["en"],"VN":["vi","mww","zh-Hant","blt","hnj","cjm"],"VU":["bi","en","fr"],"WF":["fr","wls","fud"],"WS":["sm","en"],"XK":["sq","sr","sr-Latn","aln"],"YE":["ar","en"],"YT":["fr","swb","buc","sw"],"ZA":["en","zu","xh","af","nso","tn","st","ts","ss","ve","nr","hi","sw"],"ZM":["en","bem","ny","toi","loz","nse","leb","tum","kqn","lun","lue"],"ZW":["sn","en","nd","mxc","ndc","kck","ny","ve","tn"],"ZZ":[]};

  function basicLanguageTag(value){
    const cleaned=String(value||'').trim().replace(/_/g,'-');
    const parts=cleaned.split('-');
    if(!cleaned||!/^[A-Za-z]{2,3}$/.test(parts[0])||parts.some(part=>!part||!/^[A-Za-z0-9]{1,8}$/.test(part)))return '';
    let extension=false;
    return parts.map((part,index)=>{
      if(index===0)return part.toLowerCase();
      if(part.length===1){extension=true;return part.toLowerCase();}
      if(extension)return part.toLowerCase();
      if(part.length===4&&/^[A-Za-z]+$/.test(part))return part[0].toUpperCase()+part.slice(1).toLowerCase();
      if((part.length===2&&/^[A-Za-z]+$/.test(part))||/^\d{3}$/.test(part))return part.toUpperCase();
      return part.toLowerCase();
    }).join('-');
  }

  function normalizeLanguageTag(value,intlApi){
    const cleaned=String(value||'').trim().replace(/_/g,'-');
    if(!cleaned)return '';
    const basic=basicLanguageTag(cleaned);
    if(!basic)return '';
    if(basic.split('-')[0]==='tw')return basic;
    const canonicalizer=arguments.length>1?intlApi:(typeof Intl!=='undefined'?Intl:null);
    if(canonicalizer&&typeof canonicalizer.getCanonicalLocales==='function'){
      try{return canonicalizer.getCanonicalLocales(cleaned)[0]||'';}catch(e){return '';}
    }
    return basic;
  }

  const COUNTRY_LANGUAGE_ADDITIONS={GH:['tw']};

  function countryLanguages(countryCode){
    const country=String(countryCode||'').toUpperCase();
    const combined=[...(COUNTRY_LANGUAGE_CODES[country]||[]),...(COUNTRY_LANGUAGE_ADDITIONS[country]||[])];
    return [...new Set(combined.map(normalizeLanguageTag))];
  }

  function regionalTag(languageTag,countryCode){
    const tag=normalizeLanguageTag(languageTag);
    const country=String(countryCode||'').toUpperCase();
    if(!tag||!/^[A-Z]{2}$/.test(country)) return tag;
    const parts=tag.split('-');
    if(parts.slice(1).some(part=>/^[A-Z]{2}$/.test(part)||/^\d{3}$/.test(part))) return tag;
    return tag+'-'+country;
  }

  function displayNames(locale){
    if(typeof Intl==='undefined'||typeof Intl.DisplayNames!=='function') return {language:null,region:null};
    try{
      return {
        language:new Intl.DisplayNames([locale||'en'],{type:'language',fallback:'code'}),
        region:new Intl.DisplayNames([locale||'en'],{type:'region',fallback:'code'}),
      };
    }catch(e){return {language:null,region:null};}
  }

  const LANGUAGE_NAME_OVERRIDES={tw:'Twi'};

  function languageName(tag,names){
    const normalized=normalizeLanguageTag(tag);
    const override=LANGUAGE_NAME_OVERRIDES[normalized.split('-')[0]];
    if(override) return override;
    try{return names.language?names.language.of(normalized):normalized;}catch(e){return normalized;}
  }

  function buildLanguageOptions(options){
    options=options||{};
    const country=String(options.countryCode||'').toUpperCase();
    const names=displayNames(options.displayLocale||'en');
    const result=[];
    const seen=new Set();
    function add(value,label,group,spokenName){
      value=normalizeLanguageTag(value);
      if(seen.has(value)) return;
      seen.add(value);
      result.push({value,label,group,languageName:spokenName||label});
    }
    add('','Device language','Device','');
    for(const voice of options.voices||[]){
      const tag=normalizeLanguageTag(voice&&voice.lang);
      const spokenName=languageName(tag,names);
      if(tag) add(tag,spokenName+' — '+String(voice.name||'device voice'),'Available on this device',spokenName);
    }
    if(country){
      let countryName=country;
      try{if(names.region)countryName=names.region.of(country);}catch(e){}
      for(const code of countryLanguages(country)){
        const tag=regionalTag(code,country);
        const spokenName=languageName(code,names);
        add(tag,spokenName+' · '+countryName,'Suggested for selected land',spokenName);
      }
    }
    const globals=GLOBAL_LANGUAGE_CODES.map(normalizeLanguageTag).map(tag=>({tag,label:languageName(tag,names)}));
    globals.sort((a,b)=>a.label.localeCompare(b.label,options.displayLocale||'en'));
    for(const item of globals) add(item.tag,item.label,'All global languages');
    return result;
  }

  return {GLOBAL_LANGUAGE_CODES,COUNTRY_LANGUAGE_CODES,normalizeLanguageTag,countryLanguages,regionalTag,buildLanguageOptions};
});
