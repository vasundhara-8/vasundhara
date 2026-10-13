require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client using environment key variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 1. AI Prompt Completion Endpoint 
 */
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
        });
        
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error Context:", error);
        res.status(500).json({ error: "OpenAI node interface failed." });
    }
});

/**
 * 2. UPI Intent Request Generator Endpoint
 * Standard structural compilation for strict peer-to-merchant strings
 */
app.post('/api/payments/create-upi', (req, res) => {
    const { amount, userId } = req.body;
    
    const merchantVpa = process.env.MERCHANT_UPI_ID; // e.g., corporate@oksbi
    const merchantName = encodeURIComponent(process.env.MERCHANT_NAME || "ChatGPT Clone");
    const transactionId = `TXN${Date.now()}U${userId}`;
    const transactionRef = `REF${Date.now()}`;
    
    // Construct standard NPCI compliant deep-link string format
    const upiIntentUrl = `upi://pay?pa=${merchantVpa}&pn=${merchantName}&tr=${transactionId}&tn=Premium%20Plan%20Upgrade&am=${amount}&cu=INR`;
    
    res.json({
        success: true,
        upiUrl: upiIntentUrl,
        transactionId: transactionId
    });
});

// Start Server Core
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gateway running online on structural port: ${PORT}`));

