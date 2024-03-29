const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config();

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
const watson = require('./middleware/watsonService');

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qs7yd.mongodb.net/${process.env.MONGO_DB}`;
const conn = mongoose.createConnection(mongoURI, {dbName: `${process.env.MONGO_DB}`});
const app = express();

let gfs;

conn.once('open', () => {
  // Init stream for read file from db
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection(`uploads`);
});

// Create storage engine to store file
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
});

// Display single file object
app.get('/file/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    console.log(file);
    if (!file || file.length === 0) {
      console.log(err);
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    const readstream = gfs.createReadStream({
      filename: file.filename
  });
    readstream.pipe(res);
  });
});

app.use(bodyParser.json());

// Allow cross-origin
app.use(cors());

app.use(cookieParser());

app.get('/cookie', (req, res, next) => {
  let response = {};
  response.token = req.cookies.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(response.token, 'somesupersecretkey');
  } catch (err) {
    response.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    response.isAuth = false;
    return next();
  }
  response.isAuth = true;
  response.userId = decodedToken.userId;
  res.json({ response, response });
}); 

app.get('/removeCookie', (req, res, next) => {
  let response = {}
  try {
    res.clearCookie('token');
    res.clearCookie('sessionId');
    response = { message: 'Cookie monster ate your cookie!' };
  } catch (err) {
    console.log(err);
    return next();
  }
  res.json({ response, response });
}); 

app.post('/watson', async (req, res) => {
    let response = await watson.getResponse(req, res);
    res.json({ response, response });
  }); 

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8000;

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qs7yd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
).then(() => {
  console.log("Connected to db!");
  app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
}).catch(err => {
  console.log(err);
});
