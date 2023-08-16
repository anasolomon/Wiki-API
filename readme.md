 - [API Requests](#api-requests)
 
 - [Process](#process)  
   - [GET All Articles](#get-all-articles)
   - [POST a New Article](#post-a-new-article)
   - [DELETE All Articles](#delete-all-articles)  
   - [GET a Specific Article](#get-a-specific-article)
   - [PUT a Specific Article](#put-a-specific-article)
   - [PATCH a Specific Article](#patch-a-specific-article)
   - [DELETE a Specific Article](#delete-a-specific-article)

 - [Learned](#learned)


# API Requests
These are the types of requests you can make to my API and what to expect :  

1. GET request to "/articles" will display all of the existing articles in the database as a JSON
2. POST request to "/articles" with variables title(string) and content(string) will create a new document with you entered properties : 
![](https://media.discordapp.net/attachments/1141016274160328756/1141356766605627422/Screenshot_5.png)
3. DELETE request to "/articles" will delete all of the data in the Database
4. GET requests to a specific article eg. "/articles/Jack%20Bauer" will display the API Document from the Database in a JSON format
5. PUT requests to a specific article eg. "/articles/API" providing values for variables title(string) and content(string) will update the API Document with the entered properties : 
![](https://media.discordapp.net/attachments/1141016274160328756/1141402186421653647/Screenshot_9.png) 
6. PATCH requests to a specific article eg. "/articles/Chuck%20Norris" providing at least one of the two valid variables "title"-"content" will update the Chuck Norris Document with the entered property : 
![](https://media.discordapp.net/attachments/1141016274160328756/1141408796888023130/Screenshot_11.png)
7. DELETE requests to a specific article eg. "/articles/Jack%20Bauer" will delete the Jack Bauer Document from the Database.





# Process
Creating a new Database through the GUI Robo 3T instead of the mongo shell.  
Note: remember that when naming a collection manually you must write it in lowercase and in plural.  
Adding a collection called "articles" and populating it :
![](https://media.discordapp.net/attachments/1141016274160328756/1141328822566928404/Screenshot_2.png)  
Now that we've created our Datanase it's time to set up our server. 
![](https://media.discordapp.net/attachments/1141016274160328756/1141329230177779813/Screenshot_3.png)

Added boiler plate to app.js server.  
It seems even though we already created a database and a collection for it we still need to specify it's Schema in our server side.  

![](https://media.discordapp.net/attachments/1141016274160328756/1141296640980947004/Screenshot_1.png)

## GET All Articles
We can start doing the first Rule from REST which states that upon getting a GET request to /article we should be displaying all of the articles : 
```js
app.get("/articles", function (req, res) {
    Article.find({}, function (err, results) {
        console.log(results);
    });
});
```
Or we could use `res.send(results);` insetad of console logging the result.  
This is what we will see on /results : 
![](https://media.discordapp.net/attachments/1141016274160328756/1141352192821952542/Screenshot_4.png)
You can start to notice that this is very similar to the json format an API would send us back upon a certain request was made.

## POST a New Article
The other REST rule says that if a user makes a post request to /articles then a new article should be created.  
In order to make a POST request without creating a html form we can use Postman to make a POST request towards `localhost:3000/articles` and in the "body" section we can specify pieces of data to be sent in a for-urlencoded way. The key should be equal to the variable names our form items usually have  
```js
app.post("/articles", function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
});
```
![](https://media.discordapp.net/attachments/1141016274160328756/1141356766605627422/Screenshot_5.png)
Output :   
![](https://media.discordapp.net/attachments/1141016274160328756/1141356941931720844/Screenshot_6.png)  

Now that we are sure our code is functional we can go ahead and save this new data into a new Document for our articles table : 
```js
app.post("/articles", function (req, res) {

    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    article.save();

});
```
If we use Postman to create a new POST request to /articles then we will have this new Document saved in our articles table : 
![](https://media.discordapp.net/attachments/1141016274160328756/1141358314928750633/Screenshot_7.png)

## Delete All Articles
The last REST rule in the first row states that when the user sends a Delete request to /articles then all of the articles should be deleted. 
Note: The browser that only make GET requests that is why we are using Postman.  
```js
app.delete("/articles", function (req, res) {
    Article.deleteMany({}, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully deleted all articles.")
        }
    });
});
```
We will use the DELETE request from postman. After hitting send all our articles should be deleted.   
 

## GET a Specific Article
The first rule from REST from the second row states that if a user makes a GET request to a specific route `/articles/jack-beauer` then it should display that one specific article.  
We can achieve this with the Express' dynamic routing :  
```js
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
    });
```
In the code above :
 - Using findOne() method to check if there is a document in the table 'Article' has a title that match the requestedRoute, if it's found then that one document will be passed to `found`
 - If no errors found and there is an article found then `res.send()` the found article
 - Else send No articles found message

Note: a space in URL encoding is represented by a '%20' therefore if we wish to make a request to /articles/Jack-Bauer we can do so with "localhost:3000/articles/Jack%20Bauer" 
![](https://media.discordapp.net/attachments/1141016274160328756/1141388567843708968/Screenshot_8.png)

## PUT a Specific Article
When the user sends a PUT request on a specific route for the /article eg: "/article/jack-bauer" then they should be able to modify a property in the document containing jack-bauer.  
To achieve this I'm going to use the update() mongoose function : 
```js
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
    });
```
In the code above :
 - We use the update() function which will check if there is a document where the title is equal to the requestedRoute value and if yes then it will try to update the title with the req.body.title and the content with req.body.content. The consent for this update only happens if we add in `overwrite: true`  

If now we send a PUT request to our server for eg. to the URL "/articles/Jack%20Bauer" with new values for title and content :  
![](https://media.discordapp.net/attachments/1141016274160328756/1141402186421653647/Screenshot_9.png)   

Then we can check our database and see that the Document where the title was Jack-Bauer now has all of it's values changed : 
![](https://media.discordapp.net/attachments/1141016274160328756/1141402186702655539/Screenshot_10.png)


## PATCH a Specific Article

When a user makes a PATCH request to a specific route, eg: "/articles/Chuck%20Norris" then the user can get to choose what property of a document they wish to update :  
```js
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

    });
```
By the usage of `$set` we could write `$set: {title: req.body.title}` to specifically only change the title in the found document. But by setting it to `req.body` we get access to both "title" and "content" values, so depending on which one the user decides to enter a value for will be changed.  

![](https://media.discordapp.net/attachments/1141016274160328756/1141408796888023130/Screenshot_11.png)
![](https://media.discordapp.net/attachments/1141016274160328756/1141408797156454460/Screenshot_12.png)

## DELETE a Specific Article
```js
.delete(function (req, res) {

        Article.deleteOne({ title: req.params.requestedRoute }, function (err) {
            if(!err){
                res.send("successfully deleted the article");
            }
        });

    });
```

# Learned

### Chained Route Handlers
Our code works but it's a bit redundant, instead of having to specify app.get/post/delete for the same route we can simply use the express [app.route()](https://expressjs.com/en/guide/routing.html) : 
```js
app.route("/articles")
.get()
.post()
.delete();
```