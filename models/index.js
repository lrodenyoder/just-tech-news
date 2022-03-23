const User = require('./User');
const Post = require("./Post");
const Vote = require('./Vote');

//create associations to link primary key to foreign key
User.hasMany(Post, {
  foreignKey: "user_id",
});

//reverse association
Post.belongsTo(User, {
  foreignKey: "user_id",
});

//connects the User and Post models though the Vote model and allows them to query each others info in the context of a vote
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: "user_id"
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'votes_posts',
  foreignKey: "post_id"
});

Vote.belongsTo(User, {
  foreignKey: "user_id"
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Post, {
  foreignKey: "user_id"
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };