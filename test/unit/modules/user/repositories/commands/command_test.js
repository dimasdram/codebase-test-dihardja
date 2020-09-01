const sinon = require('sinon');

const Command = require('../../../../../../bin/modules/user/repositories/commands/command');

describe('User-command', () => {

  describe('insertOneUser', () => {
    const queryResult = {
      'err': null,
      'data': {
        '_id': '5bac53b45ea76b1e9bd58e1c',
        'username': 'dimasdram',
        'password': '8789ad457ac341e4fc4cad32'
      }
    };

    it('should success to insert data to db', async() => {

      const db = {
        insertOne: sinon.stub().resolves(queryResult),
        setCollection: sinon.stub()
      };
      new Command(db);
    });
  });

});
