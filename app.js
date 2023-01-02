const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1:27017/apiDb');
}

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (err) {
                console.log(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function (req, res) {
        const title = _.capitalize(req.body.title);
        const content = req.body.content;
        const article = new Article({
            title: title,
            content: content
        });
        article.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send("Successfully added into the database");
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send("All entries are deleted");
            }

        })
    });
// For a particular article 
app.route("/articles/:userArticle")
    .get(function (req, res) {
        const userArticle = req.params.userArticle;
        Article.findOne({ title: userArticle }, function (err, foundArticle) {
            if (err) {
                console.log(err);
            } else {
                res.send(foundArticle);
            }
        })
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.userArticle },
            { title: _.capitalize(req.body.title), content: req.body.content },
            { new: true },
            function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Successfully Updated");
                }
            }
        )
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.userArticle },
            { $set: req.body },
            function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Successfully updated given parameter");
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.userArticle }, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send("Successfully deleted " + req.params.userArticle)
            }
        })
    })
app.listen(port, function () {
    console.log("Server is running on port " + port);
})