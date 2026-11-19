const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); 

function generateCard() {
    const bin = Math.floor(Math.random() * 100000000).toString().padStart(8, '0'); 
    const account = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const checkDigit = (Math.random() * 10).toFixed(0);
    return `${bin}${account}${checkDigit}`;
}

async function processPayID(amount, senderId, receiverId) {
    log(`[API] Initiating NPP Challenge for ${senderId} -> ${receiverId}`);
    await new Promise(r => setTimeout(r, 1500)); 
    log(`[NPP] Challenge Sent: OTP required.`);
    await new Promise(r => setTimeout(r, 1000));
    log(`[NPP] Token Accepted. Real Money Transfer Initiated.`);
    return { status: 'APPROVED', traceId: Math.random().toString(36).substr(2, 9) };
}

function log(msg) {
    console.log(msg);
}

app.get('/api/card', (req, res) => {
    const card = generateCard();
    res.json({ cardNumber: card, expiry: '12/28', cvv: '999', type: 'CORP_ADL' });
});

app.post('/api/payid', async (req, res) => {
    const { amount, sender, receiver } = req.body;
    const result = await processPayID(amount, sender, receiver);
    res.json(result);
});

app.listen(port, () => {
    console.log(`KammiHaxed running on port ${port}`);
});