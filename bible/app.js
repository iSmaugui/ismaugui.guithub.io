/* ===== Mapa dos Evangelhos — comportamento ===== */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var APP_VERSION='1.0.0';
var TITLE='Mapa dos Evangelhos';

/* ===== categorias (cores dos cartões) ===== */
var GOS={
  mt:{n:'Mateus',a:'Mt',c:'#3e4f6e',s:'#ef4b5b'},
  mk:{n:'Marcos',a:'Mc',c:'#3d7a52',s:'#ef4b5b'},
  lk:{n:'Lucas',a:'Lc',c:'#b8433a',s:'#ffe9c7'},
  jn:{n:'João',a:'Jo',c:'#6a4b93',s:'#ef4b5b'},
  nt:{n:'Novo Testamento',a:'',b:'NT',c:'#a8642a',s:'#ffe9c7'},
  ot:{n:'Antigo Testamento',a:'',b:'AT',c:'#2d7c84',s:'#ffe9c7'},
  note:{n:'Nota',a:'',b:'Nota',c:'#f3e3c3',s:'#d9534f'}
};
var YARN={mt:'#5aa9ff',mk:'#5fd06c',lk:'#ff8a5c',jn:'#b98cff',nt:'#ffb347',ot:'#3fd6cf',note:'#ffcf2a'};
var PALETTE=['#5aa9ff','#5fd06c','#ff8a5c','#b98cff','#3fd6cf','#ffb347','#ffcf2a','#ff6fa8','#fff3dc'];
var COL={note:0,mt:1,mk:2,lk:3,jn:4,nt:5,ot:1};
var VERSOES=[['ARC','Almeida Revista e Corrigida (ARC)'],['NVI-PT','Nova Versão Internacional (NVI)'],['NTLH','Nova Tradução na Linguagem de Hoje (NTLH)'],['NVT','Nova Versão Transformadora (NVT)'],['OL','O Livro (OL)']];

/* ===== livros: abreviações em português -> nome usado pelo BibleGateway ===== */
var BOOKS=[['Genesis','gn genesis'],['Exodus','ex exodo'],['Leviticus','lv levitico'],['Numbers','nm numeros'],['Deuteronomy','dt deuteronomio'],['Joshua','js josue'],['Judges','jz juizes'],['Ruth','rt rute'],['1 Samuel','1sm 1samuel'],['2 Samuel','2sm 2samuel'],['1 Kings','1rs 1reis'],['2 Kings','2rs 2reis'],['1 Chronicles','1cr 1cronicas'],['2 Chronicles','2cr 2cronicas'],['Ezra','ed esdras'],['Nehemiah','ne neemias'],['Esther','et ester'],['Job','jó'],['Psalm','sl salmo salmos'],['Proverbs','pv proverbios'],['Ecclesiastes','ec eclesiastes'],['Song of Songs','ct cantares canticos canticodoscanticos'],['Isaiah','is isaias'],['Jeremiah','jr jeremias'],['Lamentations','lm lamentacoes'],['Ezekiel','ez ezequiel'],['Daniel','dn daniel'],['Hosea','os oseias'],['Joel','jl joel'],['Amos','am amos'],['Obadiah','ob obadias'],['Jonah','jn jonas'],['Micah','mq miqueias'],['Nahum','na naum'],['Habakkuk','hc habacuque'],['Zephaniah','sf sofonias'],['Haggai','ag ageu'],['Zechariah','zc zacarias'],['Malachi','ml malaquias'],
 ['Matthew','mt mateus'],['Mark','mc marcos'],['Luke','lc lucas'],['John','jo joao'],
 ['Acts','at atos'],['Romans','rm romanos'],['1 Corinthians','1co 1corintios'],['2 Corinthians','2co 2corintios'],['Galatians','gl galatas'],['Ephesians','ef efesios'],['Philippians','fp filipenses'],['Colossians','cl colossenses'],['1 Thessalonians','1ts 1tessalonicenses'],['2 Thessalonians','2ts 2tessalonicenses'],['1 Timothy','1tm 1timoteo'],['2 Timothy','2tm 2timoteo'],['Titus','tt tito'],['Philemon','fm filemom'],['Hebrews','hb hebreus'],['James','tg tiago'],['1 Peter','1pe 1pedro'],['2 Peter','2pe 2pedro'],['1 John','1jo 1joao'],['2 John','2jo 2joao'],['3 John','3jo 3joao'],['Jude','jd judas'],['Revelation','ap apocalipse']];
