//jshint esversion: 8

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//to link public/css files
app.use(express.static(__dirname + "/public"));

//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

//create a SCHEMA that sets out the fields each document will have and their datatypes
const articleSchema = new mongoose.Schema ({
	title: String,
	content: String
});

//create a MODEL
const Article = new mongoose.model ("Article", articleSchema);

//////////////////////// Requests Targetting All Articles ////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if (!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  const articleTitle = req.body.title;
  const articleContent = req.body.content;
  //create a DOCUMENT
  const article = new Article ({
  	title: articleTitle,
  	content: articleContent
  });
  //save the document
  article.save(function(err){
    if (!err){
      res.send("successfully added a new article");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

//////////////////////// Requests Targetting A Specific Article ////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){


  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else{
      res.send("This article does not exist");
    }
  });
})

.put(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},  //condition(article) to be updated
    {title: req.body.title, content: req.body.content},  //new updated info
    {overwrite: true},   //overwite conditon must be included
    function(err){
      if (!err){
        res.send("Successfully updated article");
      } else{
        send(err);
      }
    }
  );
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function (err){
      if (!err){
        res.send("Successfully updated article");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted article");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("server started on port 3000");
});
