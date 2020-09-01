
const Article = require('./domain');
const Postgres = require ('../../../../helpers/databases/postgresql/db');
const config = require('../../../../infra/configs/global_config');
const db = new Postgres(config.get('/postgreConfig'));
const article = new Article(db);

const createArticle = async (payload) => {
  const postCommand = async payload => article.createArticle(payload);
  return postCommand(payload);
};

const editArticle = async (payload) => {
  const postCommand = async payload => article.editArticle(payload);
  return postCommand(payload);
};

const deleteArticle = async (payload) => {
  const postCommand = async payload => article.deleteArticle(payload);
  return postCommand(payload);
};


module.exports = {
  createArticle,
  editArticle,
  deleteArticle
};
