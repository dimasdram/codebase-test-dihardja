const queryBuilder = require('../../../../helpers/databases/postgresql/query_builder');

class Command {

  constructor(db) {
    this.db = db;
  }

  async addUser (tblUsers, parameter, returningTblUsers){
    const result = await queryBuilder.insertData(tblUsers, parameter, returningTblUsers);
    return result;
  }
  async updateUser(tblName, newData, where, returningTblName) {
    const result = await queryBuilder.updateData(tblName, newData, where, returningTblName);
    return result;
  }
}

module.exports = Command;
