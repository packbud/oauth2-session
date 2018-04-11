import { Authorizer } from './authorizer';
import { PlainHeaders } from '../plain-headers';
export declare class OAuth2Bearer implements Authorizer {
    authorize(data: any, headers: PlainHeaders): PlainHeaders;
}