var BMAP={},BIDX={};
BOOKS.forEach(function(b,i){b[1].split(' ').forEach(function(k){BMAP[k]=b[0];BIDX[k]=i})});
function norm(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
function parseRef(ref){
  var m=/^\s*([123])?\s*([^\d\s][^\d]*?)\.?\s*(\d.*)?$/.exec(ref||'');if(!m)return null;
  var nm=m[2].trim(),key;
  if(/^jó$/i.test(nm))key='jó';else key=(m[1]||'')+norm(nm).replace(/[\s.]/g,'');
  if(!(key in BMAP))return null;
  return {en:BMAP[key],idx:BIDX[key],rest:(m[3]||'').trim()};
}
function guessGroup(ref){
  var p=parseRef(ref);if(!p)return null;
  if(p.idx<=38)return 'ot';
  return ['mt','mk','lk','jn'][p.idx-39]||'nt';
}
function readUrl(ref){
  var p=parseRef(ref),q=p?(p.en+' '+p.rest).trim():(ref||'').trim();
  return 'https://www.biblegateway.com/passage/?search='+encodeURIComponent(q)+'&version='+encodeURIComponent(data.ver||'ARC');
}

/* ===== biblioteca de paralelos ===== */
var LIB=[
 {t:'Batismo de Jesus',refs:[['mt','Mt 3:13-17'],['mk','Mc 1:9-11'],['lk','Lc 3:21-22'],['jn','Jo 1:29-34']]},
 {t:'Voz que clama no deserto',hub:true,refs:[['ot','Isaías 40:3'],['mt','Mt 3:3'],['mk','Mc 1:2-3'],['lk','Lc 3:4-6'],['jn','Jo 1:23']]},
 {t:'Tentação no deserto',refs:[['mt','Mt 4:1-11'],['mk','Mc 1:12-13'],['lk','Lc 4:1-13']]},
 {t:'Bem-aventuranças',refs:[['mt','Mt 5:3-12'],['lk','Lc 6:20-23']]},
 {t:'Pai-Nosso',refs:[['mt','Mt 6:9-13'],['lk','Lc 11:2-4']]},
 {t:'Parábola do semeador',refs:[['mt','Mt 13:1-23'],['mk','Mc 4:1-20'],['lk','Lc 8:4-15']]},
 {t:'Rejeição em Nazaré',refs:[['mt','Mt 13:54-58'],['mk','Mc 6:1-6'],['lk','Lc 4:16-30']]},
 {t:'Multiplicação dos pães (5 mil)',refs:[['mt','Mt 14:13-21'],['mk','Mc 6:30-44'],['lk','Lc 9:10-17'],['jn','Jo 6:1-14']]},
 {t:'Jesus anda sobre as águas',refs:[['mt','Mt 14:22-33'],['mk','Mc 6:45-52'],['jn','Jo 6:16-21']]},
 {t:'Multiplicação dos pães (4 mil)',refs:[['mt','Mt 15:32-39'],['mk','Mc 8:1-10']]},
 {t:'Confissão de Pedro',refs:[['mt','Mt 16:13-20'],['mk','Mc 8:27-30'],['lk','Lc 9:18-21']]},
 {t:'Transfiguração',refs:[['mt','Mt 17:1-8'],['mk','Mc 9:2-8'],['lk','Lc 9:28-36']]},
 {t:'O grande mandamento',refs:[['mt','Mt 22:34-40'],['mk','Mc 12:28-34'],['lk','Lc 10:25-28']]},
 {t:'Amar a Deus, amar o próximo',hub:true,refs:[['ot','Deuteronômio 6:4-5'],['mt','Mt 22:37'],['mk','Mc 12:29-30'],['lk','Lc 10:27']]},
 {t:'Entrada triunfal',refs:[['mt','Mt 21:1-11'],['mk','Mc 11:1-11'],['lk','Lc 19:28-40'],['jn','Jo 12:12-19']]},
 {t:'Teu rei vem montado num jumento',hub:true,refs:[['ot','Zacarias 9:9'],['mt','Mt 21:5'],['jn','Jo 12:15']]},
 {t:'Purificação do templo',refs:[['mt','Mt 21:12-13'],['mk','Mc 11:15-18'],['lk','Lc 19:45-48'],['jn','Jo 2:13-22']]},
 {t:'Unção em Betânia',refs:[['mt','Mt 26:6-13'],['mk','Mc 14:3-9'],['jn','Jo 12:1-8']]},
 {t:'A Última Ceia',refs:[['mt','Mt 26:26-29'],['mk','Mc 14:22-25'],['lk','Lc 22:14-20'],['nt','1 Co 11:23-26']]},
 {t:'Negação de Pedro predita',refs:[['mt','Mt 26:31-35'],['mk','Mc 14:27-31'],['lk','Lc 22:31-34'],['jn','Jo 13:36-38']]},
 {t:'Getsêmani',refs:[['mt','Mt 26:36-46'],['mk','Mc 14:32-42'],['lk','Lc 22:39-46']]},
 {t:'Crucificação',refs:[['mt','Mt 27:32-56'],['mk','Mc 15:21-41'],['lk','Lc 23:26-49'],['jn','Jo 19:17-37']]},
 {t:'“Por que me abandonaste?”',hub:true,refs:[['ot','Salmos 22:1'],['mt','Mt 27:46'],['mk','Mc 15:34']]},
 {t:'Túmulo vazio',refs:[['mt','Mt 28:1-10'],['mk','Mc 16:1-8'],['lk','Lc 24:1-12'],['jn','Jo 20:1-10']]}
];
var START_NOTE='Arraste os cartões, toque duas vezes (ou dê duplo clique) em qualquer texto para reescrever e puxe o novelo da borda de um cartão até outro para amarrar um fio.\n\nToque num fio para mudar cor, estilo e seta, ou arraste-o para curvar. Toque longo seleciona vários cartões. Mais paralelos na Biblioteca.';
/* migração de quadros exportados da versão em inglês */
var TMAP={'Baptism of Jesus':'Batismo de Jesus','Voice in the wilderness':'Voz que clama no deserto','Temptation in the wilderness':'Tentação no deserto','Beatitudes':'Bem-aventuranças',"The Lord's Prayer":'Pai-Nosso','Parable of the sower':'Parábola do semeador','Rejection at Nazareth':'Rejeição em Nazaré','Feeding of the 5,000':'Multiplicação dos pães (5 mil)','Walking on the water':'Jesus anda sobre as águas','Feeding of the 4,000':'Multiplicação dos pães (4 mil)',"Peter's confession":'Confissão de Pedro','Transfiguration':'Transfiguração','The greatest commandment':'O grande mandamento','Love God, love neighbour':'Amar a Deus, amar o próximo','Triumphal entry':'Entrada triunfal','Your king comes on a donkey':'Teu rei vem montado num jumento','Cleansing of the temple':'Purificação do templo','Anointing at Bethany':'Unção em Betânia','The Last Supper':'A Última Ceia',"Peter's denial foretold":'Negação de Pedro predita','Gethsemane':'Getsêmani','Crucifixion':'Crucificação','"Why have you forsaken me?"':'“Por que me abandonaste?”','Empty tomb':'Túmulo vazio'};
var RMAP=[[/^Mk\b/,'Mc'],[/^Lk\b/,'Lc'],[/^Jn\b/,'Jo'],[/^Isaiah\b/,'Isaías'],[/^Deuteronomy\b/,'Deuteronômio'],[/^Zechariah\b/,'Zacarias'],[/^Psalm\b/,'Salmos']];
function migrate(d){
  if(!d||!d.nodes||d.lang==='pt')return d;
  d.nodes.forEach(function(n){
    if(n.ref){RMAP.forEach(function(r){n.ref=n.ref.replace(r[0],r[1])});if(TMAP[n.ref])n.ref=TMAP[n.ref];if(n.ref==='Start here'){n.ref='Comece aqui';n.note=START_NOTE}}
    if(TMAP[n.title])n.title=TMAP[n.title];
  });
  d.lang='pt';return d;
}

/* ===== texturas de tricô ===== */
function knit(f,fo,s,so){return "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='12' viewBox='0 0 10 12'><g fill='"+f+"' fill-opacity='"+fo+"' stroke='"+s+"' stroke-opacity='"+so+"' stroke-width='.7'><ellipse cx='2.7' cy='6' rx='2.1' ry='4.7' transform='rotate(-27 2.7 6)'/><ellipse cx='7.3' cy='6' rx='2.1' ry='4.7' transform='rotate(27 7.3 6)'/></g></svg>"}
function uri(s){return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'}
var rs=document.documentElement.style;
rs.setProperty('--knit',uri(knit('#ffffff',.12,'#000000',.25)));
rs.setProperty('--knitY',uri(knit('#fff6b0',.55,'#b86a00',.55)));
rs.setProperty('--knitB',uri(knit('#c98a4a',.5,'#3c1f0a',.5)));
rs.setProperty('--knitC',uri(knit('#ffffff',.35,'#a87a4a',.3)));

/* ===== modelo ===== */
var uidN=0;
function uid(){uidN++;return Date.now().toString(36).slice(-4)+Math.random().toString(36).slice(2,6)+uidN}
function addCluster(d,set,x0,y0){
  var made=[];
  var head={id:uid(),g:'note',x:x0,y:y0,ref:set.t,title:'',note:''};
  d.nodes.push(head);made.push(head.id);
  var items=set.refs.map(function(r,i){
    var x,y;
    if(set.hub){if(i===0){x=x0+290;y=y0}else{x=x0+290*COL[r[0]]+145;y=y0+200}}
    else{x=x0+290*COL[r[0]];y=y0}
    var n={id:uid(),g:r[0],x:x,y:y,ref:r[1],title:set.t,note:''};
    d.nodes.push(n);made.push(n.id);return n;
  });
  function L(a,b){d.links.push({id:uid(),a:a.id,b:b.id,label:''})}
  if(set.hub){L(head,items[0]);items.slice(1).forEach(function(n){L(items[0],n)})}
  else{var p=head;items.forEach(function(n){L(p,n);p=n})}
  return made;
}
function findSet(t){for(var i=0;i<LIB.length;i++)if(LIB[i].t===t)return LIB[i]}
function seed(){
  var d={nodes:[],links:[],ver:'ARC',lang:'pt'};
  ['Batismo de Jesus','Multiplicação dos pães (5 mil)','Transfiguração','Entrada triunfal','Túmulo vazio'].forEach(function(t,i){addCluster(d,findSet(t),0,i*240)});
  addCluster(d,findSet('Voz que clama no deserto'),0,5*240+20);
  d.nodes.push({id:uid(),g:'note',x:1500,y:0,ref:'Comece aqui',title:'',note:START_NOTE});
  return d;
}
function clean(o){
  o=migrate(o)||{};
  var nodes=(o.nodes||[]).filter(function(n){return n&&n.id}).map(function(n){return {id:String(n.id),g:GOS[n.g]?n.g:'note',x:+n.x||0,y:+n.y||0,ref:String(n.ref||''),title:String(n.title||''),note:String(n.note||'')}});
  var ids=new Set(nodes.map(function(n){return n.id}));
  var links=(o.links||[]).filter(function(l){return l&&ids.has(String(l.a))&&ids.has(String(l.b))}).map(function(l){
    var r={id:String(l.id||uid()),a:String(l.a),b:String(l.b),label:String(l.label||'')};
    if(l.color)r.color=String(l.color);if(l.dash)r.dash=true;if(l.arrow)r.arrow=true;
    if(typeof l.bx==='number'&&typeof l.by==='number'){r.bx=l.bx;r.by=l.by}
    return r});
  return {nodes:nodes,links:links,ver:o.ver?String(o.ver):'ARC',lang:'pt'};
}

/*<backend>*/
/* ===== armazenamento no aparelho (localStorage) =====
   Índice de quadros:  mapa-quadros       -> [{id,name,updated}]
   Cada quadro:        mapa-quadro-<id>   -> {nodes,links,ver,view,...}
   Quadro aberto:      mapa-quadro-atual  -> id                       */
var DB={
  idxKey:'mapa-quadros',curKey:'mapa-quadro-atual',pre:'mapa-quadro-',
  ok:(function(){try{localStorage.setItem('mapa-teste','1');localStorage.removeItem('mapa-teste');return true}catch(e){return false}})(),
  mem:{},
  get:function(k){if(!this.ok)return this.mem[k]||null;return localStorage.getItem(k)},
  set:function(k,v){if(!this.ok){this.mem[k]=v;return}localStorage.setItem(k,v)},
  del:function(k){if(!this.ok){delete this.mem[k];return}localStorage.removeItem(k)},
  list:function(){try{return JSON.parse(this.get(this.idxKey)||'[]')}catch(e){return []}},
  setList:function(l){this.set(this.idxKey,JSON.stringify(l))},
  load:function(id){try{return JSON.parse(this.get(this.pre+id)||'null')}catch(e){return null}},
  save:function(id,obj){
    this.set(this.pre+id,JSON.stringify(obj));
    var l=this.list(),b=l.filter(function(x){return x.id===id})[0];
    if(b){b.updated=Date.now();this.setList(l)}
  },
  create:function(name,obj){var id=uid(),l=this.list();l.push({id:id,name:name,updated:Date.now()});this.setList(l);this.save(id,obj);return id},
  rename:function(id,name){var l=this.list();l.forEach(function(b){if(b.id===id)b.name=name});this.setList(l)},
  remove:function(id){this.del(this.pre+id);this.setList(this.list().filter(function(b){return b.id!==id}))},
  current:function(){return this.get(this.curKey)},
  setCurrent:function(id){this.set(this.curKey,id)},
  bytes:function(id){var s=this.get(this.pre+id);return s?s.length*2:0}
};
function boardObj(){return {app:'mapa-dos-evangelhos',versao:3,lang:'pt',ver:data.ver,nodes:data.nodes,links:data.links,view:view}}
var saveT=0,lastSaved=0,saveErr='';
function persist(){clearTimeout(saveT);saveT=setTimeout(saveNow,350)}
function saveNow(){
  clearTimeout(saveT);
  try{DB.save(curId,boardObj());lastSaved=Date.now();saveErr=''}
  catch(e){saveErr='Não foi possível salvar (armazenamento cheio?). Exporte o quadro.'}
  status();
}
/* pede ao navegador para não apagar os dados quando faltar espaço */
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){});
window.addEventListener('pagehide',function(){saveNow()});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')saveNow()});
/*</backend>*/

/* ===== abertura ===== */
var curId=DB.current(),idx=DB.list();
if(!idx.length){curId=DB.create('Meu mapa',seed());DB.setCurrent(curId);idx=DB.list()}
if(!curId||!idx.some(function(b){return b.id===curId})){curId=idx[0].id;DB.setCurrent(curId)}
var stored=DB.load(curId)||seed();
var data=clean(stored),view=stored.view||null;
function snap(){return JSON.stringify({nodes:data.nodes,links:data.links,ver:data.ver})}
var lastSnap=snap(),past=[],future=[];
var sel=new Set(),selL=new Set(),lastG='mt';

