const express = require('express');
const mongoose = require('mongoose');
const Question = require('./models/question.js');
const questionRoutes = require('./routes/questionRoutes.js');

const app = express();

app.set('view engine','ejs');
app.set('views','views');

// Enter username and password below
const dbUri = "mongodb+srv://<Username>:<password>@node-practice.nyxbhhf.mongodb.net/";
mongoose.connect(dbUri)
.then((result) => app.listen(3000))
.catch((error) => console.log(error));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for JSON requests (application/json)

app.get('/', async (req,res) => {

    let count = 0;
    try {
        count = await Question.countDocuments();
        // console.log("Total Number of Documents:", count);
    } catch (error) {
        console.error(error);
    }

    Question.aggregate([
        { $group: { _id: "$topic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } } // Sorts by topic name (ascending)
    ])
    .then((result) => res.render('index.ejs', { title: 'Home', count: count, topics: result  }))
    .catch((error) => console.log(error));
})

app.get('/about', (req,res) => {
    res.render('about.ejs', { title: 'About' });
})

// question routes
app.use('/questions',questionRoutes);

// 404 error
app.use((req,res) => {
    res.status(404).render('404.ejs', { title: '404 Error' });
})