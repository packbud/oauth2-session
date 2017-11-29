import {HttpClient} from '@angular/common/http';
import {Authenticator} from './authenticator';

export interface AuthenticatorFactory {
  (httpClient: HttpClient): Authenticator;
}