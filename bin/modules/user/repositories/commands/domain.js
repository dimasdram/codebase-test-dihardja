
const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const jwtAuth = require('../../../../auth/jwt_auth_helper');
const commonUtil = require('../../../../helpers/utils/common');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, UnauthorizedError, ConflictError, InternalServerError } = require('../../../../helpers/error');
const constant = require('../../../../infra/configs/constant');
const uuid = require('uuid');


const algorithm = 'aes-256-ctr';
const secretKey = 'Dom@in2018';

class User {

  constructor(db){
    this.command = new Command(db);
    this.query = new Query(db);
  }

  async generateCredential(payload) {
    const ctx = 'domain-generateCredential';
    const { email, password } = payload;
    const tblUsers = constant.tblUsers;
    const returningTblUsers =  constant.fieldTblUsers;
    const user = await this.query.getUserByFilter(tblUsers, returningTblUsers, {email : email});
    if (user.length == 0) {
      logger.log(ctx, 'user not found', 'user not found');
      return wrapper.error(new NotFoundError('user not found'));
    }
    const userId = user[0].id;
    const userEmail = user[0].email;
    const pass = await commonUtil.decrypt(user[0].password, algorithm, secretKey);
    if (email !== userEmail || pass !== password) {
      return wrapper.error(new UnauthorizedError('Password invalid!'));
    }
    const data = {
      email,
      sub: userId
    };
    const token = await jwtAuth.generateToken(data);
    let resultData = {
      token,
      role: user[0].role
    };
    return wrapper.data(resultData);
  }

  async register(payload) {
    const { name, email, password} = payload;
    const tblUsers = constant.tblUsers;
    const returningTblUsers =  constant.fieldTblUsers;
    const user = await this.query.getUserByFilter(tblUsers, returningTblUsers, {email:email});
    if (user.length > 0) {
      return wrapper.error(new ConflictError('user already exist'));
    }
    const chiperPwd = await commonUtil.encrypt(password, algorithm, secretKey);
    const data = {
      id: uuid().toString(),
      name,
      email,
      role:'user',
      password: chiperPwd
    };
    const addData = await this.command.addUser(tblUsers, data, returningTblUsers);
    if (addData.err == 'fail'){
      return wrapper.error(new InternalServerError('internal server error'));
    }
    const result = addData.data;
    return wrapper.data(result);
  }

  async updateUser(payload) {
    const ctx = 'domain-updateUser';
    const { name, email, password, role, userId} = payload;
    const tblUsers = constant.tblUsers;
    const returningTblUsers = constant.fieldTblUsers;
    const user = await this.query.getUserByFilter(tblUsers, returningTblUsers, { id: userId });
    if (user.length == 0) {
      logger.log(ctx, 'user not found', 'user not found');
      return wrapper.error(new NotFoundError('user not found'));
    }
    const chiperPwd = await commonUtil.encrypt(password, algorithm, secretKey);
    const data = {
      name: name != '' ? name : user[0].name,
      role: role != '' ? role : user[0].role,
      email: email != '' ? email : user[0].email,
      password: chiperPwd != '' ? chiperPwd : user[0].password
    };
    const whereFilter = {
      id: userId
    };
    const updateData = await this.command.updateUser(tblUsers, data, whereFilter, returningTblUsers);
    if (updateData.err == 'fail') {
      return wrapper.error(new ConflictError('error update'));
    }
    return wrapper.data(data);
  }

}

module.exports = User;
