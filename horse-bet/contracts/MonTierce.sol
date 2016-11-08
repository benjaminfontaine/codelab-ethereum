pragma solidity ^0.4.0;
import "MonTierceLib.sol";
import "mortal.sol";
// Contrat de tierce en ligne

contract MonTierce is mortal{

  struct Course {
    uint idCourse;
    bool terminee;
    //les chevaux sont représentés par leur id
    uint32[] chevauxEnCourse;
  }

  uint public courseIDGenerator = 0;
  //une structure de données type Map qui va associer un id à une course.
  // http://solidity.readthedocs.io/en/develop/types.html
  mapping (uint => Course) courses;

  //event qui va permettre de debugger le contrat au cours de test et au cours de la vie du contrat.
  event InitialisationCourse(uint32[] chevauxAuDepart, uint idCourse, address owner);

  //INFO : on souhaite restreindre l'accès à cette fonction au propriètaire du contrat
  // on peut le faire via le modifier défini dans le fichier owned.sol
  // https://github.com/ethereum/wiki/wiki/Solidity-Features#user-content-function-modifiers
  function initialiserCourse(uint32[] chevauxParticipants) onlyowner returns(uint) {

    //les struct Course du mapping courses sont déjà initialisés, il suffit juste de leur positionner des attributs
    //L'initialisation suivante ne fonctionne pas
    //Course course = Course({idCourse:courseIDGenerator, montantTotalMises:0,  terminee:false, chevauxEnCourse:chevauxParticipants });
    //car solidity ne gère pas l'initialisation de tableaux vides
    courses[courseIDGenerator].idCourse= courseIDGenerator;

    //INFO : on doit copier les chevauxParticipants dans le storage du contrat
    // => courses[courseIDGenerator].chevauxEnCourse
    for(uint x= 0; x< chevauxParticipants.length; x++ ){
      courses[courseIDGenerator].chevauxEnCourse.push(chevauxParticipants[x]);
    }
    InitialisationCourse(chevauxParticipants, courses[courseIDGenerator].idCourse, owner);

    courseIDGenerator++ ;
    return courses[courseIDGenerator].idCourse;
  }

  event GetInfosCourse(uint idCourse);
  //cette méthode, en lecture seule, permets de récupérer les informations de la course
  function getInfosCourse(uint idCourse) public returns(uint, bool, uint32[]){
    GetInfosCourse(idCourse);
    return (courses[idCourse].idCourse, courses[idCourse].terminee, courses[idCourse].chevauxEnCourse);
  }
}
