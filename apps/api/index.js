import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(process.cwd(), 'notes.json');

app.use(cors());
app.use(express.json());
app.get('/api/health', (req,res)=> res.json({ ok:true, time: Date.now() }));

function readNotes(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf-8')||'[]'); } catch(e){ return []; }
}
function writeNotes(notes){ fs.writeFileSync(DATA_FILE, JSON.stringify(notes,null,2)); }

app.post('/api/notes/sync', (req,res)=>{
  const incoming = Array.isArray(req.body.notes) ? req.body.notes : [];
  const existing = readNotes();
  const existingIds = new Set(existing.map(n=>n.id));
  let added = 0;
  for(const n of incoming){
    if(!existingIds.has(n.id)){
      existing.push(n); added++;
    }
  }
  writeNotes(existing);
  res.json({ ok:true, saved: added, total: existing.length });
});

app.get('/api/notes', (req,res)=>{
  res.json({ ok:true, notes: readNotes() });
});

app.listen(PORT, ()=> console.log('API running on port', PORT));
