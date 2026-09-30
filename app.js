const pairs = [
  {images:['cat-01-closeup.png','cat-02-headphones-open-mouth.png'],names:['코를 내민 고양이','헤드폰을 쓰고 노래하는 고양이'],sound:'normal.mp3'},
  {images:['cat-04-smiling-closeup.png','cat-05-petting-hand.png'],names:['웃는 고양이','쓰다듬 받는 고양이'],sound:'purr.mp3'},
  {images:['cat-03-jumping.png','cat-11-raised-paw.png'],names:['점프하는 고양이','앞발을 든 고양이'],sound:'ang.mp3'},
  {images:['cat-06-sitting-kitten.png','cat-10-looking-up.png'],names:['앉은 아기 고양이','올려다보는 아기 고양이'],sound:'baby.mp3'},
  {images:['cat-08-headphones-gray.png','cat-07-sad-kitten.png'],names:['음악 듣는 고양이','시무룩한 고양이'],sound:'sad.mp3'},
  {images:['cat-12-toothbrush.png','cat-09-ice-cream.png'],names:['칫솔 고양이','아이스크림 고양이'],sound:'drink.mp3'}
];
const rain=document.querySelector('#rain');
const toggle=document.querySelector('#rain-toggle');
const label=document.querySelector('#rain-label');
const status=document.querySelector('#status');
let rainWanted=true, rainBlocked=false, currentEffect=null;
rain.volume=.35;
function updateRain(){const playing=!rain.paused;toggle.setAttribute('aria-pressed',String(playing));label.textContent=playing?'빗소리 끄기':'빗소리 켜기';}
async function startRain(){if(!rainWanted)return;try{await rain.play();rainBlocked=false;}catch{rainBlocked=true;}updateRain();}
toggle.addEventListener('click',()=>{if(!rain.paused){rainWanted=false;rain.pause();updateRain();}else{rainWanted=true;void startRain();}});
rain.addEventListener('play',updateRain);rain.addEventListener('pause',updateRain);
document.addEventListener('click',e=>{if(rainBlocked&&rainWanted&&!toggle.contains(e.target))void startRain();});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&rainBlocked&&rainWanted&&document.activeElement!==toggle)void startRain();});
const entries=pairs.map((pair,index)=>{
 const button=document.createElement('button');button.type='button';button.className='cat';
 const imgs=pair.images.map((filename,i)=>{const img=new Image();img.src='assets/'+filename;img.alt=pair.names[i];img.draggable=false;img.classList.toggle('hidden',i===1);img.setAttribute('aria-hidden',String(i===1));button.append(img);return img;});
 const sound=new Audio('assets/'+pair.sound);sound.preload='auto';
 const entry={button,imgs,sound,state:0,pair};button.setAttribute('aria-label',`${index+1}번 ${pair.names[0]} — 누르면 모습과 소리가 바뀝니다`);
 button.addEventListener('click',()=>activate(index));document.querySelector('#garden').append(button);return entry;
});
function activate(index){const e=entries[index];e.state=1-e.state;e.imgs.forEach((img,i)=>{img.classList.toggle('hidden',i!==e.state);img.setAttribute('aria-hidden',String(i!==e.state));});e.button.setAttribute('aria-label',`${index+1}번 ${e.pair.names[e.state]} — 누르면 모습과 소리가 바뀝니다`);e.button.classList.remove('pop');void e.button.offsetWidth;e.button.classList.add('pop');if(currentEffect){currentEffect.pause();currentEffect.currentTime=0;}currentEffect=e.sound;e.sound.currentTime=0;e.sound.play().catch(()=>{status.textContent='소리를 재생하지 못했어요. 다시 눌러주세요.';});return {set:index+1,image:e.pair.names[e.state]};}
void startRain();
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'switch_cat',description:'Switch one cat pair to its other image and play its sound.',inputSchema:{type:'object',properties:{set:{type:'integer',minimum:1,maximum:6}},required:['set'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||!Number.isInteger(input.set)||input.set<1||input.set>6)throw new Error('set must be an integer from 1 to 6');return activate(input.set-1);}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
