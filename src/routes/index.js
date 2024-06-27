app.use(require('./src/app'));

const { Router } = require('express')

const router = Router()

// ---
//const WebSocket = require('ws');

//const wss = new WebSocket.Server({ server });

// Send Message Endpoint: This endpoint broadcasts a message to 
// all connected clients.
// Broadcasting: The server iterates through all connected 
// clients and sends the message to each one that has an open connection.
router.post('/send-message', (req, res) => {
    const { message } = req.body;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    res.json({ success: true });
});

// ---
router.get('/', (req, res) => {
    res.status(200).json('Connection OK!');
});



module.exports = router;
// ---