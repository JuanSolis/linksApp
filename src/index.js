const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');

// initializations 
var app = express();
require('./lib/passport.js');


//settings 
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers:require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
//MiddleWares
app.use(session({
    secret: 'juansolissession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());

//Global variables 
app.use((request,response, next) => {
    app.locals.success = request.flash('success');
    app.locals.message = request.flash('message');
    app.locals.user = request.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
//Publics
app.use(express.static(path.join(__dirname,'public')));
//Starting the server
app.listen(app.get('port'), () =>{
    console.log(`Serve on port ${app.get('port')}`);
});