const assert = require('assert');
const sinon = require('sinon');

const command = require('../../../../../../bin/modules/user/repositories/commands/command');
const query = require('../../../../../../bin/modules/user/repositories/queries/query');
const jwtAuth = require('../../../../../../bin/auth/jwt_auth_helper');
const User = require('../../../../../../bin/modules/user/repositories/commands/domain');
const logger = require('../../../../../../bin/helpers/utils/logger');

describe('User-domain', () => {

  const queryResult = [{
    'id':'dimas-123',
    'password':'dimasdram-123123-123132'
  }];

  const payload = {
    'username': 'dimasdram',
    'password': 'dimasdram'
  };

  const db = {
    setCollection: sinon.stub()
  };

  const user = new User(db);

  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';

  before(() => {
    sinon.stub(logger, 'log');
  });

  after(() => {
    logger.log.restore();
  });

  describe('generateCredential', () => {

    it('should generate jwt token', async() => {
      sinon.stub(query.prototype, 'getUserByFilter').resolves([]);
      sinon.stub(jwtAuth, 'generateToken').resolves(token);
      await user.generateCredential(payload);
      query.prototype.getUserByFilter.restore();
      jwtAuth.generateToken.restore();
    });

    it('should return user invalid', async() => {
      const payload = {
        'username': 'dimasdram',
        'password': 'dimasdram'
      };

      sinon.stub(query.prototype, 'getUserByFilter').resolves([]);

      const res = await user.generateCredential(payload);
      assert.notEqual(res.err, null);

      query.prototype.getUserByFilter.restore();
    });
  });

  describe('register', () => {

    it('should success register', async() => {
      sinon.stub(query.prototype, 'getUserByFilter').resolves({ data: null});
      sinon.stub(command.prototype, 'addUser').resolves(queryResult);
      await user.register(payload);
      query.prototype.getUserByFilter.restore();
      command.prototype.addUser.restore();
    });

    it('should return error', async() => {
      sinon.stub(query.prototype, 'getUserByFilter').resolves(queryResult);

      const res = await user.register(payload);
      assert.notEqual(res.err, null);

      query.prototype.getUserByFilter.restore();
    });
  });
});
