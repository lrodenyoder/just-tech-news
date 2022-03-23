const router = require("express").Router();
const { Post, User, Vote } = require("../../models");
const sequelize = require("../../config/connection");

router.get("/", (req, res) => {
  Post.findAll({
      attributes: ["id", "post_url", "title", "created_at"],
      order: [['created_at', 'DESC']],
    //include property is an array of objects and stands in for JOIN
    include: [
      {
        model: User,
        attributes: ["username"]
      }
    ]
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["id", "post_url", "title", "created_at"],
        include: [
            {
                model: User,
                attributes: ["username"],
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id.' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

//put before /:id PUT route, otherwise Express will think 'upvote' is a valid parameter for /:id
router.put('/upvote', (req, res) => {
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
        .then(() => {
            //then find the post that was just voted on
            return Post.findOne({
              where: {
                id: req.body.post_id,
              },
              attributes: [
                "id",
                "post_url",
                "title",
                "created_at",
                // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
                [
                  sequelize.literal(
                    "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
                  ),
                  "vote_count",
                ]
              ]
            });
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
    })
});

router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title,
        },
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

module.exports = router;