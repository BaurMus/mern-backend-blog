import PostModel from '../models/Post.js';

export const getAll = async(req, res) => {
  try {
    const posts = await PostModel.find().populate('user');

    posts.map((obj) => obj.user.passwordHash = "");

    res.json(posts);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи"
    });
   }
}

export const create = async(req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(','),
      imageUrl: req.body.imageUrl,
      user: req.userId
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.json({
      message: "Не удалось создать статью"
    });
  }
}