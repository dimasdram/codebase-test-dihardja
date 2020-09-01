
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError } = require('../../../../helpers/error');
const constant = require('../../../../infra/configs/constant');


class User {

  constructor(db){
    this.query = new Query(db);
  }

  async viewUser(userId) {
    const tblUsers = constant.tblUsers;
    const returningTblUsers =  constant.fieldTblUsers;

    const user = await this.query.getUserByFilter(tblUsers, returningTblUsers, {id : userId});
    if (user.length == 0) {
      return wrapper.error(new NotFoundError('Can not find user'));
    }
    const userResult = user.map(data => {
      let userResponse = {};
      userResponse.id = data.id;
      userResponse.email = data.email;
      userResponse.role = data.role;
      return userResponse;
    });
    return wrapper.data(userResult);
  }

}

module.exports = User;
