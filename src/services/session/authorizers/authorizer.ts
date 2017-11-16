import {PlainHeaders} from '../plain-headers';

export interface Authorizer {
  authorize(data, headers: PlainHeaders): PlainHeaders;
}