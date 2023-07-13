import express from 'express';
import mongoose from 'mongoose';
import {UserController} from './controllers/index.js';
import { registerValidation } from './validations.js';
import {handleValidationErrors} from './utils/index.js';

mongoose
  .connect('mongodb+srv://musilimovb:bake1984@cluster0.rowds20.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DataBase OK'))
  .catch((err) => console.log('DataBase Error', err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});