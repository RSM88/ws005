// El codigo de esta app fue propuesto por Chatgpt:
// se le pidio generar codio para android (cliente) y nodejs (servidor)
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

//const router = Router()

// ---
const morgan = require('morgan')
//const path = require('path')
// ---

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware: is used to parse JSON request bodies.
app.use(bodyParser.json());

// ---
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const path = require('path')

// ---
app.use(express.static(path.join(__dirname, 'public')));
//app.use(require('./routes/index'));
// ---

// Subscription Endpoint: This endpoint generates a JWT token when a client subscribes.
app.post('/subscribe', (req, res) => {
    const token = jwt.sign({ user: 'android_client' }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Starting the Server: The Express server starts listening on the defined port.
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket Server Initialization: A WebSocket server is created and associated with the HTTP server.
const wss = new WebSocket.Server({ server });

// Handling Connections: When a client connects, the server verifies
// the JWT token and establishes a WebSocket connection.
wss.on('connection', (ws, req) => {
    // Token Verification: The token from the client's request header is verified.
    // If the token is invalid, the connection is closed.
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            ws.close();
            return;
        }

        // Message Handling: The server listens for messages from
        // the client and can send messages back to the client.
        ws.on('message', (message) => {
            console.log('received: %s', message);
        });

        ws.send('Connected to WebSocket server');
        //ws.send(message);
    });
});


//module.exports = app;

// ---
//const WebSocket = require('ws');

//const wss = new WebSocket.Server({ server });

// Send Message Endpoint: This endpoint broadcasts a message to 
// all connected clients.
// Broadcasting: The server iterates through all connected 
// clients and sends the message to each one that has an open connection.

app.post('/send-message', (req, res) => {
    const { title } = req.body;
    const { message } = req.body;
    //const data = req.data.json()

    const payload = JSON.stringify({
        title: title,
        message: message
    })

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log(client, message);
            //client.send("Your message was: " + title + message); //bueno
            //client.send("Your message was: " + data.message);
            client.send(payload);
            
        }
    });

    res.json({ success: true });
});

app.get('/test001', (req, res) => {
    res.status(200).json('Connection OK !!!');
});



