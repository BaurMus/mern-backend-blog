import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import routes from './routes.js';

mongoose
  .connect('mongodb+srv://musilimovb:bake1984@cluster0.rowds20.mongodb.net/blog?retryWrites=true&w=majority')
  // .connect('mongodb+srv://muslim2:4444@cluster0.rowds20.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DataBase OK'))
  .catch((err) => console.log('DataBase Error', err));

const app = express();

app.use(cors());
app.use(routes);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});