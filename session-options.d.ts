import { Authenticator, AuthenticatorFactory } from './authenticators';
import { Authorizer, AuthorizerFactory } from './authorizers';
import { SessionStore, StoreFactory } from './session-stores';
export interface SessionOptions {
    authenticator: Authenticator | AuthenticatorFactory;
    authorizer: Authorizer | AuthorizerFactory;
    store: SessionStore | StoreFactory;
}
