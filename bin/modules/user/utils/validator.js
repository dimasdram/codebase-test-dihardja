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

const login = (payload) => {
  let response = {};
  let temp = [];
  if (!payload) {
    temp = ['email', 'password'];
  } else {
    if (!payload.email) { temp.push('email'); }
    if (!payload.password) { temp.push('password'); }
  }
  response.message = { requiredField: temp };
  return response;
};
const register = (payload) => {
  let response = {};
  let temp = [];
  if (!payload) {
    temp = ['name', 'email', 'password', 'cpassword'];
  } else {
    if (!payload.name) { temp.push('name'); }
    if (!payload.email) { temp.push('email'); }
    if (!payload.password) { temp.push('password'); }
    if (!payload.cpassword) { temp.push('cpassword'); }
  }
  response.message = { requiredField: temp };
  return response;
};

const editUser = (payload) => {
  let response = {};
  let temp = [];
  if (!payload) {
    temp = ['id','email', 'password'];
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
  login,
  register,
  editUser,
};
