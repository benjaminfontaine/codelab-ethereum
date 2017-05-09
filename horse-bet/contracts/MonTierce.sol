pragma solidity ^0.4.0;
import "MonTierceLib.sol";
import "mortal.sol";
// Contrat de tierce en ligne

contract MonTierce is mortal{

    //les différents état que peut prendre un pari
    enum EtatPari { NonDetermine, Perdant, GagnantTierce, GagnantDuo, GagnantUno }
  
    //représente un pari
    struct Pari {
      address adresseParieur;
      uint mise;
      uint32[3] chevauxTierce;
      EtatPari etat;
    }
  
  
    struct Course {
      uint idCourse;
      uint montantTotalMises;
      bool terminee;
      bool parisBloques;
      //les chevaux sont représentés par leur ids
      uint32[] chevauxEnCourse;
      //on ne peut pas itérer sur le mapping paris sans ça
      address[] parisKeySet;
      mapping (address => Pari) paris;
      mapping (uint8 => uint8) coefficientsPrime;
      uint sommeCoefficientsParMises;
      uint misesDesPerdants;
      bool existeGagnantTierce;
      bool existeGagnantDuo;
      bool existeGagnantUno;
    }
  
    uint public courseIDGenerator = 1;
    //structure de données qui référence les courses
    mapping (uint => Course) courses;
  
    //event qui va permettre de debugger le contrat au cours de test et au cours de la vie du contrat.
    event InitialisationCourse(uint32[] chevauxAuDepart, uint idCourse, address owner);
  
    function initialiserCourse(uint32[] chevauxParticipants) onlyowner returns(uint) {
  
      //les struct Course du mapping courses sont déjà initialisés, il suffit juste de leur positionner des attributs
      //L'initialisation suivante ne fonctionne pas
      //Course course = Course({idCourse:courseIDGenerator, montantTotalMises:0,  terminee:false, chevauxEnCourse:chevauxParticipants });
      //car solidity ne gère pas l'initialisation partielle d'une struct
      courses[courseIDGenerator].idCourse= courseIDGenerator;
      courses[courseIDGenerator].montantTotalMises=0;
      courses[courseIDGenerator].terminee=false;
      courses[courseIDGenerator].parisBloques=false;
      courses[courseIDGenerator].misesDesPerdants=0;
      for(uint x= 0; x< chevauxParticipants.length; x++ ){
        courses[courseIDGenerator].chevauxEnCourse.push(chevauxParticipants[x]);
      }
      InitialisationCourse(chevauxParticipants, courses[courseIDGenerator].idCourse, owner);
  
      courseIDGenerator++ ;
      return courses[courseIDGenerator].idCourse;
    }

  
    //cette méthode, en lecture seule, permets de récupérer les informations de la course
    function getInfosCourse(uint idCourse) public returns(uint, uint, bool, uint32[], bool){
      return (courses[idCourse].idCourse, courses[idCourse].montantTotalMises, courses[idCourse].terminee, courses[idCourse].chevauxEnCourse , courses[idCourse].parisBloques);
    }
}
