const sinon = require('sinon');
const raven = require('raven');

describe('Sentry', () => {

  describe('sendError', () => {
    it('should success send error', () => {
      sinon.stub(raven, 'config').resolves({
        install: sinon.stub()
      });
      sinon.stub(raven, 'captureMessage');
    });
  });
});
