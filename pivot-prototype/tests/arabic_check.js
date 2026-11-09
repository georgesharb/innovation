// Arabic completeness check: walks every screen of both phones in Arabic mode and fails if Latin words remain.
// Allow-list: brand "Pivot", device unit markings drawn in the illustrations (16A, 12V, 70Ah, 2.4kW) and error codes (E03).
const {chromium}=require('playwright');
const URL='file://'+require('path').resolve(__dirname,'..','index.html');
const ALLOW=t=>t==='Pivot'||/^[0-9.,]+(A|V|Ah|kW)$/.test(t)||/^E\d+$/.test(t);
const C='.pw[data-side=customer] ',W='.pw[data-side=worker] ';
const problems=new Map();let scans=0;
async function scan(p,label,sides=['customer','worker']){
 for(const side of sides){const txt=await p.evaluate(sel=>{const root=document.querySelector(sel);if(!root)return [];const out=[];
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){const el=n.parentElement;if(!el||el.closest('[hidden],style,script'))continue;const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;const x=n.textContent.trim();if(x)out.push(x)}
  root.querySelectorAll('input,textarea').forEach(i=>{if(i.placeholder)out.push(i.placeholder)});return out},`.pw[data-side=${side}] .screenwrap`);
  scans++;
  for(const s of txt){const toks=s.match(/[0-9.,]*[A-Za-zµ][A-Za-z0-9.µ²]*/g)||[];const bad=toks.filter(t=>!ALLOW(t));
   if(bad.length){const k=`${side}: "${s.slice(0,90)}"`;if(!problems.has(k))problems.set(k,label)}}}}
