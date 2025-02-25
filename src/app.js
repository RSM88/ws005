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

let clientIdMap = new Map();
let clientDataMap = new Map();

// Handling Connections: When a client connects, the server verifies
// the JWT token and establishes a WebSocket connection.
wss.on('connection', (ws, req) => {

    //const clientId = generateUniqueClientId();
    //clientIdMap.set(clientId, ws);

    // Token Verification: The token from the client's request header is verified.
    // If the token is invalid, the connection is closed.
    
    //const token = req.headers['authorization'].split(' ')[1];

    const token = req.headers['othertoken'];
    const user_type = req.headers['user_type'];


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

            clientIdMap.set(decoded.user, ws);

            //console.log('received: %s', decoded);
            console.log('user: %s', decoded.user);
            console.log('user_type: %s', user_type);
            console.log('Issued at:', (new Date(decoded.iat * 1000)).toISOString()); // 'Issued at: 2025-02-11T08:00:03.000Z'
            console.log('Expires at:', (new Date(decoded.exp * 1000)).toISOString());


            clientDataMap.set(decoded.user, {
                clientId: decoded.user,
                userType: user_type,
                ws: ws
              });
            //console.log('Data from clientDataMap:');
            //console.log('clientId: %s', clientDataMap.getClientById(decoded.user).clientId);
            //console.log('user_type: %s', clientDataMap.getClientById(decoded.user).userType);

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
    const { groupe } = req.body;

    const payload = JSON.stringify({
        title: title,
        message: message,
        groupe: groupe
    })

/*
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
*/
/*
    clientIdMap.forEach((ws, clientId) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
            console.log('Notification sended to;');
            console.log('user: %s', clientId);
        }
    });
*/
    clientDataMap.forEach((clientData, clientId) => {

        /*
        console.log('userType: %s', clientData.userType);
        console.log('groupe: %s', groupe);

        if(groupe === clientData.userType) {
            console.log('Equal!');
        }
        */
       
        if (clientData.ws.readyState === WebSocket.OPEN && 
            (groupe === clientData.userType || groupe === '0')) {
            clientData.ws.send(payload);
            console.log('Notification sended to;');
            console.log('user: %s', clientId);
            //console.log('userType: %s', clientData.userType);
        }
    });

    res.json({ success: true });
});

app.get('/test001', (req, res) => {
    res.status(200).json('Connection OK !!!');
});


//----
function generateUniqueClientId() {
    return Math.random().toString(36).substring(7);
}

function getClientById(clientId) {
    return clientIdMap.get(clientId);
}