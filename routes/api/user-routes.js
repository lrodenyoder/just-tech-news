const router = require('express').Router();
const { User } = require('../../models');

//get /api/users
router.get('/', (req, res) => { 
    //access our User model and run .findAll() method. one of the Model class's that User inherits (equal to `SELECT * FROM users` SQL query)
    User.findAll()
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

//get /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        where: { id: req.params.id } //equal to `SELECT * FROM users WHERE id = 1`
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
 });

//post /api/users
router.post('/', (req, res) => {
    //expects {username: 'username', email: 'email', password: 'password'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
 });

//put /api/users/1
router.put('/:id', (req, res) => {
  //expects {username: 'username', email: 'email', password: 'password'}
  //if req.body has exact key/value pairs to match model, you can just use `req.body` instead
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: { id: req.params.id }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
 });

module.exports = router;