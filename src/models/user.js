import { createHash } from 'crypto';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING
  }, {
    tableName: 'tb_user'
  });
  User.auth = async ({ username, password }) => {
    const md5 = createHash('md5');
    const hash = md5.update(password).digest('hex');
    return await User.findOne({
      attributes: { exclude: ['password'] },
      where: { username, password: hash }
    });
  };
  User.register = async ({ username, password, nickname }) => {
    const md5 = createHash('md5');
    const hash = md5.update(password).digest('hex');
    return await User.create({
      username,
      nickname,
      password: hash
    });
  }
  return User;
};