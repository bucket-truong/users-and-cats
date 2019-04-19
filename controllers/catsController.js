const express = require('express');
const router = express.Router();
const Cat = require('../models/Cat');
const User = require('../models/User');

router.get('/', (req, res)=>{
  //find all of the cats from the db
    Cat.find({}, (err, catsFromTheDatabase)=>{
      //render the index page from cats folder
        res.render('cats/index.ejs', {
          //send the catsFromTheDatabase under the name
            catsOnTheTemplate: catsFromTheDatabase
        })
    })
})
//
router.get('/new', (req, res)=>{
  //find all users
    User.find({}, (error, allUsers) => {
        if(error) {
            res.send(error)
        } else {
          //display all the users to the new page
            res.render('cats/new.ejs', {
                usersOnTemplate: allUsers
            })
        }
    })

})

router.get('/:id', (req, res) => {
  //finding an id of a cat from the data base
    Cat.findById(req.params.id, (err, catFromTheDatabase) => {
      //finding the user that that has the the specific cat id
      User.findOne({
        //setting the a variable for req.params.id
        "cats": req.params.id
      }, (err, user) => {
        //showing both the, cat and the user in the show page
        res.render('cats/show.ejs', {
          catOnTheTemplate: catFromTheDatabase,
          user: user
        });
      })
    })
   })
//editing the users and cats
router.get('/:id/edit', (req, res)=>{
  //finding the id of the cat from the data base
    Cat.findById(req.params.id, (err, catFromTheDatabase)=>{
      //finding the user with no cat from the data base
        User.find({}, (err, usersFromTheDatabase)=>{
          //displaying the edited users and cats
            res.render('cats/edit.ejs', {
                catOnTheTemplate: catFromTheDatabase,
                usersOnTemplate: usersFromTheDatabase
            });
        })

    })
})

//posting to the root
router.post('/', (req, res)=>{
    console.log(req.body);
    //creating a cat
    Cat.create(req.body, (err, newlyCreatedCat)=>{
      //testing to the create route
        console.log(`Created a cat for user ${req.body.userId}`);
        //finding a user by id
        User.findById(req.body.userId, function(err, userFound)
        {
          //assigning the created cat to user by
            userFound.cats.push(newlyCreatedCat._id);
            //saving both the user and the new cat that was assigned
            userFound.save((err, savedUser)=>{
                console.log(savedUser);
                //redirecting back to the cats view
                res.redirect('/cats')
            });
        });

    })
})

router.put('/:id', (req, res)=>{
    console.log(req.body);
    //finding the cat by id and updating
    Cat.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedCat)=>{
      //finding the user the cat is attatched to
      User.findOne({'cats': req.params.id}, (err, foundUser) => {
        //taking the found user
        if(foundUser._id.toString() !== req.body.userId){
          //taking out the current cat that the user owns
          foundUser.cats.remove(req.params.id);
          //saving the user's current after removing
          foundUser.save((err, savedFoundUser) => {
            //finding another user by id
            User.findById(req.body.userId, (err, newUser) => {
              //taking that new user and update the cate to the new users
              newUser.cats.push(updatedCat._id);
              //saving the new user and updated cat
              newUser.save((err, savedNewUser) => {
                //redirecting to the cats view
                res.redirect('/cats/' + req.params.id);
              })
            })
          })
        } else {
          res.redirect('/cats/' + req.params.id)
        }
      })
    });
  });

router.delete('/:id', (req, res)=>{
  //finding a cat by id from the data base
    Cat.findByIdAndDelete(req.params.id, (err, catFromTheDatabase)=>{
      //checking to see if the cat was found
        console.log(catFromTheDatabase);
        //finding the user from the cat id
        User.findOne({'cats': req.params.id}, (err, foundUser)=>{
            if(err){
                console.log(err)
            }else{
                console.log(foundUser);
                //removing the cat from the user that was found
                foundUser.cats.remove(req.params.id);
                //saving the updated user
                foundUser.save((err, updatedUser)=>{
                    console.log(updatedUser);
                    //redirect to the cat view
                    res.redirect('/cats');
                })
            };
        });
    });
});

module.exports = router;
