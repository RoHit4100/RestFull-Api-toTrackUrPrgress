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
        const title = req.body.title;
        const content = req.body.content;
        const article = new Article({
            title: title,
            content: content
        });
        article.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully added into the database");
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("all entries are deleted");
            }

        })
    })

app.listen(port, function () {
    console.log("Server is running on port " + port);
})