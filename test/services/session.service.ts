import {expect} from 'chai';

import {Session} from '../../src/services/session';

describe('Session', () => {
  let session: Session;

  beforeEach(() => {
    session = new Session({
      authenticator: null,
      authorizer: null,
      store: null
    });
  });

  describe('#constructor', () => {
    it('Dummy test', () => {
      expect(session).to.not.be.undefined;
    });


  });
});