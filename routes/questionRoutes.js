const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');

router.get('/', (req,res) => {
    res.redirect(301,'/');
})

router.get('/add', (req,res) => {
    res.render('questions/add.ejs', { title: 'Add Question' });
})

router.post('/', (req,res) => {
    req.body.topic = req.body.topic.toLowerCase();

    const question = new Question(req.body);

    question.save()
    .then((result) => res.redirect('/'))
    .catch((error) => console.log(error));
})

router.get('/:topic', async (req,res) => {
    let count = 0;
    try {
        count = await Question.countDocuments({topic : req.params.topic});
        // console.log("Total Number of Documents:", count);
    } catch (error) {
        console.error(error);
    }

    Question.find({topic: req.params.topic})
    .then((result) =>  {
        if(result){
            res.render('questions/single_topic_questions.ejs', { title: req.params.topic, count:count, questions: result }) 
        }else{
            res.render('404.ejs', {title : '404 error' });
        }
    })
    .catch((error) => console.log(error));
});

router.get('/:topic/:id', (req,res) => {
    Question.findById(req.params.id)
    .then((result) => {
        if(result){
            res.render('questions/details.ejs', { title: 'details', question: result})
        }else{
            res.render('404.ejs', {title:'404 error'})
        }
    })
    .catch((error) => {
        console.log(error)
        res.render('404.ejs', {title:'404 error'});
    });
})

router.delete('/:topic/:id', (req,res) => {
    const topic = req.params.topic;
    const id = req.params.id;

    Question.findByIdAndDelete(id)
    .then((result) => {
        if(result){
            res.json({redirect : `/questions/${topic}`});
        }
    })
    .catch((error) => {
        res.render('404.ejs', {title : '404 error'});
        console.log(error);
    });
})

router.get('/:topic/:id/update', (req,res) => {
    const id = req.params.id;
    
    Question.findById(id)
    .then((result) => {
        if(result){
            res.render('questions/update_form.ejs', { title: 'details', question: result})
        }else{
            res.render('404.ejs', {title:'404 error'})
        }
    })
    .catch((error) => {
        console.log(error)
        res.render('404.ejs', {title:'404 error'});
    });
})

router.put('/:topic/:id', (req, res) => {
    req.body.topic = req.body.topic.toLowerCase();
    
    const id = req.params.id;
    console.log(req.body);
    Question.findByIdAndUpdate(id, req.body, { new: true })
        .then((updated) => {
            if (updated) {
                res.json({ redirect: `/questions/${updated.topic}/${updated._id}` });
            } else {
                res.status(404).json({ error: 'Question not found' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        });
});

module.exports = router;