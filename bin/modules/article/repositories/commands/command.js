const queryBuilder = require('../../../../helpers/databases/postgresql/query_builder');

class Command {

  constructor(db) {
    this.db = db;
  }

  async addData (table, parameter, fieldReturn){
    const result = await queryBuilder.insertData(table, parameter, fieldReturn);
    return result;
  }

  async updateData(tblName, newData, where, returningTblName) {
    const result = await queryBuilder.updateData(tblName, newData, where, returningTblName);
    return result;
  }

  async deleteData(tblName, where, returningTblName) {
    const result = await queryBuilder.deleteData(tblName, where, returningTblName);
    return result;
  }

}

module.exports = Command;
