
const queryBuilder = require('../../../../helpers/databases/postgresql/query_builder');
// const ObjectId = require('mongodb').ObjectId;

class Query {

  constructor(db) {
    this.db = db;
  }

  async getUserByFilter(tblName, returnFieldName, filterBy){
    let hit = await queryBuilder.selectDatas(tblName, returnFieldName, filterBy );
    let data = hit.data;
    return data;
  }
}

module.exports = Query;
