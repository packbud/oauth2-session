import { PlainHeaders } from '../plain-headers';
export interface Authorizer {
    authorize(data: any, headers: PlainHeaders): PlainHeaders;
}