/* ===== interface ===== */
var app=$('#app');
var addBtns=Object.keys(GOS).map(function(g){var G=GOS[g];return '<button class="btn g'+(g==='note'?' note':'')+'" data-add="'+g+'" style="--c:'+G.c+'" title="Novo cartão: '+G.n+'">+ '+(G.a||G.b)+'</button>'}).join('');
var verOpts=VERSOES.map(function(v){return '<option value="'+v[0]+'">'+v[1]+'</option>'}).join('');
app.innerHTML=
 '<div id="vp"><div id="world"><svg id="links" xmlns="http://www.w3.org/2000/svg"></svg><div id="cards"></div><div id="tags"></div></div></div>'+
 '<div id="top" class="patch">'+
  '<div class="brand"><span class="yarnT"><span class="desk-only">'+TITLE+'</span><span class="mobile-only">Evangelhos</span></span><small id="bname" data-cmd="boards" title="Meus quadros"></small></div>'+
  '<div class="grp"><button class="btn big" data-cmd="passage" title="Nova passagem (N)">＋<span class="desk-only">&nbsp;Passagem</span></button><span class="grp desk-only">'+addBtns+'</span></div>'+
  '<span class="vsep desk-only"></span>'+
  '<div class="grp"><button class="btn ic" data-cmd="lib" id="libBtn" title="Biblioteca de paralelos">🧶<span class="desk-only">&nbsp;Biblioteca</span></button><button class="btn ic mobile-only" data-cmd="search" title="Buscar">🔍</button></div>'+
  '<div class="grp" id="searchRow"><input id="q" type="search" placeholder="Buscar…" autocomplete="off"><span id="qn"></span></div>'+
   '<div class="grp desk-only"><button class="btn ic" data-cmd="undo" id="undo" title="Desfazer (Ctrl/Cmd+Z)">↶</button><button class="btn ic" data-cmd="redo" id="redo" title="Refazer (Ctrl/Cmd+Shift+Z)">↷</button></div>'+
  '<div class="grp push"><span id="status"></span><button class="btn ic" data-cmd="more" id="moreBtn" title="Mais opções">☰<span class="desk-only">&nbsp;Mais</span></button></div>'+
 '</div>'+
 '<div id="drawer" class="patch cream">'+
  '<h4>Adicionar cartão</h4><div class="grp">'+addBtns+'</div>'+
  '<h4>Quadros</h4><button class="btn wide-btn" data-cmd="boards">📚 Meus quadros</button>'+
  '<h4>Arquivo</h4><div class="grp"><button class="btn" data-cmd="export">⬇ Exportar</button><button class="btn" data-cmd="import">⬆ Importar</button></div>'+
  '<h4>Código</h4><div class="grp"><button class="btn" data-cmd="front">&lt;/&gt; Front-end</button><button class="btn" data-cmd="back">⚙ Back-end</button></div>'+
  '<h4>Leitura</h4><select class="ver" id="ver">'+verOpts+'</select>'+
  '<h4>App</h4><div class="grp"><button class="btn" data-cmd="install" id="installBtn">📲 Instalar app</button><button class="btn" data-cmd="help">? Ajuda</button></div>'+
  '<div class="st" id="dstatus"></div>'+
 '</div>'+
 '<div id="zoom" class="patch"><button class="btn ic mobile-only" data-cmd="undo" id="undo2">\u21B6</button><button class="btn ic mobile-only" data-cmd="redo" id="redo2">\u21B7</button><button class="btn" data-cmd="zo">−</button><span id="zl">100%</span><button class="btn" data-cmd="zi">+</button><button class="btn" data-cmd="fit">Ajustar</button></div>'+
 '<div id="selbar" class="patch"></div>'+
 '<div id="help" class="patch cream"><h3 class="yarnT yarnB">Como tricotar</h3><ul>'+
  '<li><b>Mover</b>: arraste o cartão. Arraste o feltro vazio para navegar; role a roda ou faça pinça para zoom.</li>'+
  '<li><b>Editar</b>: duplo clique, ou dois toques, em qualquer texto. Enter conclui; Shift+Enter quebra linha.</li>'+
  '<li><b>Nova passagem</b>: “＋”. Se houver cartões selecionados, ela já nasce ligada a eles. Duplo clique (ou dois toques) no feltro vazio cria um cartão ali.</li>'+
  '<li><b>Ligar</b>: puxe o novelo da borda direita de um cartão até outro. Selecione vários (Shift+clique ou toque longo) e use a barra de baixo para ligar em sequência ou em estrela.</li>'+
  '<li><b>Fios</b>: toque para abrir o menu (cor, tracejado, seta, inverter, endireitar, rótulo, multiplicar, cortar). Arraste o meio para curvar; arraste os nós das pontas para trocar de cartão (com Alt/Ctrl cria uma cópia).</li>'+
  '<li><b>Quadros</b>: em “Mais” você cria vários mapas separados (por estudo, por tema…).</li>'+
  '<li><b>Salvamento</b>: automático, neste aparelho. Para levar a outro aparelho ou fazer backup, use Exportar.</li>'+
  '<li>Funciona sem internet depois de aberto uma vez. A leitura da Bíblia (📖) precisa de internet.</li></ul>'+
  '<div class="legend">'+Object.keys(GOS).map(function(g){return '<span style="--c:'+GOS[g].c+(g==='note'?';color:#7b4520':'')+'">'+GOS[g].n+'</span>'}).join('')+'</div>'+
  '<div class="row" style="margin-top:12px"><span style="flex:1;font-size:12px;opacity:.7;align-self:center">Versão '+APP_VERSION+'</span><button class="btn" data-cmd="help">Fechar</button></div></div>'+
 '<div id="lib" class="patch cream"><h3 class="yarnT yarnB">Biblioteca de paralelos</h3><p>Toque num conjunto para colocá-lo, já ligado, no centro da tela.</p><input id="libq" type="search" placeholder="Buscar conjunto ou referência…"><div id="libList"></div></div>'+
 '<div id="modal"><div id="mbox" class="patch cream"><h3 id="mtitle" class="yarnT yarnB"></h3><p id="mp"></p><div id="mbody"></div><div class="row" id="mrow"></div></div></div>'+
 '<div id="toast"></div>';

