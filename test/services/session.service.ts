import {expect} from 'chai';

import {Session} from '../../src/services/session';
import {TestAuthenticator} from '../../src/services/session/authenticators/test-authenticator';
import {TestAuthorizer} from '../../src/services/session/authorizers/test-authorizer';
import {TestStorage} from '../../src/services/session/session-stores/test-storage';
import {Observable} from "rxjs/Observable";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

describe('Session', () => {
  let authenticator: TestAuthenticator;
  let authorizer: TestAuthorizer;
  let store: TestStorage;
  let session: Session;

  beforeEach(() => {
    authenticator = new TestAuthenticator();
    authorizer = new TestAuthorizer();
    store = new TestStorage();

    session = new Session(null,{authenticator, authorizer, store})
  });

  describe('#constructor', () => {
    it('Dummy test', () => {
      expect(session).to.not.be.undefined;
    });
  });

  describe('#authenticate', () => {

  });

  describe('#authorize', () => {
    it('Should throw an error if the session is not authenticated', (done) => {
      session.restore()
        .switchMap(() => session.authorize({}))
        .subscribe(null, (error) => {
          expect(error).to.not.be.undefined;
          expect(error.message).to.be.equal('Session must be authenticated before you can authorize headers.');
          done();
        });
    });

    it('Should throw an error if a session data is invalid', (done) => {
      authenticator.strategy.restore = () => Observable.of({});
      authenticator.strategy.isValid = () => false;
      store.data = {content: {}};
      session.restore()
        .switchMap(() => session.authorize({}))
        .subscribe(null, (error) => {
          expect(error).to.not.be.undefined;
          expect(error.message).to.be.equal('Session data is invalid.');
          done();
        });
    });

    it('Should authorize headers if session data lifetime is not expired', (done) => {
      authenticator.strategy.restore = (data) => Observable.of(data);
      authenticator.strategy.isExpired = () => false;
      authenticator.strategy.isValid = () => true;
      authorizer.strategy.authorize = (data, headers) => ({'X-Value': data['token']});
      store.data = {content: {'token': 'xdf2f'}};

      session.restore()
        .switchMap(() => session.authorize({}))
        .subscribe((authorized) => {
          expect(authorized).to.be.an('object').that.has.any.keys('X-Value');
          done();
        })
    });
  });

  describe('#invalidate', () => {
    it('Should clear session data', (done) => {
      store.data = {content: {}};
      session.invalidate().subscribe((success) => {
        expect(success).to.be.true;
        expect(store.data).to.be.an('object').that.is.empty;
        done();
      });
    });
  });

  describe('#restore', () => {
    it('Should immediately return false if there are no session data in the store', (done) => {
      store.data = {conent: null};
      session.restore().subscribe((success) => {
        expect(success).to.be.not.true;
        done();
      });
    });

    it('Should update session data', (done) => {
      authenticator.strategy.restore = () => {
        return Observable.of({'token': 'x1df3'});
      };

      store.data = {content: {}};

      session.restore().subscribe((success) => {
        expect(success).to.be.true;
        expect(store.data).to.be.an('object').that.has.all.keys('content');
        expect(store.data.content).to.be.an('object').that.has.all.keys('token');
        expect(store.data.content['token']).to.be.equal('x1df3');
        done();
      });
    });
  });

  describe('#isAuthenticatedHelper', () => {
    it('Should return true if session data is present and not null', () => {
      expect(Session.isAuthenticatedHelper({content: {}})).to.be.true;
    });

    it('Should return false if session data is null', () => {
      expect(Session.isAuthenticatedHelper({content: null})).to.be.not.true;
    });

    it('Should return false if session data is not present', () => {
      expect(Session.isAuthenticatedHelper({})).to.be.not.true;
    });
  });
});