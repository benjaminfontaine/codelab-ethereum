import './shim';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'systemjs/dist/system';
import 'angular2-polyfill/bundles/angular2-polyfill';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

import { routes } from './app/core/app.routes';
import { CORE_DECLARATIONS, AppComponent } from './app/core';
import { MonTierceService } from './app/core/services/montierce/monTierce.service';

if (ENVIRONMENT === 'production') {
  enableProdMode();
}

@NgModule({
  declarations: [CORE_DECLARATIONS],
  imports: [
    HttpModule, BrowserModule, FormsModule, ReactiveFormsModule,
    TranslateModule.forRoot(),
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    { provide: 'ENVIRONMENT', useValue: ENVIRONMENT },
    MonTierceService
  ],
  bootstrap: [AppComponent]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
