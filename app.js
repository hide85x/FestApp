const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
const logger = require('morgan');
const fs = require('fs');
const cors= require("cors")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');
require('./config/passport')(passport)

const userRouter = require('./routes/user')
const festRouter= require('./routes/fest');
const app = express();

app.use(cors())
// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

const logStream = fs.createWriteStream(path.join(__dirname, "logger.log"), { flags: 'a' })
app.use(logger('combined', { stream: logStream }));
// app.use(cookieParser()); bez tego tez mamy uzykownika w req.user
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session()) // musi byc po app.use(session)
app.use(flash())
//global variables
app.use(function (req, res, next) {   // w kazdym widoku mozemy używać teraz propsa success_msg i error_msg i error
  res.locals.success_msg = req.flash('success_msg'); // potem w controllerze pisze req.flas('succes_msg', "tresc wiadomosci")
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//our routes
app.get('/', (req, res, next) => {
  console.log(` our req user : ${req.user}`)
  if (req.user) {
    console.log(`weve got logged user ${req.user.email || req.user.name}`)
  } else {
    console.log(`nobody is logged in`)
  }
  res.render('index/welcome');
})

app.use('/fest', festRouter);
app.use('/user', userRouter);
app.use('/user/login',passport.authenticate('local', { 
  failureRedirect: '/user/login',
  successRedirect:'/'

}))
app.use('/auth/facebook', passport.authenticate('facebook'));
app.use('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: "/",

}))

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use((error, req, res, next) => { // to jest nasz expressowy error handler, zbiera errory z controllerow i je obsluguje
  console.log(error)              // i puszcza je do klienta na frontend
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data })
}); // objekt res to także writablestream, mozemy pipe, np readeblestream.pipe(res)


const port = process.env.PORT || 5000



app.listen(port, ()=> {
  console.log(`connected on port ${port}`)
  mongoose.Promise = global.Promise;

  mongoose.connect('mongodb+srv://hide:hide85x@cluster0-chy7b.mongodb.net/FestApp',
  { useNewUrlParser: true })
  .then(() => console.log('connected to mongo!'))
  
  .catch(err => console.log(err))
})