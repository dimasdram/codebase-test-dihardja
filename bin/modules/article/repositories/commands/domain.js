
const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const {ConflictError,NotFoundError} = require('../../../../helpers/error');
const constant = require('../../../../infra/configs/constant');
const uuid = require('uuid');

class Article {

  constructor(db){
    this.command = new Command(db);
    this.query = new Query(db);
  }

  async createArticle(payload) {
    const { article_name, creator} = payload;
    const tblArticle = constant.tblArticle;
    const returningTblArticle =  constant.fieldTblArticles;
    const data = {
      id: uuid().toString(),
      article_name,
      creator,
    };
    const addData = await this.command.addData(tblArticle, data, returningTblArticle);
    if (addData.err == 'fail'){
      return wrapper.error(new ConflictError('Server cant Add Article'));
    }
    const result = addData.data;
    return wrapper.data(result);
  }
  async editArticle(payload) {
    const {id, article_name, creator} = payload;
    const tblArticle = constant.tblArticle;
    const returningTblArticle =  constant.fieldTblArticles;
    const data = {
      article_name,
      creator,
    };
    const addData = await this.command.updateData(tblArticle, data,{id:id}, returningTblArticle);
    if (addData.err == 'fail'){
      return wrapper.error(new ConflictError('Server cant Update Article'));
    }
    data.id = id;
    return wrapper.data(data);
  }
  async deleteArticle(payload) {
    const {articleId} = payload;
    const tblArticle = constant.tblArticle;
    const returningTblArticle =  constant.fieldTblArticles;
    const article = await this.query.getDataByFilter(tblArticle, returningTblArticle, {id : articleId});
    if (article.length == 0) {
      return wrapper.error(new NotFoundError('Can not find article'));
    }
    const addData = await this.command.deleteData(tblArticle, {id:articleId}, returningTblArticle);
    if (addData.err == 'fail'){
      return wrapper.error(new ConflictError('Server cant delete Article'));
    }
    return wrapper.data(article);
  }

}




module.exports = Article;
