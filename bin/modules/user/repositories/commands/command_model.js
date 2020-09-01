const joi = require('joi');

const login = joi.object({
  email: joi.string().required(),
  password: joi.string().required()
});

const register = joi.object({
  name: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: joi.string().min(8).required(),
  cpassword: joi.valid(joi.ref('password')).required()
});

const updateUser = joi.object({
  userId: joi.string().required(),
  name: joi.string().allow(''),
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).allow(''),
  password: joi.string().min(8).allow(''),
  cpassword: joi.valid(joi.ref('password')),
  role: joi.string().allow('').default('user'),
});


module.exports = {
  login,
  register,
  updateUser
};