var vp=$('#vp'),world=$('#world'),svg=$('#links'),cardsEl=$('#cards'),tagsEl=$('#tags');
var els={};
function node(id){for(var i=0;i<data.nodes.length;i++)if(data.nodes[i].id===id)return data.nodes[i]}
function linkById(id){for(var i=0;i<data.links.length;i++)if(data.links[i].id===id)return data.links[i]}
function hasLink(a,b,except){return data.links.some(function(l){return l.id!==except&&((l.a===a&&l.b===b)||(l.a===b&&l.b===a))})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ===== visão (zoom/pan) ===== */
function applyView(){
  var z=view.z;
  world.style.transform='translate('+view.x+'px,'+view.y+'px) scale('+z+')';
  var s=96*z,p=view.x+'px '+view.y+'px',A='#f8c5be';
  vp.style.backgroundImage='linear-gradient(135deg,'+A+' 25%,transparent 25%),linear-gradient(225deg,'+A+' 25%,transparent 25%),linear-gradient(315deg,'+A+' 25%,transparent 25%),linear-gradient(45deg,'+A+' 25%,transparent 25%),var(--knit)';
  vp.style.backgroundSize=s+'px '+s+'px,'+s+'px '+s+'px,'+s+'px '+s+'px,'+s+'px '+s+'px,'+(10*z)+'px '+(12*z)+'px';
  vp.style.backgroundPosition=p+','+p+','+p+','+p+','+p;
  $('#zl').textContent=Math.round(z*100)+'%';
  if(selL.size===1)drawSoon();
  persist();
}
function toWorld(cx,cy){return {x:(cx-view.x)/view.z,y:(cy-view.y)/view.z}}
function zoomAt(cx,cy,f){
  var nz=Math.min(2.5,Math.max(0.1,view.z*f));f=nz/view.z;
  view.x=cx-(cx-view.x)*f;view.y=cy-(cy-view.y)*f;view.z=nz;applyView();
}
function size(n){var e=els[n.id];return e?{w:e.offsetWidth,h:e.offsetHeight}:{w:250,h:110}}
function topBottom(){return $('#top').getBoundingClientRect().bottom}
/* no celular, "ajustar tudo" deixa os cartões minúsculos: começa legível, no canto de cima */
function readableStart(){
  if(view.z>=0.5||!data.nodes.length)return;
  var x1=1e9,y1=1e9;data.nodes.forEach(function(n){x1=Math.min(x1,n.x);y1=Math.min(y1,n.y)});
  view={z:0.55,x:16-x1*0.55,y:topBottom()+30-y1*0.55};applyView();
}
function fit(){
  if(!data.nodes.length){view={x:innerWidth/2,y:innerHeight/2,z:1};applyView();return}
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  data.nodes.forEach(function(n){var s=size(n);x1=Math.min(x1,n.x);y1=Math.min(y1,n.y);x2=Math.max(x2,n.x+s.w);y2=Math.max(y2,n.y+s.h)});
  var top=topBottom()+20,W=innerWidth-40,H=innerHeight-top-80;
  var z=Math.max(0.1,Math.min(1.2,W/(x2-x1),H/(y2-y1)));
  view={z:z,x:(innerWidth-(x2-x1)*z)/2-x1*z,y:top+(H-(y2-y1)*z)/2-y1*z+10};
  applyView();
}

/* ===== desenho ===== */
var zTop=1;
function buildCard(n){
  var G=GOS[n.g]||GOS.note;
  var el=document.createElement('div');
  el.className='card g-'+n.g;el.dataset.id=n.id;
  el.style.cssText='left:'+n.x+'px;top:'+n.y+'px;--c:'+G.c+';--s:'+G.s;
  var sw=Object.keys(GOS).map(function(g){return '<button class="sw'+(g===n.g?' on':'')+'" data-sw="'+g+'" title="'+GOS[g].n+'" style="background-color:'+GOS[g].c+'"></button>'}).join('');
  el.innerHTML='<span class="badge">'+esc(G.n)+'</span>'+
   '<div class="ref yarnT" data-f="ref" data-ph="Referência"></div>'+
   '<div class="ttl yarnT" data-f="title" data-ph="Título"></div>'+
   '<div class="nt" data-f="note" data-ph="Anotações…"></div>'+
   '<div class="knob" title="Arraste até outro cartão para ligar"></div>'+
   '<div class="menu">'+sw+'<span class="sep"></span>'+
   '<a class="mb" data-read target="_blank" rel="noopener" title="Ler a passagem">📖</a>'+
   '<button class="mb" data-act="link" title="Nova passagem ligada a este cartão">＋</button>'+
   '<button class="mb" data-act="edit" title="Editar texto">✏️</button>'+
   '<button class="mb" data-act="dup" title="Duplicar">⧉</button>'+
   '<button class="mb" data-act="del" title="Excluir">🗑️</button></div>';
  el.querySelector('[data-f=ref]').textContent=n.ref||'';
  el.querySelector('[data-f=title]').textContent=n.title||'';
  el.querySelector('[data-f=note]').textContent=n.note||'';
  el.querySelector('[data-read]').href=readUrl(n.ref);
  return el;
}
function renderAll(){
  cardsEl.innerHTML='';els={};
  data.nodes.forEach(function(n){var el=buildCard(n);els[n.id]=el;cardsEl.appendChild(el)});
  updateSel();drawLinks();applySearch();
}
function updateSel(){
  Object.keys(els).forEach(function(id){var e=els[id];e.classList.toggle('sel',sel.has(id));e.classList.toggle('only',sel.size===1&&sel.has(id))});
  var sb=$('#selbar');
  if(sel.size>=2){
    sb.innerHTML='<b>'+sel.size+' cartões</b><button class="btn" data-sact="chain" title="Liga na ordem em que foram selecionados">Ligar em sequência</button><button class="btn" data-sact="star" title="Liga o primeiro selecionado a todos os outros">Ligar em estrela</button><button class="btn" data-sact="unlink">Cortar fios entre eles</button><button class="btn" data-sact="dup">Duplicar</button><button class="btn danger" data-sact="del">Excluir</button><button class="btn" data-sact="none">✕</button>';
    sb.classList.add('open');
  }else sb.classList.remove('open');
}
function centerOf(n){var s=size(n);return {x:n.x+s.w/2,y:n.y+s.h/2}}
function edgePt(n,tx,ty){
  var s=size(n),c=centerOf(n),dx=tx-c.x,dy=ty-c.y;
  var t=Math.min(dx?(s.w/2)/Math.abs(dx):1e9,dy?(s.h/2)/Math.abs(dy):1e9,1);
  return {x:c.x+dx*t,y:c.y+dy*t};
}
function geom(l,A,B){var ca=centerOf(A),cb=centerOf(B);return curve(edgePt(A,cb.x,cb.y),edgePt(B,ca.x,ca.y),l)}
function curve(p1,p2,l){
  var dx=p2.x-p1.x,dy=p2.y-p1.y,dist=Math.sqrt(dx*dx+dy*dy)||1;
  var dcx=(p1.x+p2.x)/2,dcy=(p1.y+p2.y)/2+Math.min(60,dist*0.14),cx=dcx,cy=dcy;
  if(l&&typeof l.bx==='number'){cx+=l.bx;cy+=l.by}
  return {p1:p1,p2:p2,c:{x:cx,y:cy},dc:{x:dcx,y:dcy},d:'M'+p1.x.toFixed(1)+' '+p1.y.toFixed(1)+' Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+p2.x.toFixed(1)+' '+p2.y.toFixed(1),mx:.25*p1.x+.5*cx+.25*p2.x,my:.25*p1.y+.5*cy+.25*p2.y};
}
function arrowPath(g){
  var a=Math.atan2(g.p2.y-g.c.y,g.p2.x-g.c.x),L=20,W=10,x=g.p2.x,y=g.p2.y,ca=Math.cos(a),sa=Math.sin(a),bx=x-L*ca,by=y-L*sa;
  return 'M'+x.toFixed(1)+' '+y.toFixed(1)+' L'+(bx-W*sa).toFixed(1)+' '+(by+W*ca).toFixed(1)+' L'+(bx+W*sa).toFixed(1)+' '+(by-W*ca).toFixed(1)+' Z';
}
var editingTag=false,tmpPath='';
function linkMenu(l){
  return '<div class="lmenu">'+PALETTE.map(function(c){return '<button class="sw'+(l.color===c?' on':'')+'" data-lact="color" data-col="'+c+'" style="background-color:'+c+'" title="Cor do fio"></button>'}).join('')+
   '<span class="sep"></span>'+
   '<button class="mb'+(l.dash?' on':'')+'" data-lact="dash" title="Contínuo / tracejado">┄</button>'+
   '<button class="mb'+(l.arrow?' on':'')+'" data-lact="arrow" title="Mostrar seta">➔</button>'+
   '<button class="mb" data-lact="flip" title="Inverter direção">⇄</button>'+
   '<button class="mb" data-lact="straight" title="Desfazer curva">⌒</button>'+
   '<button class="mb" data-lact="label" title="Rótulo">✏️</button>'+
   '<button class="mb" data-lact="copy" title="Multiplicar: cria uma cópia e você escolhe o novo cartão">⧉</button>'+
   '<button class="mb" data-lact="cut" title="Cortar fio">✂️</button></div>';
}
function drawLinks(){
  var h='',t='',ends='',q=curQ(),one=selL.size===1?selL.values().next().value:null,coarse=matchMedia('(pointer:coarse)').matches;
  data.links.forEach(function(l){
    var A=node(l.a),B=node(l.b);if(!A||!B)return;
    var g=geom(l,A,B),col=l.color||YARN[A.g]||'#ffcf2a';
    var dim=q&&!(match(A,q)||match(B,q))?' dim':'',s=selL.has(l.id)?' sel':'';
    h+='<g class="lk'+s+dim+(l.dash?' dash':'')+'" data-lid="'+l.id+'"><path class="hit" d="'+g.d+'"/><path class="under" d="'+g.d+'"/><path class="yl" d="'+g.d+'" stroke="'+col+'"/><path class="ply" d="'+g.d+'"/>'+(l.arrow?'<path class="arw" d="'+arrowPath(g)+'" fill="'+col+'"/>':'')+'</g>';
    if(one===l.id){
      var r=(coarse?13:9)/Math.min(1,view.z);
      ends+='<circle class="end" data-lid="'+l.id+'" data-end="a" cx="'+g.p1.x.toFixed(1)+'" cy="'+g.p1.y.toFixed(1)+'" r="'+r.toFixed(1)+'" stroke="'+col+'"/><circle class="end" data-lid="'+l.id+'" data-end="b" cx="'+g.p2.x.toFixed(1)+'" cy="'+g.p2.y.toFixed(1)+'" r="'+r.toFixed(1)+'" stroke="'+col+'"/>';
    }
    if(l.label||one===l.id){
      var sc=(one===l.id&&view.z<0.9)?';transform:translate(-50%,-50%) scale('+(0.9/view.z).toFixed(2)+')':'';
      t+='<div class="tag'+s+dim+'" data-lid="'+l.id+'" style="left:'+g.mx.toFixed(1)+'px;top:'+g.my.toFixed(1)+'px'+sc+'"><span data-lf data-ph="toque 2x para rotular">'+esc(l.label||'')+'</span>'+(one===l.id?linkMenu(l):'')+'</div>';
    }
  });
  svg.innerHTML=h+ends+tmpPath;
  if(!editingTag)tagsEl.innerHTML=t;
}
var raf=0;function drawSoon(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;drawLinks()})}

/* ===== histórico e estado ===== */
function changed(){
  var s=snap();if(s===lastSnap)return;
  past.push(lastSnap);if(past.length>100)past.shift();future=[];lastSnap=s;
  persist();status();
}
function restore(s){var o=JSON.parse(s);data.nodes=o.nodes;data.links=o.links;data.ver=o.ver||'ARC';lastSnap=s;sel.clear();selL.clear();renderAll();syncVer();persist();status()}
function undo(){if(!past.length)return;future.push(lastSnap);restore(past.pop())}
function redo(){if(!future.length)return;past.push(lastSnap);restore(future.pop())}
function hhmm(t){var d=new Date(t);return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function status(){
  $('#undo').disabled=$('#undo2').disabled=!past.length;$('#redo').disabled=$('#redo2').disabled=!future.length;
  var msg=saveErr||(!DB.ok?'Armazenamento indisponível (modo anônimo?) — exporte antes de sair':(lastSaved?'Salvo no aparelho ✓ '+hhmm(lastSaved):'Salvo no aparelho ✓'));
  $('#status').textContent=msg;$('#dstatus').textContent=msg;
  var b=DB.list().filter(function(x){return x.id===curId})[0];$('#bname').textContent=b?b.name:'';
}

/* ===== ações com cartões ===== */
function centerWorld(){return toWorld(innerWidth/2,(topBottom()+innerHeight)/2)}
function freeSpot(x,y){
  var offs=[0,160,-160,320,-320,480,-480,640];
  for(var i=0;i<offs.length;i++){
    var yy=y+offs[i];
    if(!data.nodes.some(function(n){var z=size(n);return x<n.x+z.w+30&&x+280>n.x&&yy<n.y+z.h+30&&yy+140>n.y}))return {x:x,y:yy};
  }
  return {x:x+40,y:y+40};
}
function newNode(g,x,y,ref,title,note){var n={id:uid(),g:g,x:Math.round(x),y:Math.round(y),ref:ref,title:title||'',note:note||''};data.nodes.push(n);return n}
function addNode(g,at,edit){
  lastG=g;
  var c=at||centerWorld();
  var n=newNode(g,c.x-125+(at?0:(Math.random()*40-20)),c.y-50+(at?0:(Math.random()*40-20)),GOS[g].a?GOS[g].a+' ':'');
  sel=new Set([n.id]);selL.clear();renderAll();changed();
  if(edit!==false)startEdit(els[n.id].querySelector('[data-f=ref]'),true);
}
function addLink(a,b,props){
  if(a===b||hasLink(a,b))return null;
  var l={id:uid(),a:a,b:b,label:''};
  if(props)['label','color','dash','arrow','bx','by'].forEach(function(k){if(props[k]!==undefined)l[k]=props[k]});
  data.links.push(l);return l;
}
function delSel(){
  if(!sel.size&&!selL.size)return;
  data.links=data.links.filter(function(l){return !selL.has(l.id)&&!sel.has(l.a)&&!sel.has(l.b)});
  data.nodes=data.nodes.filter(function(n){return !sel.has(n.id)});
  sel.clear();selL.clear();renderAll();changed();
}
function dupSel(){
  if(!sel.size)return;var ns=new Set(),map={};
  data.nodes.filter(function(n){return sel.has(n.id)}).forEach(function(n){var c=JSON.parse(JSON.stringify(n));c.id=uid();c.x+=30;c.y+=30;data.nodes.push(c);ns.add(c.id);map[n.id]=c.id});
  data.links.slice().forEach(function(l){if(map[l.a]&&map[l.b]){var c=JSON.parse(JSON.stringify(l));c.id=uid();c.a=map[l.a];c.b=map[l.b];data.links.push(c)}});
  sel=ns;renderAll();changed();
}
function setGospel(id,g){var n=node(id);if(!n||n.g===g)return;n.g=g;lastG=g;renderAll();changed()}
function selAction(a){
  var ids=Array.from(sel),c=0;
  if(a==='chain'){for(var i=0;i<ids.length-1;i++)if(addLink(ids[i],ids[i+1]))c++;toast(c+' fio(s) novo(s)')}
  else if(a==='star'){ids.slice(1).forEach(function(id){if(addLink(ids[0],id))c++});toast(c+' fio(s) novo(s) a partir do primeiro selecionado')}
  else if(a==='unlink'){var before=data.links.length;data.links=data.links.filter(function(l){return !(sel.has(l.a)&&sel.has(l.b))});toast((before-data.links.length)+' fio(s) cortado(s)')}
  else if(a==='dup'){dupSel();return}
  else if(a==='del'){delSel();return}
  else if(a==='none'){sel.clear();updateSel();return}
  drawLinks();changed();
}

/* ===== edição de texto ===== */
function startEdit(f,caretEnd){
  if(!f)return;
  try{f.contentEditable='plaintext-only'}catch(e){}
  if(f.contentEditable!=='plaintext-only')f.contentEditable='true';
  f.classList.add('editing');f.focus();
  var r=document.createRange();r.selectNodeContents(f);if(caretEnd)r.collapse(false);
  var s=getSelection();s.removeAllRanges();s.addRange(r);
}
function endEdit(f){
  f.contentEditable='false';f.classList.remove('editing');
  var v=f.innerText.replace(/ /g,' ').replace(/\s+$/,'').replace(/^\s+/,'');
  if(f.hasAttribute('data-lf')){
    var tg=f.closest('.tag'),l=tg&&linkById(tg.dataset.lid);
    editingTag=false;if(l){l.label=v;changed()}drawLinks();return;
  }
  var card=f.closest('.card');if(!card)return;var n=node(card.dataset.id);if(!n)return;
  n[f.dataset.f]=v;f.textContent=v;
  if(f.dataset.f==='ref'){var a=card.querySelector('[data-read]');if(a)a.href=readUrl(v)}
  changed();drawLinks();
}
function editLabel(lid){
  selL=new Set([lid]);sel.clear();updateSel();drawLinks();
  var sp=tagsEl.querySelector('.tag[data-lid="'+lid+'"] span');
  if(sp){editingTag=true;startEdit(sp,true)}
}
document.addEventListener('focusout',function(e){var f=e.target;if(f&&f.classList&&f.classList.contains('editing'))endEdit(f)});
document.addEventListener('input',function(e){if(e.target.classList&&e.target.classList.contains('editing')&&!e.target.hasAttribute('data-lf'))drawSoon()});
document.addEventListener('keydown',function(e){
  var f=e.target;if(!f.classList||!f.classList.contains('editing'))return;
  if(e.key==='Escape'){e.preventDefault();f.blur();return}
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();f.blur();return}
  if(e.key==='Tab'&&f.dataset.f){
    e.preventDefault();var order=['ref','title','note'],i=order.indexOf(f.dataset.f),card=f.closest('.card');
    var nx=order[(i+(e.shiftKey?2:1))%3];f.blur();startEdit(card.querySelector('[data-f='+nx+']'),true);
  }
},true);
function onDouble(t,x,y){
  if(!t||t.closest('.editing')||t.closest('.menu')||t.closest('.lmenu')||t.closest('.end'))return;
  var tg=t.closest('.tag'),lk=t.closest('.lk');
  if(tg||lk){editLabel((tg||lk).dataset.lid);return}
  var card=t.closest('.card');
  if(card){var f=t.closest('[data-f]')||card.querySelector('[data-f=ref]');startEdit(f,false);return}
  if(!t.closest('#vp'))return;
  var w=toWorld(x,y);addNode(lastG,{x:w.x,y:w.y});
}
vp.addEventListener('dblclick',function(e){if(lastPtr!=='mouse')return;onDouble(e.target,e.clientX,e.clientY)});
vp.addEventListener('contextmenu',function(e){if(lastPtr!=='mouse')e.preventDefault()});

