require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const keycloak = require('./config/keycloak-config').initKeycloak();
const routerDB = require('./routes/db');
const session = require('express-session');
var http = require('http');

// Constants
const PORT = process.env.BACKEND_HOST_PORT;
const HOST = process.env.BACKEND_HOST_IP;

// App
const app = express();

app.use(session({
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    secure: true,
    store: keycloak.store
}));
app.use(keycloak.middleware());

//Konvertiert Token-Bodys in JSON
app.use(bodyParser.json());

var corsOption = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200
}
app.use(cors(corsOption));

//Seiten
//Ruft alle /db Seiten auf
app.use('/db', routerDB);

//Hört Webadresse und Port ab
// app.listen(PORT, HOST);
http.createServer(app).listen(PORT);

