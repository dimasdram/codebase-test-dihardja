const User = require('../../../../../../bin/modules/user/repositories/queries/domain');
const query = require('../../../../../../bin/modules/user/repositories/queries/query');
const sinon = require('sinon');
// const assert = require('assert');


describe('viewUser', () => {

  const db = {
    setCollection: sinon.stub()
  };

  const user = new User(db);

  it('should return user data', async() => {

    let queryResult = {
      'err': null,
      'data': {
        '_id': '5bac53b45ea76b1e9bd58e1c',
        'username': 'dimasdram',
        'password': '8789ad457ac341e4fc4cad32'
      }
    };

    sinon.stub(query.prototype, 'getUserByFilter').resolves(queryResult);

    const userId = '5bac53b45ea76b1e9bd58e1c';
    await user.viewUser(userId);

    query.prototype.getUserByFilter.restore();

  });

  it('should return error', async() => {

    let queryResult = {
      'err': true,
      'data': null
    };

    sinon.stub(query.prototype, 'getUserByFilter').resolves(queryResult);

    const userId = '5bac53b45ea76b1e9bd58e1c';
    await user.viewUser(userId);

    query.prototype.getUserByFilter.restore();
  });
});