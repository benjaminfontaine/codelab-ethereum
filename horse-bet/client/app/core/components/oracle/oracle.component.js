import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, ChangeDetectorRef, NgZone } from '@angular/core';
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

  constructor(formBuilder: FormBuilder, serviceTierce: MonTierceService, changeDetect: ChangeDetectorRef, ngZone : NgZone) {
    this._builder = formBuilder;
    this._serviceTierce = serviceTierce;
    this._changeDetect = changeDetect;
    this.oracleForm = this._builder.group({
      _id: [''],
      chevauxParticipants: [[], Validators.required],
      idCourseBlocagePari: -1,
      idFinCourse: -1,
      premierCourse: [-1, Validators.required],
      secondCourse: [-1, Validators.required],
      troisiemeCourse: [-1, Validators.required]
    });

    this.estEnErreur = false;
    this.message = '';
    this.chevauxExistants = serviceTierce.getChevauxExistants();
    this.coursesAInterdire = [];
    this.coursesATerminer = [];
    this.chevauxEnCourse = [];
    this._ngZone = ngZone;
    this.coursesPourPariUnsubscribe = serviceTierce.coursesPourPari$.subscribe(
      (coursesPourPari) => {
        this._ngZone.run(() => {
          this.coursesAInterdire=[{id:-1, name: "Sélectionner une course"}];
          for (var i = 0; i < coursesPourPari.length; i++) {
            this.coursesAInterdire.push({id:coursesPourPari[i], name:'Course '+ coursesPourPari[i]});  
          };
        });
      }
    )
    this.coursesATerminerUnsubscribe = serviceTierce.coursesATerminer$.subscribe(
      (coursesATerminer) => {
        this._ngZone.run(() => {
          this.coursesATerminer=[{id:-1, name: "Sélectionner une course"}];
          for (var i = 0; i < coursesATerminer.length; i++) {
            this.coursesATerminer.push({id:coursesATerminer[i], name:'Course '+ coursesATerminer[i]});  
          };
        });
      }
    )
  }

  ngOnInit() {

  }
  creerCourse(formulaire) {
    console.log("Création de la course");
    this._serviceTierce.initialiserCourse(formulaire.chevauxParticipants).subscribe(data => {
      console.log(data);
      if (data !== "error") {
        console.log("Création de la course d'id " + data + " ok.");
        this.message = "Création de la course d'id " + data + " ok.";
        this._changeDetect.detectChanges();
      } else {
        console.log("Création de la course en erreur. Etes-vous bien administrateur (account 1) ?");
        this.message = "Création de la course en erreur. Etes-vous bien administrateur (account 1) ?";
        this._changeDetect.detectChanges();

      }

    });
  }

  bloquerLesParis(formulaire) {
    console.log("Bloquer les paris");
    this._serviceTierce.interdireLesParis(formulaire.idCourseBlocagePari).subscribe((data) => {
      if (data) {
        this.estEnErreur = true;
        this.message = "L'opération a échoué. Etes-vous bien administrateur (account 1) ?";
        this._changeDetect.detectChanges();
      } else {
        this.estEnErreur = false;
        this.message = "Les paris sont bloqués sur la course."
        this._changeDetect.detectChanges();
      }
    });

  }

  terminerLaCourse(formulaire) {
    console.log("Terminer la course");
    if (formulaire.premierCourse != formulaire.secondCourse && formulaire.secondCourse != formulaire.troisiemeCourse && formulaire.troisiemeCourse != formulaire.premierCourse) {
      this._serviceTierce.terminerLaCourse(formulaire.idFinCourse, [formulaire.premierCourse, formulaire.secondCourse, formulaire.troisiemeCourse])
      .then((error, idTransaction) => {
        this.estEnErreur = false;
        this.message = "La course est terminée.";
        this._changeDetect.detectChanges();
      }).catch((error) => {
        this.estEnErreur = true;
        this.message = "L'opération a échoué. Etes-vous bien administrateur (account 1) ?";
        console.log(error);
        this._changeDetect.detectChanges();
      });
    } else {
      this.message = "Vous devez sélectionner trois chevaux différents";
      this.estEnErreur = true;
    }
  }
  
  rafraichirListeChevaux($event){
    this.rafraichirListeChevauxParId($event.srcElement.selectedOptions[0].value);
  }

  rafraichirListeChevauxParId(id){
    console.log("Rafraîchissement des chevaux pour la course d'id " + id);
    if(id != -1){
     this._ngZone.run(() => {
        this._serviceTierce.getInfosCourse(id).subscribe((infosCourse) => {
          var chevauxEnCourseTemp = infosCourse.chevauxEnCourse;
          this.chevauxEnCourse = [{ id: -1, name: "Sélectionner un cheval" }];
          for (var index = 0; index < chevauxEnCourseTemp.length; index++) {
            var chevalId = chevauxEnCourseTemp[index];
            this.chevauxEnCourse.push(this._serviceTierce.getChevauxExistants().filter((cheval)=> cheval.id === chevalId)[0]);
          }
        });
      });
    }
  }

  ngOnDestroy(){
     this.coursesPourPariUnsubscribe.unsubscribe();
     this.coursesATerminerUnsubscribe.unsubscribe();
  }
}
