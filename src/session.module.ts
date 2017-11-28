import {NgModule, Optional, SkipSelf} from '@angular/core'
import {Session, SessionOptions} from './services/session';

@NgModule({
  exports: [Session]
})
export class SessionModule {
  constructor(@Optional() @SkipSelf() parentModule: SessionModule) {
    if (parentModule) {
      throw new Error('SessionModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(options: SessionOptions) {
    return {
      ngModule: SessionModule,
      providers: [
        {provide: Session, useValue: options}
      ]
    };
  }
}