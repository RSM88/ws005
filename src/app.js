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
    //const user_type = req.body['user_type'];
    const user_type = req.body.user_type;
    const user_id = 'client_' + Date.now();
    //const token = jwt.sign({ user: 'android_client' }, SECRET_KEY, { expiresIn: '1h' });
    const token = jwt.sign({ user: user_id }, SECRET_KEY, { expiresIn: '120s' });
    console.log(`user  ${user_id} is user-type ${user_type}`);
    res.json({ token });
});

// Starting the Server: The Express server starts listening on the defined port.
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket Server Initialization: A WebSocket server is created and associated with the HTTP server.
const wss = new WebSocket.Server({ server });
//const wss = new WebSocket.Server({port:4000}); // If needed ws run on different port

// Handling Connections: When a client connects, the server verifies
// the JWT token and establishes a WebSocket connection.
wss.on('connection', (ws, req) => {
    // Token Verification: The token from the client's request header is verified.
    // If the token is invalid, the connection is closed.
    
    //const token = req.headers['authorization'].split(' ')[1];

    const token = req.headers['othertoken'];


    console.log('Authorization header:', token);

    try{

        /*
        const payload = {
            user: 'android_client001',    // Custom claim: Identifies the user or client
            iat: Math.floor(Date.now() / 1000),  // Issued at: current time in Unix timestamp (seconds)
            exp: Math.floor(Date.now() / 1000) + 60 // Expiration: token expires in 1 minute
        };
        */

        //token = jwt.sign(payload, SECRET_KEY);

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            console.log('received: %s', decoded);
           
            console.log('Issued at:', (new Date(decoded.iat * 1000)).toISOString()); // 'Issued at: 2025-02-11T08:00:03.000Z'
            console.log('Expires at:', (new Date(decoded.exp * 1000)).toISOString());

            if (err) {
                //ws.close();
                ws.send('token verification failed');
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

    } catch(e) {
        console.log('error: ' + e.message);
    }

});




// Send Message Endpoint: This endpoint broadcasts a message to 
// all connected clients.
// Broadcasting: The server iterates through all connected 
// clients and sends the message to each one that has an open connection.
app.post('/send-message', (req, res) => {
    const { title } = req.body;
    const { message } = req.body;

    const payload = JSON.stringify({
        title: title,
        message: message
    })

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });

    res.json({ success: true });
});

app.get('/test001', (req, res) => {
    res.status(200).json('Connection OK !!!');
});


