// app.js - Note Saver PWA (vanilla)
const noteEl = document.getElementById('note');
const saveBtn = document.getElementById('saveNote');
const clearBtn = document.getElementById('clearNote');
const syncBtn = document.getElementById('syncServer');
const noteListEl = document.getElementById('noteList');
const statusEl = document.getElementById('status');
const API = (window.__API_URL__ || (window.location.origin.replace(/:\d+$/,'') + ':3000')) + '/api';

function showStatus(msg, timeout=2500){
  statusEl.textContent = msg;
  clearTimeout(showStatus._t);
  showStatus._t = setTimeout(()=> statusEl.textContent = '', timeout);
}

async function loadNotes(){
  const stored = JSON.parse(localStorage.getItem('notes')||'[]');
  renderNotes(stored);
}

function renderNotes(notes){
  noteListEl.innerHTML='';
  if(!notes.length){ noteListEl.innerHTML = '<li class="empty">Nenhuma nota salva</li>'; return; }
  notes.sort((a,b)=>b.createdAt-a.createdAt);
  for(const n of notes){
    const li = document.createElement('li'); li.className='note-item';
    const t = document.createElement('div'); t.textContent = n.text; t.className='note-text';
    const m = document.createElement('div'); m.className='note-meta'; m.textContent = new Date(n.createdAt).toLocaleString();
    const actions = document.createElement('div'); actions.className='note-actions';
    const copy = document.createElement('button'); copy.textContent='Copiar'; copy.className='btn'; copy.onclick=()=>navigator.clipboard.writeText(n.text);
    const del = document.createElement('button'); del.textContent='Excluir'; del.className='btn outline'; del.onclick=()=>{ deleteNote(n.id); };
    actions.appendChild(copy); actions.appendChild(del);
    li.appendChild(t); li.appendChild(m); li.appendChild(actions);
    noteListEl.appendChild(li);
  }
}

function saveLocal(note){
  const notes = JSON.parse(localStorage.getItem('notes')||'[]');
  notes.unshift(note);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes(notes);
}

async function deleteNote(id){
  let notes = JSON.parse(localStorage.getItem('notes')||'[]');
  notes = notes.filter(n=>n.id!==id);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes(notes);
  showStatus('Nota excluída localmente');
}

saveBtn.addEventListener('click', ()=>{
  const text = noteEl.value.trim();
  if(!text){ showStatus('Escreva algo antes de salvar'); return; }
  const note = { id: Date.now(), text, createdAt: Date.now() };
  saveLocal(note);
  noteEl.value='';
  showStatus('Nota salva localmente');
});

clearBtn.addEventListener('click', ()=>{
  noteEl.value='';
  showStatus('Campo limpo');
});

// sync with server: POST /api/notes (sends local notes)
syncBtn.addEventListener('click', async ()=>{
  const notes = JSON.parse(localStorage.getItem('notes')||'[]');
  try{
    const res = await fetch(API + '/notes/sync', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ notes })
    });
    const data = await res.json();
    if(data.ok){
      showStatus('Sincronizado com servidor ('+ (data.saved||0) +' notas)');
    } else {
      showStatus('Erro ao sincronizar');
    }
  } catch(e){
    showStatus('Erro: ' + e.message);
  }
});

// initial load
loadNotes();
