import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './oracle.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";
import { MonTierceService } from '../../services/montierce/monTierce.service';

@Component({
  selector: 'oracle',
  template: template,
  styleUrls: ['css/app.css']
})
export class OracleComponent {

  constructor(formBuilder: FormBuilder, serviceTierce : MonTierceService, changeDetect : ChangeDetectorRef) {
    this._builder = formBuilder;
    this._serviceTierce = serviceTierce;
    this._changeDetect = changeDetect;
    this.oracleForm = this._builder.group({
      _id: [''],
      chevauxParticipants: [[], Validators.required],
      idCourseBlocagePari: 0,
      idFinCourse: 0,
      tierceGagnant:[]
    });

    this.estEnErreur=false;
    this.message='';
    this.chevauxExistants = serviceTierce.getChevauxExistants();
    this.courses= serviceTierce.getCourses();
  }

  ngOnInit() {

  }
  creerCourse(formulaire){
    console.log("Création de la course");
    this._serviceTierce.initialiserCourse(formulaire.chevauxParticipants).subscribe(data => {
      console.log(data);
      if(data !== "error"){
        console.log("Création de la course d'id "+ data +" ok.");
        this.message="Création de la course d'id "+ data +" ok.";
        this._changeDetect.detectChanges();
      } else {
        console.log("Création de la course en erreur.");
        this.message="Création de la course en erreur.";
        this._changeDetect.detectChanges();

      }

    });
  }

  bloquerLesParis(formulaire){
    console.log("Bloquer les paris");
    this._serviceTierce.interdireLesParis(formulaire.idCourseBlocagePari).subscribe((data)=>{
      if(data){
        this.estEnErreur = true;
        this.message= "L'opération' a échoué.";
        this._changeDetect.detectChanges();
      } else {
        this.estEnErreur=false;
        this.message = "Les paris sont bloqués sur la course."
        this._changeDetect.detectChanges();
      }
    });

  }

  terminerLaCourse(formulaire){
    console.log("Terminer la course");
    this._serviceTierce.terminerLaCourse(formulaire.idFinCourse, formulaire.tierceGagnant)
    .then((error, idTransaction) => {
      this.estEnErreur = false;
      this.message = "La course est terminée.";
      this._changeDetect.detectChanges();
    }).catch((error) => {
      this.estEnErreur = true;
      this.message = "L'opération' a échoué.";
      console.log(error);
      this._changeDetect.detectChanges();
    });
  }
}
