import {Authorizer} from './authorizer';

export interface AuthorizerFactory {
  (): Authorizer;
}