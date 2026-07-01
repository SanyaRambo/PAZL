const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const corsOptions = {
  origin:  ["http://localhost:5173"],
  credentials: true
};
const optionalAuth = require('./middlewares/optionalAuth');

const port = 3001
const app = express()



app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())
app.use(optionalAuth);




app.use(express.static(path.resolve(__dirname, '../frontend-pazl/dist')))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use((req, res, next) => {
  
  if (req.path.startsWith('/api')) {
    
    req.url = req.url.slice(4); 
    
  }
  next();
});


app.use('/', routes)

mongoose
  .connect(
    "mongodb://aleksandr:pazlpass@localhost:27017/pazldb?authSource=admin",
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  });