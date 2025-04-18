const express = require('express');
const app = express();
const PORT = 8009;
app.use(express.json());
app.use(express.static('public'));

let blockchain = [];
let pendingRequests = [];

// Simple hash function for demo purposes
const hash = (block) => {
  return require('crypto').createHash('sha256').update(JSON.stringify(block)).digest('hex');
};

// Genesis Block
const createGenesisBlock = () => {
  const genesisBlock = {
    index: 0,
    timestamp: Date.now(),
    transactions: 'Genesis Block',
    previousHash: '0',
  };
  genesisBlock.hash = hash(genesisBlock);
  return genesisBlock;
};

blockchain.push(createGenesisBlock());

app.post('/request', (req, res) => {
  pendingRequests.push(req.body);
  res.json({ message: 'Request submitted' });
});

app.get('/requests', (req, res) => {
  res.json(pendingRequests);
});

app.post('/approve', (req, res) => {
  const request = req.body;
  const block = {
    index: blockchain.length,
    timestamp: Date.now(),
    transactions: [request],
    previousHash: blockchain[blockchain.length - 1].hash,
  };
  block.hash = hash(block);
  blockchain.push(block);

  pendingRequests = pendingRequests.filter(r =>
    !(r.sender === request.sender && r.recipient === request.recipient && r.amount === request.amount)
  );

  res.json({ message: 'Transaction approved and block added' });
});

app.get('/chain', (req, res) => {
  res.json(blockchain);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
