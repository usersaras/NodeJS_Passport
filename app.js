const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const IndexRouter = require('./routes/indexRoute')
const UsersRouter = require('./routes/usersRoute')

const Users = require('./models/usersModel');

const app = express();

//Passport Config
require('./config/passport')(passport);

const dbURL = 'mongodb+srv://nodenetninja:nodenetninja@netninjablog.rfjoy.mongodb.net/learn-passport?retryWrites=true&w=majority'

const connectMongoose = async() => {
    try{
        const connection = await mongoose.connect(dbURL)
        const db = await connection;
        console.log("Connected to DB")
    
        app.listen(PORT, ()=>{
            console.log(`Listening on port ${PORT}`); 
        })
    }
    catch(e){
        res.send(e);
    }
}
connectMongoose();

app.use(expressLayouts)
app.set('view engine', 'ejs')

app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

//Express session middleware
app.use(session({
    secret: 'pssst',
    resave: true,
    saveUninitialized: true,
  }))

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars in middleware
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

const PORT = process.env.PORT || 5050;

app.use('/', IndexRouter);
app.use('/users', UsersRouter);

