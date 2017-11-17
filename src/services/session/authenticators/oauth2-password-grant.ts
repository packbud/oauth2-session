import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BaseAuthenticator} from './base-authenticator';
import {UserCredentials} from '../user-credentials';
import * as queryString from 'query-string';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';

export class OAuth2PasswordGrant extends BaseAuthenticator {
  clientId: string;
  clientSecret: string;

  serverTokenEndpoint: string;

  constructor(private httpClient: HttpClient) {
    super();
  }

  authenticate(credentials: UserCredentials): Observable<any> {
    const params = {...credentials, 'grant_type': 'password'};

    return this.request(this.serverTokenEndpoint, params)
      .switchMap((response) => {
        const accessToken = response['access_token'];

        if (!(accessToken || accessToken.length)) {
          return Observable.throw(new Error('access_token is missing in server response'));
        }

        const expiresIn = response['expires_in'];
        const expiresAt = OAuth2PasswordGrant.absolutizeExpirationTime(expiresIn);

        return Observable.of({...response, 'expires_at': expiresAt});
      });
  }


  refresh(data: any): Observable<any> {
    let expiresIn = data['expires_in'];
    let refreshToken = data['refresh_token'];

    const params = {
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken
    };

    return this.request(this.serverTokenEndpoint, params)
      .switchMap((response) => {
        expiresIn = response['expires_in'] || expiresIn;
        refreshToken = response['refresh_token'] || refreshToken;

        const data = {...response,
          'expires_in': expiresIn,
          'expires_at': OAuth2PasswordGrant.absolutizeExpirationTime(expiresIn),
          'refresh_token': refreshToken
        };

        return Observable.of(data);
      });
  }

  restore(data: any): Observable<any> {
    if (this.isValid(data)) {
      if (this.isExpired(data)) {
        return this.refresh(data);
      }
      return Observable.of(data);
    }
    return Observable.of(null);
  }

  request(url, params: {[p: string]: string} = {}): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = queryString.stringify({...params,
      client_id: this.clientId,
      client_secret: this.clientSecret
    });

    return this.httpClient.post(url, body, {headers});
  }

  isExpired(data: any): boolean {
    return !data['expires_at'] || data['expires_at'] < Date.now();
  }

  isValid(data: any): boolean {
    return !!data['access_token'];
  }

  static absolutizeExpirationTime(expiresIn: number): number {
    if (expiresIn) {
      return new Date((new Date().getTime()) + expiresIn * 1000).getTime();
    }
  }
}