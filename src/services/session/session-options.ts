import {Authenticator} from './authenticators/authenticator';
import {Authorizer} from './authorizers/authorizer';
import {SessionStore} from './session-stores/session-store';

export interface SessionOptions {
  authenticator: Authenticator;
  authorizer: Authorizer;
  store: SessionStore;
}