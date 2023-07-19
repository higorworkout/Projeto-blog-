const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var session = require('express-session');
// connection database
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticleController')
const UsersController = require('./users/UsersController')

const Article = require('./articles/Articles');
const Category = require('./categories/Category');
const User = require("./users/User")

// View engine
app.set('view engine', 'ejs');

// Redis

// Sessions
app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 3000000}
}))

// Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((err) => {
        console.log(err)
    });


// Controllers 
app.use("/", categoriesController);
app.use('/', articlesController);
app.use("/", UsersController);

// EndPoints

app.get("/session", (req, res) => {
    req.session.treinamento = "Formação node js"
    req.session.ano = 2010
    req.session.email = "higor@udemy.com"
    req.session.user = {
        username: "higor soares",
        email: "higor@udemy.com",
        id: 10
    }
    res.send("Sessão gerada!");
});

app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user,
    })
});

app.get("/", (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});     
        });
    });
})

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories}); 
            })
        }else {
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {
                    articles: category.articles,
                    categories: categories
                })
            });
        }else {
            res.redirect("/");
        }
    }).catch( err => res.redirect("/"))
})


app.listen(8080, (req, res) => {
    console.log("O servidor está rodando!")
})