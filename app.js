//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = `I made this blog (realy, part of it backend) for educational purpose. You can also add somthing here :)`;
const aboutContent = `I'm Alena and I'm student web developer. But also, I'm musician, traveller and potato lover (that's becasuse I'm belarusian, obviously)`;
const contactContent = `You can contact with me via email exultantislupus@gmail.com or Telegram @exultantislupus`;

const app = express();
const uri = process.env.MONGODB_SECRET_URI;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`${uri}/blogDB`, { serverSelectionTimeoutMS: 5000 });
}

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = new mongoose.model('Post', postSchema);

app.get('/', async function (req, res) {
  const posts = await Post.find({});
  res.render('home', {
    startingContent: homeStartingContent,
    posts: posts,
  });
});

app.get('/about', function (req, res) {
  res.render('about', { aboutContent: aboutContent });
});

app.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent });
});

app.get('/compose', function (req, res) {
  res.render('compose');
});

app.post('/compose', async function (req, res) {
  const postTitle = req.body.postTitle;
  const postContent = req.body.postContent;

  if (postTitle && postContent) {
    const post = new Post({
      title: postTitle,
      content: postContent,
    });
    await post.save();
  }
  res.redirect('/');
});

app.get('/posts/:postID', async function (req, res) {
  const requestedID = req.params.postID;
  const foundPost = await Post.findOne({ _id: requestedID });

  if (foundPost) {
    res.render('post', {
      title: foundPost.title,
      content: foundPost.content,
    });
  }
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
