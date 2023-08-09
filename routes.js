import express from 'express';
import multer from 'multer';

import {PostController, UserController} from './controllers/index.js';
import { loginValidation, postCreateValidation, registerValidation } from './validations.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file ,cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage});

router.use(express.json());
router.use('/uploads', express.static('uploads'));

//Auth routes
router.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
router.post('/auth/login',loginValidation, handleValidationErrors, UserController.login);
router.get('/auth/me', checkAuth, UserController.getMe);

//Post routes
router.get('/posts', PostController.getAll);
router.get('/posts/popular', PostController.getAllPopular);
router.get('/tags', PostController.getLastTags);
router.get('/posts/:id', PostController.getOne);
router.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
router.delete('/posts/:id', checkAuth, PostController.remove);
router.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
router.patch('/comment/:id', checkAuth, PostController.addComment);

//Upload route
router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

export default router; 

