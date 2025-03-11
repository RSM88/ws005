const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const morgan = require('morgan')
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';
const path = require('path')

// Middleware: is used to parse JSON request bodies.
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

// Mapa que almacena a todos los usuarios subscritos
let clientDataMap = new Map();

// Este Endpoint genera un token JWT; asi se suscribe un nuevo cliente
app.post('/subscribe', (req, res) => {
    const user_type = req.body.user_type;
    const user_id = 'client_' + Date.now();
    const token = jwt.sign({ user: user_id }, SECRET_KEY, { expiresIn: '60s' });
    console.log(`user  ${user_id} is user-type ${user_type}`);
    res.json({ token });
});

// Iniciando el servidor: El servidor queda a la escucha en el puerto indicado.
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Se inicia servidor WebSocket: se crea y se asocia con el servidor HTTP
const wss = new WebSocket.Server({ server });
// Si fuera necesario el WebSocket puede correr en otro puerto
//const wss = new WebSocket.Server({port:4000});

// Se gestionan las conexiones:
// Al conectarse un cliente se verifica el token y 
// se establece un canal de conexion WebSocket
wss.on('connection', (ws, req) => {

    const token = req.headers['othertoken'];
    const user_type = req.headers['user_type'];

    console.log('Authorization header:', token);

    try{

        // Se verifica token
        jwt.verify(token, SECRET_KEY, (err, decoded) => {

            // Se almacena la conexion WebSocket del cliente
            // en turno y  se asocia con un ID
            clientDataMap.set(decoded.user, {
                clientId: decoded.user,
                userType: user_type,
                ws: ws 
              });
 
            if (err) {
                ws.send('token verification failed');
                return;
            }
    
            // Se gestionan mensajes: 
            // El servidor escucha mensajes del cliente
            ws.on('message', (message) => {
                console.log('Received from Client: %s', message);
            });
    
            ws.send('Connected to WebSocket server');
        });

    } catch(e) {
        console.log('error: ' + e.message);
    }

});

// Endpiont que recive peticion POST:
// Gestiona el envio de mensajes a los clientes conectados.
app.post('/send-message', (req, res) => {
    const { title } = req.body;
    const { message } = req.body;
    const { groupe } = req.body;

    const payload = JSON.stringify({
        title: title,
        message: message,
        groupe: groupe
    })



    // Se utiliza el Mapa con el listados de todos los clientes
    // conectados para enviar el mensaje
    clientDataMap.forEach((clientData, clientId) => {

        // ---
        console.log('userType: %s', clientData.userType);
        console.log('groupe: %s', groupe);
        // ---
    
        if(groupe === clientData.userType) {
            console.log('Equal!');
        }
       
        if (clientData.ws.readyState === WebSocket.OPEN &&
            (groupe === clientData.userType || groupe === '0')) {
            clientData.ws.send(payload);
            console.log('Notification sended to;');
            console.log('user: %s', clientId);
        }
    });

    res.json({ success: true });
});

