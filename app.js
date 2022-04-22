const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view enigine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////Request Targeting All Articles////////////////////////////////////

//chained route handlers using express
app.route("/articles")

  //GET all articles
  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //POST an articles
  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully send an article.")
      } else {
        res.send(err);
      }
    });
  })

  //DELETE all articles
  .delete(function(req, res){
    Article.deleteMany({}, function(err){
      if(!err){
        res.send("Successfully delete all articles.");
      } else {
        res.send(err);
      }
    });
  });

  ///////////////////////////////Request Targeting a Specific Article /////////////////////////////////

  app.route("/articles/:articleTitle")

    //GET specific article
    .get(function(req, res){
      Article.findOne({title:req.params.articleTitle},function(err, foundArticle){
        if(foundArticle){
          res.send(foundArticle);
        } else {
          res.send("No articles match.")
        }
      })
    })

    //PUT: update specific article, replace entire entry
    .put(function(req, res){
      Article.replaceOne(
        {title: req.params.articleTitle},//condition
        {title: req.body.title, content: req.body.content},//update
        function(err){
          if(!err){
            res.send("Successfully update a article.")
          }
        }
      );
    })

    //PUT: update specific article, replace selectively
    .patch(function(req, res){
      Article.updateOne(
        {title: req.params.articleTitle},//condition
        //update $set operator replaces the value of a field with specified value
        //req.body make user dynamically choose which field to update
        {$set: req.body},
        function(err){
          if(!err){
            res.send("Successfully update a article.");
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
          if(!err){
            res.send("Successfully delete the corresponding article.");
          } else {
            res.send(err);
          }
        }
      );
    });



  // //GET all articles
  // app.get("/articles", function(req, res){
  //   Article.find({}, function(err, foundArticles){
  //     if(!err){
  //       res.send(foundArticles);
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // });
  //
  // //POST an articles
  // //CREATE in db
  // app.post("/articles", function(req, res){
  //   const newArticle = new Article({
  //     title: req.body.title,
  //     content: req.body.content
  //   });
  //   newArticle.save(function(err){
  //     if(!err){
  //       res.send("Successfully send an article.")
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // });
  //
  // //DELETE all articles
  // app.delete("/articles", function(req, res){
  //   Article.deleteMany({}, function(err){
  //     if(!err){
  //       res.send("Successfully delete all articles.");
  //     } else {
  //       res.send(err);
  //     }
  //   });
  // });




app.listen(3000, function(e){
  console.log("Server is running on port 3000");
})
