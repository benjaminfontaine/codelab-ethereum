pragma solidity ^0.4.0;
import "MonTierceLib.sol";
import "mortal.sol";
// Contrat de tierce en ligne

contract MonTierce is mortal{

  //INFO : il manque le mot clé pour définir une structure de donnée
  FIX_ME Course {
    uint idCourse;
    bool terminee;
    //les chevaux sont représentés par leur id
    uint32[] chevauxEnCourse;
  }

  uint public courseIDGenerator = 0;
  //INFO définir une structure de données type Map qui va associer un id à une course.
  // http://solidity.readthedocs.io/en/develop/types.html
  // INDICE : MAP...G
  FIX_ME courses;

  //event qui va permettre de debugger le contrat au cours de test et au cours de la vie du contrat.
  event InitialisationCourse(uint32[] chevauxAuDepart, uint idCourse, address owner);

  //INFO : on souhaite restreindre l'accès à cette fonction au propriètaire du contrat
  // on peut le faire via le modifier défini dans le fichier owned.sol
  function initialiserCourse(uint32[] chevauxParticipants) FIX_ME returns(uint) {

    //les struct Course du mapping courses sont déjà initialisés, il suffit juste de leur positionner des attributs
    //L'initialisation suivante ne fonctionne pas
    //Course course = Course({idCourse:courseIDGenerator, montantTotalMises:0,  terminee:false, chevauxEnCourse:chevauxParticipants });
    //car solidity ne gère pas l'initialisation de tableaux vides
    courses[courseIDGenerator].idCourse= courseIDGenerator;

    //INFO : on doit copier les chevauxParticipants dans le storage du contrat
    // => courses[courseIDGenerator].chevauxEnCourse
    // INDICE : on ne peut pas copier le tableau chevauxParticipants
    //directement de la callstack dans l'espace storage, le code est en spoiler dans le TP
    FIX_ME
    InitialisationCourse(chevauxParticipants, courses[courseIDGenerator].idCourse, owner);

    courseIDGenerator++ ;
    return courses[courseIDGenerator].idCourse;
  }

  event GetInfosCourse(uint idCourse);

  function getInfosCourse(uint idCourse) public returns(uint, bool, uint32[]){
    //INFO : on souhaite déclencher ici l'événement GetInfosCourse à des fins de debug
    FIX_ME

    //INFO : renvoyer les informations idCourse, terminee et chevauxEnCourse
    return FIX_ME;
  }

}