const st=p=>p.evaluate(()=>PIVOT.SH.job.status);
const top=(p,s)=>p.evaluate(s=>PIVOT.topOf(s),s);
async function hold(p){const b=await p.locator(C+'.ubtn').boundingBox();await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await p.waitForTimeout(1100);await p.mouse.up();await p.waitForTimeout(350)}
async function fullFlow(p,id,tag){
 await p.keyboard.press('r');await p.waitForTimeout(200);await scan(p,tag+' home');
 await hold(p);await scan(p,tag+' grid',['customer']);
 await p.locator(C+`[data-act=pick][data-arg=${id}]`).click();await p.waitForTimeout(300);await scan(p,tag+' where',['customer']);
 await p.locator(C+'[data-act=locNext]').click();await scan(p,tag+' photo',['customer']);
 await p.locator(C+'.foot [data-act=photoTips]').click();await p.waitForTimeout(250);await scan(p,tag+' tips',['customer']);
 await p.locator(C+'.ovl [data-act=demoPhoto]').click();await p.waitForTimeout(700);await scan(p,tag+' analysing',['customer']);
 await p.waitForTimeout(1500);await scan(p,tag+' result',['customer']);
 await p.locator(C+'[data-act=findWorker]').click();await p.waitForTimeout(500);await scan(p,tag+' matching+incoming');
 await p.locator(C+'[data-act=cancelAsk]').click();await p.waitForTimeout(200);await scan(p,tag+' cancel-ov',['customer']);await p.locator(C+'.ovl .btn.ghost').click();
 await p.locator(W+'[data-act=accept]').click();await p.waitForTimeout(400);await scan(p,tag+' found+prep');
 await p.locator(C+'[data-act=go][data-arg=quote]').click();await p.waitForTimeout(250);await scan(p,tag+' quote',['customer']);
 await p.locator(C+'[data-act=acceptQuote]').click();await p.waitForTimeout(400);await scan(p,tag+' agreed+prep ok');
 for(const i of [0,1,2,3])await p.locator(W+`[data-act=tick][data-arg="${i}"]`).click();await scan(p,tag+' prep ticked',['worker']);
 await p.locator(W+'[data-act=startTrip]').click();await p.waitForTimeout(1600);
 if(await top(p,'customer')!=='track')await p.locator(C+'[data-act=track]').click().catch(()=>{});
 await p.waitForTimeout(300);await scan(p,tag+' track+nav');
 await p.locator(C+'.rbtn[data-act=chat]').click();await p.locator(C+'[data-act=qr][data-arg="0"]').click();await p.locator(C+'[data-act=qr][data-arg="1"]').click();
 await p.locator(W+'.rbtn[data-act=chat]').click();await p.locator(W+'[data-act=qr][data-arg="0"]').click();await p.waitForTimeout(400);await scan(p,tag+' chat both');
 await p.locator(C+'.hdr [data-act=call]').click();await p.waitForTimeout(2300);await scan(p,tag+' call',['customer']);await p.locator(C+'.endcall').click();
 await p.locator(C+'[data-act=back]').first().click();await p.locator(W+'[data-act=back]').first().click();
 for(let i=0;i<40&&await st(p)!=='arrived';i++)await p.waitForTimeout(250);await p.waitForTimeout(300);await scan(p,tag+' arrived');
 await p.locator(W+'[data-act=startWork]').click();await p.waitForTimeout(300);await scan(p,tag+' working');
 await p.locator(W+'[data-act=gocomplete]').click();await scan(p,tag+' complete empty',['worker']);await p.locator(W+'[data-act=afterDemo]').click();await scan(p,tag+' complete',['worker']);
 await p.locator(W+'[data-act=submitDone]').click();await p.waitForTimeout(400);await scan(p,tag+' jobdone+waiting');
 await p.locator(C+'[data-act=go][data-arg=rate]').click();await p.locator(C+'[data-act=star][data-arg="5"]').click();await p.locator(C+'[data-act=tip][data-arg="10"]').click();await scan(p,tag+' rate',['customer']);
 await p.locator(C+'[data-act=submitRating]').click();await p.waitForTimeout(500);await scan(p,tag+' followup+rated');
 const s=await st(p);if(s!=='rated')problems.set(`${tag}: flow ended in status ${s}`,'flow');
}
(async()=>{const b=await chromium.launch();const errs=[];
 for(const vp of [{width:1440,height:900,name:'desktop'},{width:390,height:844,name:'phone'}]){
  const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height},hasTouch:vp.name==='phone'});const p=await ctx.newPage();
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  if(vp.name==='desktop'){
   await p.goto(URL+'?lang=ar&fast=1');await p.waitForTimeout(400);
   for(const [id,k] of [['ceiling','A'],['breaker','B'],['car','C'],['tire','D']])await fullFlow(p,id,`${vp.name} ${k}`);
   // side screens
   await p.locator(C+'.foot [data-act=home]').click();await p.locator(W+'.foot [data-act=home]').click();await p.waitForTimeout(200);
   for(const [side,tab] of [['customer','history'],['customer','profile'],['worker','earnings'],['worker','account'],['worker','home']]){await p.locator(`.pw[data-side=${side}] [data-act=tab][data-arg=${tab}]`).first().click();await p.waitForTimeout(250);await scan(p,'tab '+tab,[side])}
   await p.locator(C+'[data-act=tab][data-arg=profile]').click();await p.locator(C+'[data-act=famapp]').click();await p.waitForTimeout(300);await scan(p,'famapp',['customer']);
   await p.locator(C+'[data-act=famHelp]').click();await scan(p,'famapp help',['customer']);await p.locator(C+'.ovl .btn').click();await p.locator(C+'[data-act=back]').click();
   await p.locator(C+'[data-act=fam][data-arg="0"]').click();await p.waitForTimeout(200);await scan(p,'fam toast',['customer']);
   await p.locator(W+'[data-act=toggleOnline]').click();await p.waitForTimeout(200);await scan(p,'worker offline',['worker']);await p.locator(W+'[data-act=toggleOnline]').click();
   await p.keyboard.press('r');await p.locator(C+'[data-act=tab][data-arg=home]').click().catch(()=>{});
   // claim
   await p.evaluate(()=>PIVOT.jumpTo('followup'));await p.waitForTimeout(300);await p.locator(C+'[data-act=go][data-arg=claim]').click();await scan(p,'claim',['customer']);await p.locator(C+'[data-act=go][data-arg=claimdone]').click();await scan(p,'claimdone',['customer']);
   // book for later
   await p.keyboard.press('r');await p.locator(C+'[data-act=later]').click();await scan(p,'later grid',['customer']);await p.locator(C+'[data-act=pick][data-arg=ac]').click();await p.locator(C+'[data-act=locNext]').click();await p.locator(C+'.foot [data-act=demoPhoto]').click();await p.waitForTimeout(1900);
   await scan(p,'later result',['customer']);await p.locator(C+'[data-act=pickTime]').click();await scan(p,'later',['customer']);await p.locator(C+'[data-act=confirmBooking]').click();await scan(p,'booked',['customer']);
   await p.locator(C+'[data-act=home]').click();await p.locator(C+'[data-act=tab][data-arg=history]').click();await scan(p,'history w/ booking',['customer']);
   // decline -> backup worker
   await p.keyboard.press('r');await p.evaluate(()=>PIVOT.jumpTo('incoming'));await p.waitForTimeout(300);await p.locator(W+'[data-act=decline]').click();await p.waitForTimeout(400);await scan(p,'declined');await p.waitForTimeout(2000);await scan(p,'backup found');
   // every other tile: where, AI result, worker alert, tracking
   for(const id of ['pipe','solar','lock','ac','gas','tank','other']){await p.evaluate(id=>PIVOT.startScenario(id),id);await p.waitForTimeout(150);await scan(p,id+' photo',['customer']);
    await p.locator(C+'.foot [data-act=demoPhoto]').click();await p.waitForTimeout(1900);await scan(p,id+' result',['customer']);
    await p.locator(C+'[data-act=findWorker]').click();await p.waitForTimeout(400);await scan(p,id+' incoming',['worker']);
    await p.evaluate(()=>PIVOT.jumpTo('track'));await p.waitForTimeout(400);await scan(p,id+' track/nav');
    await p.evaluate(()=>PIVOT.jumpTo('jobdone'));await p.waitForTimeout(300);await scan(p,id+' jobdone');
    await p.evaluate(()=>PIVOT.jumpTo('followup'));await p.waitForTimeout(300);await scan(p,id+' followup/rated')}
  } else {
   for(const [id,k] of [['ceiling','A'],['breaker','B'],['car','C'],['tire','D']]){
    for(const view of ['customer','worker']){await p.goto(URL+`?lang=ar&fast=1&view=${view}`);await p.waitForTimeout(300);
     if(view==='customer'){await p.evaluate(id=>PIVOT.startScenario(id),id);await p.locator(C+'.foot [data-act=demoPhoto]').click();await p.waitForTimeout(1900);await scan(p,`phone ${k} result`,['customer']);
      await p.locator(C+'[data-act=findWorker]').click();for(let i=0;i<20&&await st(p)!=='accepted';i++)await p.waitForTimeout(250);await scan(p,`phone ${k} found`,['customer']);
      await p.locator(C+'[data-act=go][data-arg=quote]').click();await p.locator(C+'[data-act=acceptQuote]').click();for(let i=0;i<60&&await st(p)!=='done';i++)await p.waitForTimeout(250);await scan(p,`phone ${k} jobdone`,['customer']);
      await p.locator(C+'[data-act=go][data-arg=rate]').click();await p.locator(C+'[data-act=star][data-arg="5"]').click();await p.locator(C+'[data-act=submitRating]').click();await p.waitForTimeout(300);await scan(p,`phone ${k} followup`,['customer']);
      if(await st(p)!=='rated')problems.set(`phone ${k} customer flow ended in ${await st(p)}`,'flow')}
     else{await p.evaluate(id=>{PIVOT.resetDemo();PIVOT.SH.scenario=id},id);await p.evaluate(id=>PIVOT.startScenario(id),id);await p.evaluate(()=>PIVOT.setView('worker'));
      await p.locator(W+'[data-act=simRequest]').tap();await p.waitForTimeout(400);await scan(p,`phone ${k} incoming`,['worker']);await p.locator(W+'[data-act=accept]').tap();
      for(let i=0;i<20&&await st(p)!=='confirmed';i++)await p.waitForTimeout(250);await p.locator(W+'[data-act=startTrip]').tap();for(let i=0;i<40&&await st(p)!=='arrived';i++)await p.waitForTimeout(250);await scan(p,`phone ${k} nav`,['worker']);
      await p.locator(W+'[data-act=startWork]').tap();await p.locator(W+'[data-act=gocomplete]').tap();await p.locator(W+'[data-act=submitDone]').tap();for(let i=0;i<30&&await st(p)!=='rated';i++)await p.waitForTimeout(250);await scan(p,`phone ${k} rated`,['worker']);
      if(await st(p)!=='rated')problems.set(`phone ${k} worker flow ended in ${await st(p)}`,'flow')}}}
   await p.waitForTimeout(700);
   // overflow check at phone width: any element wider than the viewport?
   const over=await p.evaluate(()=>[...document.querySelectorAll('.app *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>window.innerWidth+1||r.left<-1)&&!e.closest('svg,.qr,.scene,.mapbox,.confetti')}).slice(0,8).map(e=>e.className+' '+(e.textContent||'').slice(0,30)));
   if(over.length)problems.set('phone overflow: '+over.join(' | '),'overflow');
  }
  const miss=await p.evaluate(()=>[...PIVOT.MISSING]).catch(()=>[]);miss.forEach(m=>problems.set('MISSING KEY: '+m,'i18n'));
  await ctx.close()}
 console.log(`Scanned ${scans} phone screens in Arabic.`);
 if(problems.size){console.log(`FAIL: ${problems.size} problem(s)`);for(const [k,v] of problems)console.log(' -',v,'::',k)}else console.log('PASS: no Latin text left (except allow-listed Pivot / units / codes).');
 console.log('JS errors:',errs.length?errs:'none');await b.close();process.exit(problems.size||errs.length?1:0)})();
