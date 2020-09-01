
const User = require('./domain');
const Postgres = require ('../../../../helpers/databases/postgresql/db');
const config = require('../../../../infra/configs/global_config');
const db = new Postgres(config.get('/postgreConfig'));
const user = new User(db);

const getUserById = async (userId) => {
  const getData = async () => {
    const result = await user.viewUser(userId);
    return result;
  };
  const result = await getData();
  return result;
};
module.exports = {
  getUserById,
};
