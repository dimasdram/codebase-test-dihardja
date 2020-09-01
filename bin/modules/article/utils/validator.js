const joi = require('joi');
const validate = require('validate.js');
const wrapper = require('../../../helpers/utils/wrapper');

const isValidPayload = (payload, constraint) => {
  const { value, error } = joi.validate(payload, constraint);
  if(!validate.isEmpty(error)){
    return wrapper.error('fail', error, 409);
  }
  return wrapper.data(value, 'success', 200);

};

const createArticle = (payload) => {
  let response = {};
  let temp = [];
  if (!payload) {
    temp = ['article_name', 'creator'];
  } else {
    if (!payload.article_name) { temp.push('article_name'); }
    if (!payload.creator) { temp.push('creator'); }
  }
  response.message = { requiredField: temp };
  return response;
};

const editArticle = (payload) => {
  let response = {};
  let temp = [];
  if (!payload) {
    temp = ['id','article_name', 'creator'];
  } else {
    if (!payload.id) { temp.push('id'); }
    if (!payload.article_name) { temp.push('article_name'); }
    if (!payload.creator) { temp.push('creator'); }
  }
  response.message = { requiredField: temp };
  return response;
};


module.exports = {
  isValidPayload,
  createArticle,
  editArticle
};