/* ===== ponteiro (mouse, caneta e toque) ===== */
var mode=null,pts=new Map(),hoverDrop=null,lastPtr='mouse',down=null,lastTap={t:0,x:0,y:0},longT=0,suppressTap=false;
function setDrop(e,exclude){
  var under=document.elementFromPoint(e.clientX,e.clientY),tc=under&&under.closest&&under.closest('.card');
  if(hoverDrop&&hoverDrop!==tc)hoverDrop.classList.remove('drop');
  hoverDrop=(tc&&exclude.indexOf(tc.dataset.id)<0)?tc:null;if(hoverDrop)hoverDrop.classList.add('drop');
}
function clearDrop(){if(hoverDrop)hoverDrop.classList.remove('drop');var h=hoverDrop;hoverDrop=null;return h}
vp.addEventListener('pointerdown',function(e){
  lastPtr=e.pointerType||'mouse';
  if(e.button!==0&&e.pointerType==='mouse')return;
  var t=e.target;
  if(t.closest('.editing'))return;
  if(t.closest('.menu')||t.closest('.lmenu'))return;
  closePanels();
  var ae=document.activeElement;if(ae&&ae.classList&&ae.classList.contains('editing'))ae.blur();
  if(mode&&mode.k==='place'){
    var tc=t.closest('.card'),src=linkById(mode.lid);
    if(tc&&src){var nl=addLink(src.a,tc.dataset.id,src);if(nl){selL=new Set([nl.id]);changed();toast('Fio multiplicado')}else toast('Esses dois cartões já estão ligados')}
    tmpPath='';clearDrop();mode=null;drawLinks();return;
  }
  pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  down={x:e.clientX,y:e.clientY,t:Date.now()};
  if(pts.size===2){clearTimeout(longT);var a=Array.from(pts.values());mode={k:'pinch',d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),z:view.z};return}
  var end=t.closest('.end'),knob=t.closest('.knob'),card=t.closest('.card'),lk=t.closest('.lk'),tg=t.closest('.tag');
  if(end){e.preventDefault();mode={k:'rewire',lid:end.dataset.lid,end:end.dataset.end,copy:e.altKey||e.ctrlKey||e.metaKey};return}
  if(knob&&card){e.preventDefault();mode={k:'connect',from:card.dataset.id};return}
  if(card){
    e.preventDefault();
    var id=card.dataset.id,prev=new Set(sel);
    if(e.shiftKey){if(sel.has(id))sel.delete(id);else sel.add(id)}
    else if(!sel.has(id))sel=new Set([id]);
    if(!e.shiftKey&&selL.size){selL.clear();drawLinks()}
    updateSel();card.style.zIndex=++zTop;
    var orig=new Map();sel.forEach(function(i){var n=node(i);if(n){orig.set(i,{x:n.x,y:n.y});if(els[i])els[i].style.zIndex=zTop}});
    mode={k:'drag',sx:e.clientX,sy:e.clientY,orig:orig,moved:false};
    if(e.pointerType!=='mouse'){
      clearTimeout(longT);
      longT=setTimeout(function(){
        if(!mode||mode.k!=='drag'||mode.moved)return;
        if(prev.has(id))prev.delete(id);else prev.add(id);
        sel=prev;mode=null;suppressTap=true;updateSel();
        if(navigator.vibrate)try{navigator.vibrate(12)}catch(_){}
        toast(sel.size>1?sel.size+' cartões selecionados':'Seleção múltipla: toque longo em outros cartões');
      },480);
    }
    return;
  }
  if(lk||tg){
    var lid=(lk||tg).dataset.lid;
    if(e.shiftKey){if(selL.has(lid))selL.delete(lid);else selL.add(lid)}
    else{if(!selL.has(lid)||selL.size>1)selL=new Set([lid]);sel.clear();updateSel()}
    drawLinks();
    if(lk&&!e.shiftKey)mode={k:'bend',lid:lid,sx:e.clientX,sy:e.clientY,moved:false};
    return;
  }
  if(!e.shiftKey&&(sel.size||selL.size)){sel.clear();selL.clear();updateSel();drawLinks()}
  mode={k:'pan',sx:e.clientX,sy:e.clientY,vx:view.x,vy:view.y};
  vp.style.cursor='grabbing';
});
window.addEventListener('pointermove',function(e){
  if(pts.has(e.pointerId))pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)clearTimeout(longT);
  if(!mode)return;
  var w,A,l,g;
  if(mode.k==='pinch'&&pts.size===2){var a=Array.from(pts.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);zoomAt((a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2,(mode.z*d/mode.d)/view.z);return}
  if(mode.k==='pan'){view.x=mode.vx+e.clientX-mode.sx;view.y=mode.vy+e.clientY-mode.sy;applyView();return}
  if(mode.k==='drag'){
    var dx=(e.clientX-mode.sx)/view.z,dy=(e.clientY-mode.sy)/view.z;
    if(!mode.moved&&Math.hypot(e.clientX-mode.sx,e.clientY-mode.sy)<(e.pointerType==='mouse'?3:8))return;
    mode.moved=true;
    mode.orig.forEach(function(o,id){var n=node(id);if(!n)return;n.x=Math.round(o.x+dx);n.y=Math.round(o.y+dy);var el=els[id];if(el){el.style.left=n.x+'px';el.style.top=n.y+'px'}});
    drawSoon();return;
  }
  if(mode.k==='bend'){
    if(!mode.moved&&Math.hypot(e.clientX-mode.sx,e.clientY-mode.sy)<6)return;
    mode.moved=true;l=linkById(mode.lid);if(!l)return;
    A=node(l.a);var B=node(l.b);if(!A||!B)return;
    w=toWorld(e.clientX,e.clientY);
    var base=geom({},A,B);
    /* a curva passa pelo dedo/ponteiro: controle = 2*ponto - média das pontas */
    l.bx=Math.round(2*w.x-(base.p1.x+base.p2.x)/2-base.dc.x);l.by=Math.round(2*w.y-(base.p1.y+base.p2.y)/2-base.dc.y);
    drawSoon();return;
  }
  if(mode.k==='connect'){
    A=node(mode.from);if(!A)return;w=toWorld(e.clientX,e.clientY);
    g=curve(edgePt(A,w.x,w.y),w);
    tmpPath='<path id="tmp" d="'+g.d+'" stroke="'+(YARN[A.g]||'#ffcf2a')+'"/>';
    setDrop(e,[mode.from]);drawSoon();return;
  }
  if(mode.k==='rewire'){
    l=linkById(mode.lid);if(!l)return;var fixedId=mode.end==='a'?l.b:l.a,F=node(fixedId);if(!F)return;
    w=toWorld(e.clientX,e.clientY);g=curve(edgePt(F,w.x,w.y),w);
    tmpPath='<path id="tmp" d="'+g.d+'" stroke="'+(l.color||YARN[node(l.a).g]||'#ffcf2a')+'"/>';
    setDrop(e,[fixedId]);drawSoon();return;
  }
  if(mode.k==='place'&&e.pointerType==='mouse'){
    l=linkById(mode.lid);if(!l)return;A=node(l.a);if(!A)return;
    w=toWorld(e.clientX,e.clientY);g=curve(edgePt(A,w.x,w.y),w);
    tmpPath='<path id="tmp" d="'+g.d+'" stroke="'+(l.color||YARN[A.g]||'#ffcf2a')+'"/>';
    setDrop(e,[l.a]);drawSoon();
  }
});
function endPointer(e){
  pts.delete(e.pointerId);clearTimeout(longT);
  var m=mode,h,wasTap=down&&Date.now()-down.t<350&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<12;
  if(m&&m.k!=='place'){
    if(m.k==='pinch'){if(pts.size<2)mode=null;down=null;return}
    mode=null;vp.style.cursor='';
    if((m.k==='drag'||m.k==='bend')&&m.moved)changed();
    if(m.k==='connect'){
      tmpPath='';h=clearDrop();
      if(h){var nl=addLink(m.from,h.dataset.id);if(nl){selL=new Set([nl.id]);sel.clear();updateSel();changed()}else toast('Esses dois cartões já estão ligados')}
      drawLinks();
    }
    if(m.k==='rewire'){
      tmpPath='';h=clearDrop();var l=linkById(m.lid);
      if(h&&l){
        var to=h.dataset.id,other=m.end==='a'?l.b:l.a;
        if(m.copy){var c=m.end==='a'?addLink(to,other,l):addLink(other,to,l);if(c){selL=new Set([c.id]);changed();toast('Cópia do fio criada')}else toast('Esses dois cartões já estão ligados')}
        else if(hasLink(to,other,l.id))toast('Esses dois cartões já estão ligados');
        else{l[m.end]=to;delete l.bx;delete l.by;changed()}
      }
      drawLinks();
    }
  }
  /* dois toques = duplo clique (telas de toque) */
  if(e.type==='pointerup'&&e.pointerType!=='mouse'&&wasTap&&!suppressTap){
    var now=Date.now();
    if(now-lastTap.t<380&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<30){lastTap.t=0;onDouble(document.elementFromPoint(e.clientX,e.clientY),e.clientX,e.clientY)}
    else lastTap={t:now,x:e.clientX,y:e.clientY};
  }
  suppressTap=false;down=null;
}
window.addEventListener('pointerup',endPointer);
window.addEventListener('pointercancel',endPointer);
vp.addEventListener('wheel',function(e){
  e.preventDefault();
  var dy=e.deltaMode===1?e.deltaY*16:e.deltaY;
  if(e.shiftKey){view.x-=dy;applyView();return}
  zoomAt(e.clientX,e.clientY,Math.exp(-dy*(e.ctrlKey?0.01:0.0016)));
},{passive:false});

