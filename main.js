var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");

var db = mongojs("mongodb://user:Password1@ds251022.mlab.com:51022/customerapp",["users"])
var app = express();

/** middlewares in node are placed before the routes (get).
 *  example is this custom middleware below
 */
// var logger = (req, res, next) => {
//     console.log("logging...");
//     next();
// }
// app.use(logger);

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**body-parser middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**set static path */
app.use(express.static(path.join(__dirname, "public")));

//Global vars
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
})

//express validator middleware
app.use(expressValidator());

app.get("/", function(req, res) {
    db.users.find((err, docs) => {
        console.log("root called!");
        console.log(docs);
        res.render("index", {
            title: "customers",
            users: docs
        });
    });
});

app.post("/users/add", (req, res) => {
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        db.users.find((err, docs) => {
            console.log("find called!");
            res.render(
                "index", {
                title: "customers",
                users: docs,
                errors: errors
            });
        });
    } else {
        var newUser = {
            name: req.body.name,
            email: req.body.email
        };
        db.users.insert(newUser, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
        console.log("success!");
    }
});

app.delete("/users/delete/:id", (req, res) => {
    console.log("called for ", req.params.id);
    db.users.remove({"_id": db.ObjectId(req.params.id)}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("looks like everything worked!");
            res.sendStatus(200);
        }
    });
});

app.listen(3000, function() {
    console.log("server started on port 3000...");
});