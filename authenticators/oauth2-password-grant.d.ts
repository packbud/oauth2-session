import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseAuthenticator } from './base-authenticator';
import { UserCredentials } from '../user-credentials';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
export declare class OAuth2PasswordGrant extends BaseAuthenticator {
    private httpClient;
    clientId: string;
    clientSecret: string;
    serverTokenEndpoint: string;
    constructor(httpClient: HttpClient);
    authenticate(credentials: UserCredentials): Observable<any>;
    refresh(data: any): Observable<any>;
    restore(data: any): Observable<any>;
    request(url: any, params?: {
        [p: string]: string;
    }): Observable<any>;
    isExpired(data: any): boolean;
    isValid(data: any): boolean;
    static absolutizeExpirationTime(expiresIn: number): number;
}
