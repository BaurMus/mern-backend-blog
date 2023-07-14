import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import {PostController, UserController} from './controllers/index.js';
import { loginValidation, postCreateValidation, registerValidation } from './validations.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';

mongoose
  .connect('mongodb+srv://musilimovb:bake1984@cluster0.rowds20.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DataBase OK'))
  .catch((err) => console.log('DataBase Error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (req, file ,cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login',loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});