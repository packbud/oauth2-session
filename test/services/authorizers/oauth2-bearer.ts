import {expect} from 'chai';

import {OAuth2Bearer} from '../../../src/services/session/authorizers/oauth2-bearer';

describe('OAuth2Bearer', () => {
  const authorizer = new OAuth2Bearer();

  describe('#authorize', () => {
    it('Authorize headers', () => {
       const headers = {'Content-Type': 'application/json'};
       const data = {'access_token': 'xhf21'};

       const authorized = authorizer.authorize(data, headers);

       expect(authorized).to.be.an('object').that.has.any.keys('Authorization');
       expect(authorized['Authorization']).to.be.equal('Bearer xhf21');
    });

    it('Keep other headers unchanged', () => {
      const headers = {'Content-Type': 'application/json'};
      const data = {'access_token': 'xhf21'};

      const authorized = authorizer.authorize(data, headers);

      expect(authorized).to.be.an('object').that.has.any.keys('Content-Type');
      expect(authorized['Content-Type']).to.be.equal('application/json');
    });

    it('Does not authorize headers if access token is missing', () => {
      const headers = {'Content-Type': 'application/json'};
      const data = {};

      const authorized = authorizer.authorize(data, headers);

      expect(authorized).to.be.an('object').that.not.has.any.keys('Authorization');
    });

    it('Does not authorize headers if access token is an empty string', () => {
      const headers = {'Content-Type': 'application/json'};
      const data = {'access_token': ''};

      const authorized = authorizer.authorize(data, headers);

      expect(authorized).to.be.an('object').that.not.has.any.keys('Authorization');
    })
  });
});