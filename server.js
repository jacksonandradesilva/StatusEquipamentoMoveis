const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DATA_FILE = path.join(__dirname, 'Status_Mina.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If file doesn't exist or invalid, return empty array
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/status', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/status', async (req, res) => {
  // Create new item
  try {
    const payload = req.body || {};
    let data = await readData();

    if (!Array.isArray(data)) data = [];

    const nextId = data.length > 0 ? Math.max(...data.map(i => Number(i.id) || 0)) + 1 : 1;
    const item = Object.assign({}, payload, { id: payload.id || nextId });
    data.push(item);
    await writeData(data);
    io.emit('statusUpdated', data);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/status/:id', async (req, res) => {
  const id = req.params.id;
  const payload = req.body || {};
  try {
    let data = await readData();
    if (!Array.isArray(data)) return res.status(500).json({ error: 'Unsupported data format' });
    const idx = data.findIndex(it => String(it.id) === String(id) || String(it.name) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Item not found' });
    data[idx] = Object.assign({}, data[idx], payload);
    await writeData(data);
    io.emit('statusUpdated', data);
    res.json(data[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

io.on('connection', socket => {
  console.log('Client connected', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
