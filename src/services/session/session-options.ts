import {Authenticator, AuthenticatorFactory} from './authenticators';
import {Authorizer} from './authorizers';
import {SessionStore} from './session-stores/session-store';

export interface SessionOptions {
  authenticator: Authenticator|AuthenticatorFactory;
  authorizer: Authorizer;
  store: SessionStore;
}