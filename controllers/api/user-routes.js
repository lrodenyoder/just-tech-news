const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//get /api/users
router.get('/', (req, res) => { 
    //access our User model and run .findAll() method. one of the Model class's that User inherits (equal to `SELECT * FROM users` SQL query)
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

//get /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: req.params.id }, //equal to `SELECT * FROM users WHERE id = 1`
      include: [
        {
          model: Post,
          attributes: ["id", "title", "post_url", "created_at"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_text", "created_at"],
          include: {
            model: Post,
            attributes: ["title"],
          },
        },
        {
          model: Post,
          attributes: ["title"],
          through: Vote,
          as: "voted_posts",
        },
      ],
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
 });

//post /api/users
router.post('/', withAuth, (req, res) => {
    //expects {username: 'username', email: 'email', password: 'password'}
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
      .then((dbUserData) => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;

          res.json(dbUserData);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
});
 
//POST is used for login because the request parameter is carried in req.body rather than the URL string with GET (password would be attached to URL as plaintext)
router.post('/login', withAuth, (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with that email address' });
                return;
            }

            //verify user
            //use user object method to compare plaintext to hashed password
            const validPassword = dbUserData.checkPassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({ message: 'Password Incorrect' });
                return;
            }

            req.session.save(() => {
              // declare session variables
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;

              res.json({ user: dbUserData, message: "You are now logged in!" });
            })
    })
});

//put /api/users/1
router.put('/:id', withAuth, (req, res) => {
  //expects {username: 'username', email: 'email', password: 'password'}
  //if req.body has exact key/value pairs to match model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
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
router.delete('/:id', withAuth, (req, res) => {
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