/* ===== cliques em menus e comandos ===== */
document.addEventListener('click',function(e){
  var c=e.target.closest('[data-cmd]');if(c){cmd(c.dataset.cmd,c);return}
  var ad=e.target.closest('[data-add]');if(ad){closePanels();addNode(ad.dataset.add);return}
  var b=e.target.closest('[data-sw],[data-act],[data-lact],[data-sact]');if(!b)return;
  if(b.dataset.sact){selAction(b.dataset.sact);return}
  if(b.dataset.lact){
    var tg=b.closest('.tag'),l=tg&&linkById(tg.dataset.lid);if(!l)return;var a=b.dataset.lact;
    if(a==='color'){if(l.color===b.dataset.col)delete l.color;else l.color=b.dataset.col}
    else if(a==='dash')l.dash=!l.dash;
    else if(a==='arrow')l.arrow=!l.arrow;
    else if(a==='flip'){var x=l.a;l.a=l.b;l.b=x;if(!l.arrow)toast('Direção invertida (ative a seta ➔ para vê-la)')}
    else if(a==='straight'){delete l.bx;delete l.by}
    else if(a==='label'){editLabel(l.id);return}
    else if(a==='copy'){mode={k:'place',lid:l.id};toast('Toque no cartão que deve receber a cópia (Esc cancela)');return}
    else if(a==='cut'){selL=new Set([l.id]);delSel();return}
    drawLinks();changed();return;
  }
  var card=b.closest('.card');
  if(b.dataset.sw&&card){setGospel(card.dataset.id,b.dataset.sw);return}
  var act=b.dataset.act;
  if(act==='del'){if(card){sel=new Set([card.dataset.id]);selL.clear()}delSel()}
  else if(act==='dup'){if(card)sel=new Set([card.dataset.id]);dupSel()}
  else if(act==='edit'&&card){startEdit(card.querySelector('[data-f=ref]'),true)}
  else if(act==='link'&&card){sel=new Set([card.dataset.id]);updateSel();openPassage()}
});
function closePanels(except){
  ['drawer','lib','help'].forEach(function(id){if(id!==except)$('#'+id).classList.remove('open')});
  if(except!=='lib')$('#libBtn').classList.remove('on');
  if(except!=='drawer')$('#moreBtn').classList.remove('on');
}
function closeAll(){closePanels();$('#modal').classList.remove('open');$('#mbox').classList.remove('wide')}
function cmd(c,el){
  if(c==='passage'){closePanels();openPassage()}
  else if(c==='lib'){var o=!$('#lib').classList.contains('open');closePanels('lib');$('#lib').classList.toggle('open',o);$('#libBtn').classList.toggle('on',o);if(o)renderLib()}
  else if(c==='search'){var r=$('#searchRow');r.classList.toggle('open');if(r.classList.contains('open'))$('#q').focus()}
  else if(c==='undo')undo();
  else if(c==='redo')redo();
  else if(c==='more'){var d=!$('#drawer').classList.contains('open');closePanels('drawer');$('#drawer').classList.toggle('open',d);$('#moreBtn').classList.toggle('on',d);updInstall()}
  else if(c==='boards'){closePanels();openBoards()}
  else if(c==='export'){closePanels();openExport()}
  else if(c==='import'){closePanels();openImport()}
  else if(c==='front'){closePanels();openFront()}
  else if(c==='back'){closePanels();openBack()}
  else if(c==='install'){closePanels();doInstall()}
  else if(c==='help'){var hOpen=!$('#help').classList.contains('open');closePanels('help');$('#help').classList.toggle('open',hOpen)}
  else if(c==='zi')zoomAt(innerWidth/2,innerHeight/2,1.2);
  else if(c==='zo')zoomAt(innerWidth/2,innerHeight/2,1/1.2);
  else if(c==='fit')fit();
}

/* teclado */
window.addEventListener('keydown',function(e){
  var mod=e.ctrlKey||e.metaKey,k=(e.key||'').toLowerCase();
  var ae2=document.activeElement;
  if(ae2&&(ae2.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(ae2.tagName)))return;
  if($('#modal').classList.contains('open')){if(k==='escape')closeAll();return}
  if(mod&&k==='z'){e.preventDefault();if(e.shiftKey)redo();else undo()}
  else if(mod&&k==='y'){e.preventDefault();redo()}
  else if(mod&&k==='d'){e.preventDefault();dupSel()}
  else if(mod&&k==='a'){e.preventDefault();sel=new Set(data.nodes.map(function(n){return n.id}));updateSel()}
  else if(mod&&k==='s'){e.preventDefault();saveNow();toast('Salvo no aparelho')}
  else if(k==='delete'||k==='backspace'){e.preventDefault();delSel()}
  else if(k==='escape'){if(mode&&mode.k==='place'){mode=null;tmpPath='';clearDrop()}sel.clear();selL.clear();updateSel();drawLinks();closeAll()}
  else if(k==='enter'&&sel.size===1){e.preventDefault();var id=sel.values().next().value;startEdit(els[id].querySelector('[data-f=ref]'),true)}
  else if(k==='n'&&!mod){e.preventDefault();openPassage()}
});

/* ===== busca ===== */
function curQ(){var v=$('#q');return v?norm(v.value.trim()):''}
function match(n,q){return norm((n.ref||'')+' '+(n.title||'')+' '+(n.note||'')+' '+(GOS[n.g]?GOS[n.g].n:'')).indexOf(q)>=0}
function applySearch(){
  var q=curQ(),c=0;
  data.nodes.forEach(function(n){var el=els[n.id];if(!el)return;var m=q&&match(n,q);if(m)c++;el.classList.toggle('dim',!!q&&!m);el.classList.toggle('hit',!!m)});
  $('#qn').textContent=q?c+' achado(s)':'';
}
$('#q').addEventListener('input',function(){applySearch();drawLinks()});
$('#q').addEventListener('keydown',function(e){
  if(e.key==='Enter'){var q=curQ();var hits=data.nodes.filter(function(n){return q&&match(n,q)});if(!hits.length)return;
    var n=hits[0],s=size(n);view.x=innerWidth/2-(n.x+s.w/2)*view.z;view.y=innerHeight/2-(n.y+s.h/2)*view.z;applyView();this.blur()}
  if(e.key==='Escape'){this.value='';applySearch();drawLinks();this.blur()}
});
function syncVer(){$('#ver').value=data.ver||'ARC'}
$('#ver').onchange=function(){data.ver=this.value;Object.keys(els).forEach(function(id){var a=els[id].querySelector('[data-read]'),n=node(id);if(a&&n)a.href=readUrl(n.ref)});changed()};
$('#selbar').addEventListener('pointerdown',function(e){e.stopPropagation()});

/* ===== biblioteca ===== */
function renderLib(){
  var q=norm($('#libq').value.trim());
  $('#libList').innerHTML=LIB.map(function(s,i){
    var txt=norm(s.t+' '+s.refs.map(function(r){return r[1]}).join(' '));
    if(q&&txt.indexOf(q)<0)return '';
    return '<div class="li" data-li="'+i+'"><b>'+esc(s.t)+'</b><div class="chips">'+s.refs.map(function(r){return '<span class="chip" style="--c:'+GOS[r[0]].c+'">'+esc(r[1])+'</span>'}).join('')+'</div></div>';
  }).join('')||'<p>Nenhum conjunto encontrado. Use “＋” para criar o seu.</p>';
}
$('#libq').addEventListener('input',renderLib);
$('#libList').addEventListener('click',function(e){
  var li=e.target.closest('[data-li]');if(!li)return;
  var set=LIB[+li.dataset.li],c=centerWorld();
  var made=addCluster(data,set,Math.round(c.x-700),Math.round(c.y-60));
  sel=new Set(made);selL.clear();renderAll();changed();closePanels();
  toast(set.t+' adicionado — arraste os cartões selecionados para onde quiser');
});

