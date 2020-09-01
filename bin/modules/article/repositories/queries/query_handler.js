
const Article = require('./domain');
const Postgres = require ('../../../../helpers/databases/postgresql/db');
const config = require('../../../../infra/configs/global_config');
const db = new Postgres(config.get('/postgreConfig'));
const article = new Article(db);

const getArticleById = async (articleId) => {
  const getData = async () => {
    const result = await article.getArticleById(articleId);
    return result;
  };
  const result = await getData();
  return result;
};

module.exports = {
  getArticleById
};
