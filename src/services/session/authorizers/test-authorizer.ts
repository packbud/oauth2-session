import {Authorizer} from './authorizer';
import {PlainHeaders} from "../plain-headers";

interface Strategy {
  authorize?: (data, headers: PlainHeaders) => PlainHeaders;
}

export class TestAuthorizer implements Authorizer {
  constructor(public strategy: Strategy = {}) {

  }

  authorize(data, headers: PlainHeaders): PlainHeaders {
    return this.strategy.authorize(data, headers);
  }
}