/* ===== janela modal ===== */
function modal(title,text,body,buttons,wide){
  $('#mtitle').textContent=title;$('#mp').textContent=text||'';$('#mp').style.display=text?'':'none';
  var mb=$('#mbody');mb.innerHTML='';if(typeof body==='string')mb.innerHTML=body;else if(body)mb.appendChild(body);
  var row=$('#mrow');row.innerHTML='';
  buttons.forEach(function(b){var el=document.createElement('button');el.className='btn'+(b.cls?' '+b.cls:'');el.textContent=b.t;el.onclick=function(){b.f.call(el)};row.appendChild(el)});
  $('#mbox').classList.toggle('wide',!!wide);
  $('#modal').classList.add('open');
}
$('#modal').addEventListener('pointerdown',function(e){if(e.target.id==='modal')closeAll()});
function twoStep(el,label,fn){if(el.dataset.arm){fn();return}el.dataset.arm='1';var old=el.textContent;el.textContent=label;setTimeout(function(){if(el.isConnected){delete el.dataset.arm;el.textContent=old}},4000)}

/* nova passagem */
function openPassage(){
  var linkTo=Array.from(sel);
  var opts=Object.keys(GOS).map(function(g){return '<option value="'+g+'"'+(g===lastG?' selected':'')+'>'+GOS[g].n+'</option>'}).join('');
  var body='<div class="form">'+
   '<label>Referência<input id="fr" placeholder="ex.: Jo 3:16, Romanos 8:28, Is 53:5" autocomplete="off"></label>'+
   '<label>Grupo (cor do cartão)<select id="fg">'+opts+'</select></label>'+
   '<label>Título<input id="ft" placeholder="ex.: Nicodemos" autocomplete="off"></label>'+
   '<label>Anotações<textarea id="fn" rows="3"></textarea></label>'+
   (linkTo.length?'<label class="chk"><input type="checkbox" id="fl" checked> Ligar aos '+linkTo.length+' cartão(ões) selecionado(s)</label>':'<p>Dica: selecione um ou mais cartões antes para a passagem já nascer ligada a eles.</p>')+
   '</div>';
  function submit(keep){
    var ref=$('#fr').value.trim();if(!ref){$('#fr').focus();return}
    var g=$('#fg').value,doLink=linkTo.length&&$('#fl')&&$('#fl').checked,pos;
    if(doLink){var last=node(linkTo[linkTo.length-1]);pos=freeSpot(last.x+300,last.y)}
    else{var c=centerWorld();pos=freeSpot(c.x-125,c.y-50)}
    var n=newNode(g,pos.x,pos.y,ref,$('#ft').value.trim(),$('#fn').value.trim());lastG=g;
    if(doLink)linkTo.forEach(function(id){addLink(id,n.id)});
    if(!doLink)sel=new Set([n.id]);
    renderAll();changed();
    if(keep){$('#fr').value='';$('#ft').value='';$('#fn').value='';$('#fr').focus();toast(ref+' adicionado')}
    else{closeAll();toast(ref+' adicionado'+(doLink?' e ligado':''))}
  }
  modal('Nova passagem','',body,[{t:'Adicionar e continuar',f:function(){submit(true)}},{t:'Adicionar',cls:'save',f:function(){submit(false)}},{t:'Cancelar',f:closeAll}]);
  $('#fr').addEventListener('input',function(){var g=guessGroup(this.value);if(g)$('#fg').value=g});
  $('#mbody').addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();submit(false)}});
  setTimeout(function(){$('#fr').focus()},30);
}

/* ===== quadros ===== */
function openBoard(id){
  saveNow();
  var o=DB.load(id);if(!o){toast('Quadro não encontrado');return}
  curId=id;DB.setCurrent(id);
  data=clean(o);view=o.view||null;lastSnap=snap();past=[];future=[];sel.clear();selL.clear();
  renderAll();syncVer();
  if(view&&typeof view.z==='number')applyView();else{view={x:0,y:0,z:1};fit();readableStart()}
  status();
}
function fmtDate(t){try{return new Date(t).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}catch(e){return ''}}
function openBoards(){
  saveNow();
  function render(){
    var l=DB.list();
    $('#mbody').innerHTML='<div class="boards">'+l.map(function(b){
      var o=DB.load(b.id),n=o&&o.nodes?o.nodes.length:0;
      return '<div class="board'+(b.id===curId?' cur':'')+'" data-bid="'+b.id+'"><div class="nm"><b>'+esc(b.name)+(b.id===curId?' • aberto':'')+'</b><small>'+n+' cartões · '+fmtDate(b.updated)+'</small></div>'+
       (b.id!==curId?'<button class="btn" data-b="open">Abrir</button>':'')+
       '<button class="btn ic" data-b="ren" title="Renomear">✏️</button><button class="btn ic" data-b="dup" title="Duplicar">⧉</button>'+
       (l.length>1?'<button class="btn ic danger" data-b="del" title="Excluir">🗑</button>':'')+'</div>';
    }).join('')+'</div>';
  }
  modal('Meus quadros','Cada quadro é um mapa separado, salvo neste aparelho.','',[
    {t:'+ Quadro vazio',f:function(){var id=DB.create('Novo quadro',{nodes:[],links:[],ver:data.ver,lang:'pt'});openBoard(id);closeAll();toast('Quadro criado — toque no nome lá em cima para renomear')}},
    {t:'+ Com paralelos iniciais',f:function(){var id=DB.create('Paralelos dos Evangelhos',seed());openBoard(id);closeAll()}},
    {t:'Fechar',f:closeAll}]);
  render();
  $('#mbody').onclick=function(e){
    var b=e.target.closest('[data-b]');if(!b)return;var row=b.closest('[data-bid]'),id=row.dataset.bid,a=b.dataset.b;
    if(a==='open'){openBoard(id);closeAll()}
    else if(a==='dup'){var o=DB.load(id),nm=(DB.list().filter(function(x){return x.id===id})[0]||{}).name||'Quadro';DB.create(nm+' (cópia)',o);render()}
    else if(a==='del'){twoStep(b,'Confirmar?',function(){DB.remove(id);if(id===curId)openBoard(DB.list()[0].id);render();status()})}
    else if(a==='ren'){
      var nmEl=row.querySelector('.nm b'),cur=(DB.list().filter(function(x){return x.id===id})[0]||{}).name||'';
      var inp=document.createElement('input');inp.value=cur;row.querySelector('.nm').replaceChild(inp,nmEl);inp.focus();inp.select();
      var done=function(){var v=inp.value.trim();if(v)DB.rename(id,v);render();status()};
      inp.addEventListener('keydown',function(ev){if(ev.key==='Enter')done();if(ev.key==='Escape')render()});inp.addEventListener('blur',done);
    }
  };
}

