
// const assert = require('assert');
const sinon = require('sinon');

const query = require('../../../../../../bin/modules/user/repositories/queries/query');

describe('findOneUser', () => {
  sinon.stub(query.prototype, 'getUserByFilter').resolves([{data:true}]);
  query.prototype.getUserByFilter.restore();
});

