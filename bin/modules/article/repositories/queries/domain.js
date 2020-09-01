
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError } = require('../../../../helpers/error');
const constant = require('../../../../infra/configs/constant');


class Article {

  constructor(db){
    this.query = new Query(db);
  }

  async getArticleById(articleId) {
    const tblArticle = constant.tblArticle;
    const returningTblArticle =  constant.fieldTblArticles;
    const article = await this.query.getDataByFilter(tblArticle, returningTblArticle, {id : articleId});
    if (article.length == 0) {
      return wrapper.error(new NotFoundError('Can not find article'));
    }
    return wrapper.data(article);
  }

}

module.exports = Article;
