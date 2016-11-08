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
    //les chevaux sont représentés par leur id
    uint32[] chevauxEnCourse;

    //INFO quand on a besoin de parcourir un mapping avec solidity
    //on a besoin de recourir à des astuces
    //INDICE : on va s'appuyer sur une structure de donnée à part pour itérer sur la map
    FIX_ME parisKeySet;
    mapping (address => Pari) paris;
  }

  uint public courseIDGenerator = 0;
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
  function getInfosCourse(uint idCourse) public returns(uint, uint, bool, uint32[]){
    GetInfosCourse(idCourse);
    return (courses[idCourse].idCourse, courses[idCourse].montantTotalMises, courses[idCourse].terminee, courses[idCourse].chevauxEnCourse);
  }

    //fonction de fallback indispensable sinon la fonction parier revoit un throw à chaque appel
    function() payable { }

    event Parier(uint idCourse, uint32[3] chevauxTierce, address messageSender, uint mise, uint senderBalance);

  //INFO : sans le mot clé dans la déclaration indiquant que cette fonction recevra des ethers
  // la fonction renverra un throw systématiquement à chaque appel...sans autre indications sig...
  // https://github.com/ethereum/solidity/releases/tag/v0.4.0
    function parier(uint idCourse, uint32[3] chevauxTierce) FIX_ME  {
      Parier(idCourse, chevauxTierce, msg.sender, msg.value, msg.sender.balance);

      Course course = courses[idCourse];
      //si la course n'existe pas
      if(course.chevauxEnCourse.length == 0){
        throw;
      }

      //ou bien est terminée
      if(course.terminee){
        throw;
      }

      //on contrôle que le pari s'effectue sur des chevaux existants
      for(uint i = 0; i < 3; i++){
        bool chevalExiste = false;
        for(uint j = 0; j < course.chevauxEnCourse.length; j++){
          if(chevauxTierce[i] == course.chevauxEnCourse[j]){
            chevalExiste = true;
          }
        }
        if(!chevalExiste){
          throw;
        }
      }
      course.parisKeySet.push(msg.sender);

    //INFO : on veut créer une struct Pari avec :
    //   adresseParieur = msg.sender => adresse de l'auteur du pari
    //   mise = msg.value => valeur en wei du pari
    //   chevauxTierce = chevauxTierce
    //   etat = EtatPari.NonDetermine
    // INDICE : http://ethereum.stackexchange.com/questions/1511/how-to-initialize-a-struct
      course.paris[msg.sender] = FIX_ME;
      course.montantTotalMises += msg.value;
    }



}
