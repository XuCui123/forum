module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    topicId: DataTypes.INTEGER
  }, {
    tableName: 'tb_reply'
  });
  return Reply;
};