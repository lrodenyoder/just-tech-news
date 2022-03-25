const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

//create Post model
class Post extends Model {
  //Here, we're using JavaScript's built-in static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method like we used earlier with the User model.
  static upvote(body, models) {
     return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
  }


//create field/columns for Post model
// Post.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     post_url: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         isURL: true,
//       },
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       //references property creates a relationship between Post and User models, specifically to the primary key (id in this case) in the User model. user_id is defined as the foreign key and will match the primary key of the referenced model
//       references: {
//         model: "user",
//         key: "id",
//       },
//     },
//   },
//   //configure the metadata
//   {
//     sequelize,
//     freezeTableName: true,
//     //naming convention to_be_like_this rather than camelCase
//     underscored: true,
//     modelName: "post",
//   }
// );

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
