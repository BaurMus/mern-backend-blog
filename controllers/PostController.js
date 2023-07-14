import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
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

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5);

    const tags = posts.map((obj) => obj.tags).flat().slice(0, 5);

    res.json(tags);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тэги"
    });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: "after"
      },
    ).populate('user').then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена"
        });
      }

      res.json(doc);
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Не удалось вернуть статью"
      });
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью"
    });
  }
}

export const create = async (req, res) => {
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