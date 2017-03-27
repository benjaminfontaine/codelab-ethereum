import { Component, ChangeDetectionStrategy,Input } from '@angular/core';
import { Router } from '@angular/router';

import template from './menu.template.html';

@Component({
  selector: 'top-menu',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
   @Input() isOwner;
  constructor( router: Router) {
    this._router = router;
    this.isOwner = true;
  }

    ngOnChanges(changes) {
      this.isOwner = changes.isOwner.currentValue;
      console.log("Changement du flag isOwner dans le menu. Nouvelle valeur : " + this.isOwner);
    // changes.prop contains the old and the new value...
  }
}
