'use strict';

const mock = require('egg-mock');

describe('test/vue-quote.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/vue-quote-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, vueQuote')
      .expect(200);
  });
});