/* ===== exportar / importar ===== */
function exportJSON(){var b=DB.list().filter(function(x){return x.id===curId})[0];return JSON.stringify({app:'mapa-dos-evangelhos',versao:3,nome:b?b.name:'',ver:data.ver,lang:'pt',nodes:data.nodes,links:data.links},null,2)}
function fileName(ext){var b=DB.list().filter(function(x){return x.id===curId})[0],nm=norm(b?b.name:'mapa').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'mapa';return nm+'-'+new Date().toISOString().slice(0,10)+'.'+ext}
function downloadText(name,text,type){
  var blob=new Blob([text],{type:type||'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);
}
function canShareFiles(){try{return !!(navigator.canShare&&navigator.canShare({files:[new File(['{}'],'x.json',{type:'application/json'})]}))}catch(e){return false}}
function copyBtn(getText){return {t:'Copiar',f:function(){var b=this,txt=getText();try{navigator.clipboard.writeText(txt).then(function(){b.textContent='Copiado ✓'},function(){b.textContent='Use Ctrl/Cmd+C'})}catch(e){b.textContent='Use Ctrl/Cmd+C'}}}}
function openExport(){
  var btns=[copyBtn(function(){return $('#mta').value}),{t:'Baixar .json',cls:'save',f:function(){downloadText(fileName('json'),$('#mta').value);toast('Arquivo baixado')}}];
  if(canShareFiles())btns.push({t:'Compartilhar',f:function(){var f=new File([$('#mta').value],fileName('json'),{type:'application/json'});navigator.share({files:[f],title:'Mapa dos Evangelhos'}).catch(function(){})}});
  btns.push({t:'Fechar',f:closeAll});
  modal('Exportar quadro','Backup do quadro aberto. Guarde o arquivo, mande para outro aparelho e use Importar lá.','<textarea class="code" id="mta" spellcheck="false" style="height:40vh"></textarea>',btns);
  $('#mta').value=exportJSON();
}
function openImport(){
  var body='<div class="row" style="justify-content:flex-start"><label class="btn" style="cursor:pointer">📂 Escolher arquivo .json<input type="file" id="ifile" accept=".json,application/json" style="display:none"></label><span id="iname" style="font-weight:700;font-size:13px;align-self:center"></span></div><textarea class="code" id="mta" spellcheck="false" style="height:32vh" placeholder="…ou cole aqui o texto exportado"></textarea>';
  function parse(){var o=JSON.parse($('#mta').value);if(!o||!Array.isArray(o.nodes))throw new Error('formato');return o}
  modal('Importar','Abra um arquivo exportado (deste app ou da versão no Claude) ou cole o texto.',body,[
    {t:'Como quadro novo',cls:'save',f:function(){try{var o=parse(),c=clean(o);var id=DB.create(o.nome||'Quadro importado',c);openBoard(id);closeAll();fit();toast('Quadro importado')}catch(e){toast('Esse conteúdo não é uma exportação válida')}}},
    {t:'Substituir o atual',f:function(){var el=this;twoStep(el,'Confirmar?',function(){try{var c=clean(parse());data.nodes=c.nodes;data.links=c.links;data.ver=c.ver;sel.clear();selL.clear();renderAll();syncVer();changed();closeAll();fit();toast('Quadro substituído (Desfazer volta)')}catch(e){toast('Esse conteúdo não é uma exportação válida')}})}},
    {t:'Cancelar',f:closeAll}]);
  $('#ifile').onchange=function(){var f=this.files&&this.files[0];if(!f)return;$('#iname').textContent=f.name;var r=new FileReader();r.onload=function(){$('#mta').value=String(r.result||'')};r.readAsText(f)};
}

/* ===== código: front-end e back-end ===== */
var CUSTOM_CSS='mapa-codigo-css',CUSTOM_JS='mapa-codigo-js';
function fetchText(p){return fetch(p,{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.text()}).catch(function(){
  if(window.caches)return caches.match(p).then(function(r){return r?r.text():'(arquivo indisponível offline)'});return '(arquivo indisponível)'})}
function getLS(k){try{return localStorage.getItem(k)}catch(e){return null}}
function tabbed(tabs){
  var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:8px';
  var bar=document.createElement('div');bar.className='tabs';wrap.appendChild(bar);
  tabs.forEach(function(t,i){
    var b=document.createElement('button');b.className='btn'+(i===0?' on':'');b.textContent=t.t;bar.appendChild(b);
    var ta=document.createElement('textarea');ta.className='code';ta.spellcheck=false;ta.value=t.v;ta.dataset.tab=t.id;ta.dataset.file=t.file||'';if(!t.edit)ta.readOnly=true;ta.style.display=i===0?'':'none';wrap.appendChild(ta);
    ta.addEventListener('keydown',function(e){if(e.key==='Tab'&&!ta.readOnly){e.preventDefault();ta.setRangeText('  ',ta.selectionStart,ta.selectionEnd,'end')}});
    b.onclick=function(){Array.prototype.forEach.call(bar.children,function(x){x.classList.remove('on')});b.classList.add('on');Array.prototype.forEach.call(wrap.querySelectorAll('textarea'),function(x){x.style.display=x.dataset.tab===t.id?'':'none'})};
  });
  return wrap;
}
function activeTA(){var t=$('#mbody').querySelectorAll('textarea');for(var i=0;i<t.length;i++)if(t[i].style.display!=='none')return t[i]}
function taVal(id){var t=$('#mbody').querySelector('textarea[data-tab="'+id+'"]');return t?t.value:''}
function openFront(){
  toast('Carregando código…');
  Promise.all(['app.css','app.js','index.html','sw.js','manifest.webmanifest'].map(fetchText)).then(function(r){
    var oCss=r[0],oJs=r[1],cCss=getLS(CUSTOM_CSS),cJs=getLS(CUSTOM_JS),custom=!!(cCss||cJs);
    var body=tabbed([
      {id:'css',t:'app.css (aparência)',v:cCss||oCss,edit:true,file:'app.css'},
      {id:'js',t:'app.js (comportamento)',v:cJs||oJs,edit:true,file:'app.js'},
      {id:'html',t:'index.html',v:r[2],edit:false,file:'index.html'},
      {id:'sw',t:'sw.js (offline)',v:r[3],edit:false,file:'sw.js'},
      {id:'mf',t:'manifest',v:r[4],edit:false,file:'manifest.webmanifest'}]);
    var txt='“Aplicar neste aparelho” usa o seu CSS/JS só aqui, por cima do original. Para mudar o app de vez (para todos e na loja), baixe o arquivo, substitua-o na pasta do projeto e publique de novo.'+(custom?' ⚠ Este aparelho já está usando código personalizado.':'')+' Se algo quebrar, abra o app com ?seguro no fim do endereço.';
    var btns=[copyBtn(function(){return activeTA().value}),
      {t:'Baixar arquivo',f:function(){var ta=activeTA();downloadText(ta.dataset.file,ta.value,'text/plain')}},
      {t:'Aplicar neste aparelho',cls:'save',f:function(){var el=this;twoStep(el,'Confirmar e recarregar?',function(){applyCode(taVal('css'),taVal('js'),oCss,oJs)})}}];
    if(custom)btns.push({t:'Restaurar original',cls:'danger',f:function(){var el=this;twoStep(el,'Confirmar?',function(){try{localStorage.removeItem(CUSTOM_CSS);localStorage.removeItem(CUSTOM_JS)}catch(e){}saveNow();location.reload()})}});
    btns.push({t:'Fechar',f:closeAll});
    modal('Código do front-end',txt,body,btns,true);
  });
}
function applyCode(css,js,oCss,oJs){
  try{new Function(js)}catch(e){toast('Erro de sintaxe no JavaScript: '+e.message);return}
  try{
    if(css!==oCss)localStorage.setItem(CUSTOM_CSS,css);else localStorage.removeItem(CUSTOM_CSS);
    if(js!==oJs)localStorage.setItem(CUSTOM_JS,js);else localStorage.removeItem(CUSTOM_JS);
  }catch(e){toast('Não foi possível guardar o código neste aparelho');return}
  saveNow();location.reload();
}
function openBack(){
  var src=getLS(CUSTOM_JS);
  (src?Promise.resolve(src):fetchText('app.js')).then(function(js){
    var A='/*<'+'backend>*/',Z='/*</'+'backend>*/',i=js.indexOf(A),j=js.indexOf(Z);
    var persistCode=i>=0&&j>i?js.slice(i+A.length,j).trim():'(trecho não encontrado)';
    var l=DB.list(),total=0;
    var rows=l.map(function(b){var by=DB.bytes(b.id);total+=by;return '• '+b.name+(b.id===curId?' (aberto)':'')+': '+(by/1024).toFixed(1)+' KB'}).join('\n');
    var storage='Quadros salvos neste aparelho:\n'+rows+'\n\nTotal aproximado: '+(total/1024).toFixed(1)+' KB (o navegador costuma permitir cerca de 5 MB para este app).';
    var how='Não existe servidor. O "back-end" é o próprio aparelho.\n\n'+
      '• Os quadros ficam no armazenamento local do navegador (localStorage), com salvamento automático a cada alteração.\n'+
      '• O app pede ao navegador armazenamento persistente para evitar que os dados sejam apagados quando faltar espaço.\n'+
      '• O service worker (sw.js) guarda os arquivos do app para funcionar sem internet.\n'+
      '• Não há sincronização entre aparelhos. Para levar um quadro a outro aparelho, use Exportar/Importar.\n'+
      '• Apagar os dados do site no navegador, ou desinstalar o app, apaga os quadros. Exporte com regularidade.\n\n'+
      'Na aba “Dados” você pode editar o JSON do quadro aberto e aplicar.';
    var body=tabbed([{id:'data',t:'Dados do quadro (JSON)',v:exportJSON(),edit:true},{id:'store',t:'Armazenamento',v:storage,edit:false},{id:'persist',t:'Código de persistência',v:persistCode,edit:false},{id:'how',t:'Como funciona',v:how,edit:false}]);
    modal('Back-end',null,body,[copyBtn(function(){return activeTA().value}),
      {t:'Aplicar dados',cls:'save',f:function(){try{var c=clean(JSON.parse(taVal('data')));data.nodes=c.nodes;data.links=c.links;data.ver=c.ver;sel.clear();selL.clear();renderAll();syncVer();changed();closeAll();toast('Dados aplicados (Desfazer volta)')}catch(e){toast('JSON inválido: '+(e.message||''))}}},
      {t:'Fechar',f:closeAll}],true);
    if(navigator.storage&&navigator.storage.estimate)navigator.storage.estimate().then(function(est){var ta=$('#mbody').querySelector('textarea[data-tab="store"]');if(ta&&est&&est.quota)ta.value+='\nCota total do site informada pelo navegador: '+(est.quota/1048576).toFixed(0)+' MB.'}).catch(function(){});
  });
}

/* ===== instalação (PWA) ===== */
var deferredPrompt=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;updInstall()});
window.addEventListener('appinstalled',function(){deferredPrompt=null;updInstall();toast('App instalado 🎉')});
function isStandalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}
function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function updInstall(){$('#installBtn').style.display=isStandalone()?'none':''}
function doInstall(){
  if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.then(function(){deferredPrompt=null;updInstall()});return}
  if(isIOS())modal('Instalar no iPhone/iPad','',"<p>1. Abra este endereço no <b>Safari</b>.<br>2. Toque em <b>Compartilhar</b> (o quadrado com a seta para cima).<br>3. Escolha <b>Adicionar à Tela de Início</b>.</p>",[{t:'Entendi',f:closeAll}]);
  else modal('Instalar o app','',"<p>No Chrome ou Edge: abra o menu do navegador (⋮) e escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.<br><br>Se a opção não aparecer, confira se o endereço começa com <b>https://</b>.</p>",[{t:'Entendi',f:closeAll}]);
}

/* ===== atualização do app (service worker) ===== */
if('serviceWorker' in navigator&&location.protocol!=='file:'){
  navigator.serviceWorker.register('sw.js').then(function(reg){
    function ask(w){toastAction('Nova versão do app disponível','Atualizar',function(){saveNow();w.postMessage('skipWaiting')})}
    if(reg.waiting&&navigator.serviceWorker.controller)ask(reg.waiting);
    reg.addEventListener('updatefound',function(){var w=reg.installing;if(!w)return;w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller)ask(w)})});
    setInterval(function(){reg.update().catch(function(){})},60*60*1000);
  }).catch(function(){});
  var refreshing=false;
  navigator.serviceWorker.addEventListener('controllerchange',function(){if(refreshing)return;refreshing=true;location.reload()});
}

/* ===== avisos ===== */
var tt=0;
function toast(m){var t=$('#toast');t.className='';t.textContent=m;void t.offsetWidth;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2800)}
function toastAction(m,label,fn){
  var t=$('#toast');t.innerHTML='';var s=document.createElement('span');s.textContent=m;var b=document.createElement('button');b.textContent=label;b.onclick=function(){t.classList.remove('show','act');fn()};
  t.appendChild(s);t.appendChild(b);t.className='show act';clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show','act')},15000);
}
window.addEventListener('resize',function(){drawSoon()});

/* ===== início ===== */
renderAll();syncVer();
if(view&&typeof view.z==='number')applyView();else{view={x:0,y:0,z:1};applyView();fit();readableStart()}
status();updInstall();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){drawLinks()});
if(window.__MAPA&&window.__MAPA.custom)setTimeout(function(){toast('Usando código personalizado deste aparelho')},600);
if(!DB.ok)setTimeout(function(){toast('Armazenamento indisponível: exporte o quadro antes de fechar')},800);
if(/[?&]acao=nova\b/.test(location.search))setTimeout(openPassage,300);
if(window.__MAPA)window.__MAPA.ok=true;
})();
