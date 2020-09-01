
const User = require('./domain');
const Postgres = require ('../../../../helpers/databases/postgresql/db');
const config = require('../../../../infra/configs/global_config');
const db = new Postgres(config.get('/postgreConfig'));
const user = new User(db);

const postDataLogin = async (payload) => {
  const postCommand = async payload => user.generateCredential(payload);
  return postCommand(payload);
};

const registerUser = async (payload) => {
  const postCommand = async payload => user.register(payload);
  return postCommand(payload);
};

const updateUser = async (payload) => {
  const postCommand = async payload => user.updateUser(payload);
  return postCommand(payload);
};


module.exports = {
  postDataLogin,
  registerUser,
  updateUser
};
