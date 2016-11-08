import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import template from './menu.template.html';

@Component({
  selector: 'top-menu',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  constructor( router: Router) {
    this._router = router;
  }
}
