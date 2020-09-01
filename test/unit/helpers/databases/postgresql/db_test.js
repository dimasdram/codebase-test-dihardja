const sinon = require('sinon');
// const { expect } = require('chai');

// const DB = require('../../../../../bin/helpers/databases/postgresql/db');
const dbtest = require('../../../../../bin/helpers/databases/postgresql/db');
// const validate = require('validate.js');
const pool = require('../../../../../bin/helpers/databases/postgresql/connection');
// const config = require('../../../../../bin/infra/configs/global_config');
const logger = require('../../../../../bin/helpers/utils/logger');

describe('Postgre DB', () => {

  let pgPool;
  beforeEach(() => {
    sinon.stub(logger, 'log');
    pgPool = sinon.stub(pool, 'getConnection');
    pgPool.resolves({
      connect: () => {
        return {
          query : sinon.stub().yields(null, {
            rows: true
          }),
          release : sinon.stub()
        };
      }
    });
  });

  afterEach(()=> {
    pgPool.restore();
    logger.log.restore();
  });

  describe('query', () => {
    it('should return success', async() => {
      await dbtest.prototype.query('statement');
    });
  });

  // describe('command', () => {
  //   it('should return success', async() => {
  //     await dbtest.prototype.command(null);
  //   });
  // });

});
