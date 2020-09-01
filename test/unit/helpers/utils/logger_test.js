const sinon = require('sinon');
const winston = require('winston');

const sentryLog = require('../../../../bin/helpers/components/sentry/sentry_log');

describe('Logger', () => {

  beforeEach(() => {
    sinon.stub(winston, 'createLogger').resolves(
      {
        info: sinon.stub()
      }
    );
    sinon.stub(sentryLog, 'sendError');
  });

  afterEach(() => {
    winston.createLogger.restore();
    sentryLog.sendError.restore();
  });

});
