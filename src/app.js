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
import methodOverride from 'method-override';
import passport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

const app = express();

console.log(app.get('env'))
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));


app.use(session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.mongoUrl
    })
}));

app.use(methodOverride('_method'));
app.use(passport.initialize());


app.use('/api/sessions', sessionsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ticket', ticketRouter);
app.use('/', viewsRouter);
app.use((req, res, next) => {
  res.status(404).render('404', { message: 'Página no encontrada.' }); // O redirige a otra ruta
});


app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
