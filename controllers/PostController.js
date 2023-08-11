import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    let posts = await PostModel.find().populate('user');

    posts.map((obj) => obj.user.passwordHash = "_");

    posts = posts.reverse(); 

    res.json(posts);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи"
    });
  }
}

export const getAllPopular = async (req, res) => {
  try {
    let posts = await PostModel.find().populate('user');

    posts.map((obj) => obj.user.passwordHash = "");

    posts = posts.sort((a, b) => b.viewsCount - a.viewsCount);

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

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId
      }
    ).then(doc => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена"
        });
      }

      res.json({
        success: true
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось удалить статью'
      });
    })
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Ошибка при удалении статьи"
    });
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId
    },{
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      tags: req.body.tags.split(',')
    });

    res.json({
      success: true
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью"
    });
  }
}

export const addComment = async (req, res) => {
  try{
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId
    }, {
      $push:{ 
        comments: {
          name: req.body.name,
          comment: req.body.comment,
          userImageUrl: req.body.userImageUrl
        }
      }
    }).then(() => {
      res
        .status(201)
        .json({
          message: "Комментарий успешно добавлен"
        });
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить комментарий'
    });
  }
}