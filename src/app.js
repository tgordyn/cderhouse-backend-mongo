import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import mongoose from './config/database.js';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/api/sessions.js';
import viewsRouter from './routes/views.js';
import cartRouter from './routes/api/cart.js';
import ticketRouter from './routes/api/ticket.js';
import productRouter from './routes/api/products.js';
import methodOverride from 'method-override';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import Handlebars from 'handlebars';

dotenv.config();


const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server);

//console.log(app.get('env'))
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
// Configuración de Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();

app.use(session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.mongoUrl
    })
}));

app.use(passport.initialize());
app.use(methodOverride('_method'));


app.set('socketio', io);

// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/products', productRouter);
app.use('/', viewsRouter);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Página no encontrada.' });
});

// Configuración de Socket.IO
io.on('connection', (socket) => {
  //console.log('Nuevo cliente conectado');
  socket.on('producto-agregado', (data) => {
    console.log('Producto agregado:', data);
    io.emit('actualizar-carrito', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
