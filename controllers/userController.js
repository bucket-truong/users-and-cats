const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cat = require('../models/Cat');

router.get('/', (req, res)=>{
  //finding all user from the database
    User.find({}, (err, usersFromTheDatabase)=>{
      //displaying all the users to the index
        res.render('users/index.ejs', {
            usersOnTheTemplate: usersFromTheDatabase
        })
    })
})

router.get('/new', (req, res)=>{
    res.render('users/new.ejs');
})

router.get('/:id', (req, res)=>{
  //finding a user by id
    User.findById(req.params.id)
    //populating the cats path
    .populate('cats')
    //executes
    .exec((err, userFromTheDatabase)=>{
        if(err){
            res.send(err);
        } else {
          //displays to the users show page
            res.render('users/show.ejs', {
                userOnTheTemplate: userFromTheDatabase
            });
        }

    })
})

router.get('/:id/edit', (req, res)=>{
  //finding a user by id
    User.findById(req.params.id, (err, userFromTheDatabase)=>{
      //displays the edited user to the user edit page
        res.render('users/edit.ejs', {
            userOnTheTemplate: userFromTheDatabase
        })
    })
})

router.post('/', (req, res)=>{
  //creating a new user
    User.create(req.body, (err, newlyCreatedUser)=>{
        console.log(newlyCreatedUser)
        //redirecting to the user path
        res.redirect('/users')
    })
})

router.put('/:id', (req, res)=>{
  //find a user by id from db and updating
    User.findByIdAndUpdate(req.params.id, req.body, (err, userFromTheDatabase)=>{
        console.log(userFromTheDatabase);
        //redirecting to to the users path
        res.redirect('/users');
    })
})

router.delete('/:id', (req, res)=>{
  //finding a user by id and deleting user
    User.findByIdAndDelete(req.params.id, (err, userFromTheDatabase)=>{
        console.log(userFromTheDatabase);
        //deleting the cat assigned to user
        Cat.deleteMany({
            _id: {
                $in: userFromTheDatabase.cats
            }
        }, (err, data)=>{
            console.log(data);
            //redirecting to users path
            res.redirect('/users');
        })
    })
})

module.exports = router;
