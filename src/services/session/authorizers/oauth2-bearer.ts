import {Authorizer} from './authorizer';
import {PlainHeaders} from '../plain-headers';

export class OAuth2Bearer implements Authorizer {
  authorize(data, headers: PlainHeaders): PlainHeaders {
    const authorized = {...headers};
    const token = data['access_token'];

    if (token && token.length) {
      authorized['Authorization'] = `Bearer ${token}`;
    }

    return authorized;
  }
}