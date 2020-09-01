const joi = require('joi');

const createArticle = joi.object({
  article_name: joi.string().required(),
  creator: joi.string().required(),
});

const editArticle = joi.object({
  id: joi.string().required(),
  article_name: joi.string().required(),
  creator: joi.string().required(),
});

module.exports = {
  createArticle,
  editArticle
};
