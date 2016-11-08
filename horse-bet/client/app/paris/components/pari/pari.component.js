import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './pari.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";

@Component({
  selector: 'post-list',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PariComponent {

  @Input() currentBalance;
  constructor(formBuilder: FormBuilder) {
    this._builder = formBuilder;
    this.pariForm = this._builder.group({
      _id: [''],
      premierCourse: ['', Validators.required],
    });
    
    this.chevauxEnCourse = ["cheval1", "cheval2", "cheval3","cheval4", "cheval5", "cheval6","cheval7", "cheval8", "cheval9"]; // List of cities
    this.chevauxExistants = ["cheval1", "cheval2", "cheval3","cheval4", "cheval5", "cheval6","cheval7", "cheval8", "cheval9", "cheval10", "cheval11", "cheval12", "cheval13","cheval14", "cheval15", "cheval16", "cheval17", "cheval18", "cheval19", "cheval20"]; // List of cities
  }

  ngOnInit() {

  }

}
