const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { requireAuth } = require('./middleware/authMiddleware');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');

  // Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  




//require config.mongodb
require('./config/config.mongo.js')

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//config dotenv
dotenv.config();

const port = 4001;
const morgan = require('morgan');
const passport = require('passport');


app.use(morgan('dev'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//ejs view engine
app.set('view engine', 'ejs');

// set views folder
app.set('views', './views');




//passport middleware
//app.use(passport.initialize());
//app.use(passport.session());

//passport config
//require('./config/passport')(passport);

//connect to db
//const db = require('./config/db');  

//routes
//app.get('', checkUser);
app.use('/', require('./routes/index'));
app.use(authRoutes);

//upoad route
app.post('/designs', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('designs', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('designs', {
            msg: 'Error: No File Selected!'
          });
        } else {
          res.render('designs', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });




//show home page
app.get('/', function (req, res) {
    res.render('home');
});

//show header page
app.get('/header', function (req, res) {
    res.render('header');
});

//show designs page
app.get('/designs', requireAuth, (req, res) => res.render('designs'));

//show contact
app.get('/contact', function (req,res) {
  res.render('contact');
});

app.get('/about', function (req,res) {
  res.render('about');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;