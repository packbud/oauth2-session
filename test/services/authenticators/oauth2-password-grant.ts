import 'reflect-metadata';
import {Observable} from 'rxjs/Observable';
import {OAuth2PasswordGrant} from '../../../src/services/session/authenticators/oauth2-password-grant';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import * as queryString from 'query-string';

import 'rxjs/add/observable/of';

chai.use(spies);

const {expect} = chai;

describe('OAuth2PasswordGrant', () => {
  describe('#authenticate', () => {
    it('Should pass a correct grant type for a token request', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          const params = queryString.parse(body);
          expect(params).to.be.an('object').that.has.all.keys('client_id', 'client_secret', 'grant_type', 'username', 'password');
          expect(params['grant_type']).to.be.equal('password');
          return Observable.of({
            'access_token': 'xf2zj',
            'refresh_token': 'ddf2z',
            'expires_in': 3600
          });
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      authenticator.authenticate({username: 'john', password: '1234'}).subscribe((result) => {
          done();
      });
    });

    it('Should pass an user credentials to the access token request.', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          const params = queryString.parse(body);
          expect(params).to.be.an('object').that.has.all.keys('client_id', 'client_secret', 'grant_type', 'username', 'password');
          expect(params['username']).to.be.equal('john');
          expect(params['password']).to.be.equal('1234');
          return Observable.of({
            'access_token': 'xf2zj',
            'refresh_token': 'ddf2z',
            'expires_in': 3600
          });
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      authenticator.authenticate({username: 'john', password: '1234'}).subscribe((result) => {
          done();
      });
    });

    it('Should pass a correct url to the access token request.', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          expect(url).to.be.equal('https://packbud.com/oauth2/token');
          return Observable.of({
            'access_token': 'xf2zj',
            'refresh_token': 'ddf2z',
            'expires_in': 3600
          });
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      authenticator.authenticate({username: 'john', password: '1234'}).subscribe((result) => {
        done();
      });
    });

    it('Should add "expires at" data member.', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          return Observable.of({
            'access_token': 'xf2zj',
            'refresh_token': 'ddf2z',
            'expires_in': 3600
          });
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      authenticator.authenticate({username: 'john', password: '1234'}).subscribe((result) => {
        expect(result['expires_at']).to.not.be.undefined;
        expect(result['expires_at']).to.not.be.NaN;
        done();
      });
    });
  });

  describe('#refresh', () => {
    it('Should pass a correct params to a access token refresh.', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          const params = queryString.parse(body);
          expect(params).to.be.an('object').that.has.all.keys('client_id', 'client_secret', 'grant_type', 'refresh_token');
          expect(params['grant_type']).to.be.equal('refresh_token');
          expect(params['refresh_token']).to.be.equal('zzdd3');
          return Observable.of({
              'access_token': 'xf2zj',
              'expires_in': 3600
          });
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      const data = {
        'access_token': 'xvf33',
        'refresh_token': 'zzdd3',
        'expires_in': 3600
      };

      authenticator.refresh(data).subscribe((result) => {
        done();
      });
    });

    it('Should update access token, refresh token and "expires in" according to the server response.', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          return Observable.of({
              'access_token': 'xf2zj',
              'expires_in': 600
          });
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      const data = {
        'access_token': 'xvf33',
        'refresh_token': 'zzdd3',
        'expires_in': 3600
      };

      authenticator.refresh(data).subscribe((result) => {
        expect(result).to.be.an('object').that.has.any.keys('access_token', 'refresh_token', 'expires_in', 'expires_at');
        expect(result['access_token']).to.be.equal('xf2zj');
        expect(result['expires_in']).to.be.equal(600);
        done();
      });
    });
  });

  describe('#refresh', () => {
    it('Should immediately return false if there are no session data.', (done) => {
      const authenticator = new OAuth2PasswordGrant(null);
      authenticator.restore({}).subscribe((success) => {
        expect(success).to.not.be.true;
        done();
      });
    });

    it('Should call session data refresh of session data if access token lifetime is expired.', (done) => {
      const post = chai.spy(() => {
        return Observable.of({
          'access_token': 'xf2zj',
          'expires_in': 3600
        })
      });

      const authenticator = new OAuth2PasswordGrant(<any>{post});

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      const data = {
        'access_token': 'xvf33',
        'refresh_token': 'zzdd3',
        'expires_in': 3600,
        'expires_at': Date.now() - 1
      };

      authenticator.restore(data).subscribe((result) => {
        expect(post).to.have.been.called.once;
        done();
      });
    });

    it('Should immediately return current session data if them are valid and access token lifetime is not expired.', (done) => {
      const post = chai.spy(() => {
        return Observable.of({
          'access_token': 'xf2zj',
          'expires_in': 3600
        })
      });

      const authenticator = new OAuth2PasswordGrant(<any>{post});

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';
      authenticator.serverTokenEndpoint = 'https://packbud.com/oauth2/token';

      const expiresAt = Date.now() + 3600;

      const data = {
        'access_token': 'xvf33',
        'refresh_token': 'zzdd3',
        'expires_in': 3600,
        'expires_at': expiresAt
      };

      authenticator.restore(data).subscribe((result) => {
        expect(post).to.not.have.been.called;
        expect(result).to.be.an('object').that.has.any.keys('access_token', 'refresh_token', 'expires_in', 'expires_at');
        expect(result['access_token']).to.be.equal('xvf33');
        expect(result['refresh_token']).to.be.equal('zzdd3');
        expect(result['expires_in']).to.be.equal(3600);
        expect(result['expires_at']).to.be.equal(expiresAt);
        done();
      });
    });
  });

  describe('#request', () => {
    it('Pass to the http client a correct url', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          expect(url).to.be.equal('https://packbud.com/oauth2/token');
          return Observable.of({});
        }
      });

      authenticator.request('https://packbud.com/oauth2/token').subscribe((result) => {
        done();
      });
    });

    it('Pass to the http client a correct body', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          const params = queryString.parse(body);
          expect(params).to.be.an('object').that.has.all.keys('client_id', 'client_secret', 'grant_type', 'username', 'password');
          expect(params['client_id']).to.be.equal('123hh');
          expect(params['client_secret']).to.be.equal('783ff');
          expect(params['grant_type']).to.be.equal('password');
          expect(params['username']).to.be.equal('john');
          expect(params['password']).to.be.equal('1234');
          return Observable.of({});
        }
      });

      authenticator.clientId = '123hh';
      authenticator.clientSecret = '783ff';

      const params = {
        'grant_type': 'password',
        'username': 'john',
        'password': '1234'
      };

      authenticator.request('https://packbud.com/oauth2/token', params).subscribe((result) => {
        done();
      });
    });

    it('Pass a correct http headers to the http client', (done) => {
      const authenticator = new OAuth2PasswordGrant(<any>{
        post(url, body, options): Observable<any> {
          const {headers} = options;
          expect(headers.get('Accept')).to.be.equal('application/json');
          expect(headers.get('Content-Type')).to.be.equal('application/x-www-form-urlencoded');
          return Observable.of({});
        }
      });

      authenticator.request('https://packbud.com/oauth2/token').subscribe((result) => {
        done();
      });
    });
  });

  describe('#isExpires', () => {
    it('Returns true if "expires_at" is not present', () => {
      const authenticator = new OAuth2PasswordGrant(null);
      expect(authenticator.isExpired({})).to.be.true;
    });

    it('Returns true if "expires_at" < Date.now()', () => {
      const authenticator = new OAuth2PasswordGrant(null);
      expect(authenticator.isExpired({'expires_at': Date.now() - 1})).to.be.true;
    });

    it('Returns false if "expires_at" > Date.now()', () => {
      const authenticator = new OAuth2PasswordGrant(null);
      expect(authenticator.isExpired({'expires_at': Date.now() + 1}));
    })
  });

  describe('#isValid', () => {
    it('Returns true if access token is present', () => {
      const authenticator = new OAuth2PasswordGrant(null);
      expect(authenticator.isValid({'access_token': 'xhf123'})).to.be.true;
    });

    it('Returns false if access token is not present', () => {
      const authenticator = new OAuth2PasswordGrant(null);
      expect(authenticator.isValid({})).to.be.not.true;
    });
  });
});