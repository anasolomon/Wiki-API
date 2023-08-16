const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-ana:test123@cluster0.anmrdwa.mongodb.net/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////// Requests Targetting All Articles ////////////////////////////////////////////////////////////
app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, results) {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        });
    })
    .post(function (req, res) {

        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added a new article.");
            }
        });

    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all articles.")
            }
        });
    });


//////////////////////////////////////////// Requests Targetting A Specific Article ////////////////////////////////////////////////////////////
app.route("/articles/:requestedRoute")
    .get(function (req, res) {
        Article.findOne({ title: req.params.requestedRoute }, function (err, found) {
            if (err) {
                res.send(err);
            } else {
                if (found) {
                    res.send(found);
                }
                else {
                    res.send("No article matching that title were was found.");
                }
            }
        });
    })

    .put(function (req, res) {
        Article.update(
            { title: req.params.requestedRoute },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err, result) {
                if (!err) {
                    res.send("successfully updated article")
                }
            }
        )
    })

    .patch(function (req, res) {

        Article.update(
            { title: req.params.requestedRoute },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("successfully updated article");
                }
            }
        )

    })

    .delete(function (req, res) {

        Article.deleteOne({ title: req.params.requestedRoute }, function (err) {
            if(!err){
                res.send("successfully deleted the article");
            }
        });

    });



app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});