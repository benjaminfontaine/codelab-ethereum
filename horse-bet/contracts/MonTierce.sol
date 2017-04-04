pragma solidity ^0.4.0;
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

  event GetInfosCourse(uint idCourse);
  //cette méthode, en lecture seule, permets de récupérer les informations de la course
  function getInfosCourse(uint idCourse) public returns(uint, uint, bool, uint32[], bool){
    GetInfosCourse(idCourse);
    return (courses[idCourse].idCourse, courses[idCourse].montantTotalMises, courses[idCourse].terminee, courses[idCourse].chevauxEnCourse , courses[idCourse].parisBloques);
  }

  event GetCoursesATerminer(uint[], uint);

  //cette méthode, en lecture seule, renvoie les ids des courses actives
  function getCoursesATerminer() public returns(uint[]){
    uint[] memory idsCoursesATerminer =  new uint[](courseIDGenerator);
    for(uint x= 0; x< courseIDGenerator; x++ ){
      if(!courses[x].terminee &&  courses[x].parisBloques){
          idsCoursesATerminer[x] = courses[x].idCourse;
      }
    }
    GetCoursesATerminer(idsCoursesATerminer, idsCoursesATerminer.length);
    return idsCoursesATerminer;
  }

  event GetCoursesEnCours(uint[], uint);
  //cette méthode, en lecture seule, renvoie les ids des courses à terminer
  function getCoursesEnCours() public returns(uint[]){
    uint[] memory idsCoursesEnCours =  new uint[](courseIDGenerator);
    for(uint x= 0; x< courseIDGenerator; x++ ){
      if(!courses[x].terminee &&  !courses[x].parisBloques){
          idsCoursesEnCours[x] = courses[x].idCourse;
      }
    }
    GetCoursesEnCours(idsCoursesEnCours, idsCoursesEnCours.length);
    return idsCoursesEnCours;
  }

  //fonction de fallback indispensable sinon la fonction parier revoit un throw à chaque appel
  function() payable { }

  event Parier(uint idCourse, uint32[3] chevauxTierce, address messageSender, uint mise, uint senderBalance);

  function parier(uint idCourse, uint32[3] chevauxTierce) payable  {
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

    //ou que les paris sont bloques
    if(course.parisBloques){
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
    course.paris[msg.sender] = Pari(msg.sender, msg.value, chevauxTierce, EtatPari.NonDetermine);
    course.montantTotalMises += msg.value;
  }

  event InterdireParis(uint idCourse);

  //bloquer les paris au début de la course
  function interdireParis(uint idCourse) onlyowner{
    courses[idCourse].parisBloques=true;
    InterdireParis(idCourse);
  }
  //event de debug de la fonctionnalité terminerCourse
  event TerminerCourseParams(uint idCourse, uint32[3] chevauxTierceGagnant);
  event TerminerCourseCalculGagnants(uint idCourse, uint32[3] chevauxTierceGagnant, bool existeGagnantTierce, bool existeGagnantDuo, bool existeGagnantUno, uint misesDesPerdants);
  event TerminerCourseComparaisonPari(uint32[3] chevauxTierceGagnant, uint32[3] chevauxPari);
  event TerminerCourseSommeEtCoeff(uint sommeParisParCoef, uint8 coefficientPrimesTierce, uint8 coefficientPrimesDuo, uint8 coefficientPrimesUno);
  event TerminerCourseEnvoiDesGains(address adresseGagnant, uint gain);

  function terminerCourse(uint idCourse, uint32[3] chevauxTierceGagnant) onlyowner {
    TerminerCourseParams(idCourse, chevauxTierceGagnant);
    Course course = courses[idCourse];
    if( course.chevauxEnCourse.length == 0){
      throw;
    }

    if(course.terminee){
      throw;
    }

    course.terminee = true;

    //Les primes sont intégralement redistribuées aux parieurs
    calculerGagnantsCourse(idCourse, chevauxTierceGagnant);


    TerminerCourseCalculGagnants(idCourse, chevauxTierceGagnant, course.existeGagnantTierce, course.existeGagnantDuo, course.existeGagnantUno, course.misesDesPerdants);

    if(!course.existeGagnantTierce && !course.existeGagnantDuo && !course.existeGagnantUno){
      annulerParis(course.idCourse);
      } else {
        calculerCoefficientsPrime(course.idCourse);
        calculerSommeMiseParCoefficientPourChaquePari(course.idCourse);
        TerminerCourseSommeEtCoeff(course.sommeCoefficientsParMises, course.coefficientsPrime[uint8(EtatPari.GagnantTierce)], course.coefficientsPrime[uint8(EtatPari.GagnantDuo)], course.coefficientsPrime[uint8(EtatPari.GagnantUno)]);

        //calcul de la somme due à chaque parieurs et paiement des gains

        for(uint j = 0 ; j < course.parisKeySet.length ; j++){
          address addresseParieur = course.parisKeySet[j];
          EtatPari etatPari = course.paris[addresseParieur].etat;
          if(etatPari != EtatPari.Perdant && etatPari != EtatPari.NonDetermine){
            //facteurGainX = renvoyé par la méthode coefficient prime
            //gain pariX = (miseX * facteurGainX * misesDesPerdants) / somme pour tous les paris de (misePari * facteurGainPari)
            uint gainPari = (course.paris[addresseParieur].mise * course.coefficientsPrime[uint8(course.paris[addresseParieur].etat)] * course.misesDesPerdants) / course.sommeCoefficientsParMises;
            TerminerCourseEnvoiDesGains(addresseParieur, gainPari);
            //TODO mettre en place withdrawal pattern pour éviter des tas de failles de sécurité
            bool envoiOK = course.paris[addresseParieur].adresseParieur.send(gainPari + course.paris[addresseParieur].mise);
            if(!envoiOK){
              //TODO regarder comment traiter ce retour sans que toutes la transaction soit annulée
              throw;
            }
          }
        }
      }
    }
    // cette méthode va faire la somme pour chaque pari gagnant, de la mise multipliée par le coefficients de prime associé au pari
    function calculerSommeMiseParCoefficientPourChaquePari(uint idCourse) private {
      Course course = courses[idCourse];
      uint result = 0;
      for(uint k = 0 ; k < course.parisKeySet.length ; k++){
        Pari pari = course.paris[course.parisKeySet[k]];
        if(pari.etat != EtatPari.Perdant && pari.etat != EtatPari.NonDetermine){
          result += pari.mise * course.coefficientsPrime[uint8(pari.etat)];
        }
      }
      course.sommeCoefficientsParMises = result;
    }

    function calculerGagnantsCourse(uint idCourse, uint32[3] chevauxTierceGagnant) private {
      Course course = courses[idCourse];
      for(uint i = 0 ; i < course.parisKeySet.length ; i++){
        Pari pari = course.paris[course.parisKeySet[i]];
        TerminerCourseComparaisonPari(chevauxTierceGagnant, pari.chevauxTierce);
        if(pari.chevauxTierce[0] == chevauxTierceGagnant[0]){
          if(pari.chevauxTierce[1] == chevauxTierceGagnant[1]){
            if(pari.chevauxTierce[2] == chevauxTierceGagnant[2]){
              pari.etat = EtatPari.GagnantTierce;
              course.existeGagnantTierce = true;
              } else {
                pari.etat = EtatPari.GagnantDuo;
                course.existeGagnantDuo = true;
              }
              } else {
                pari.etat = EtatPari.GagnantUno;
                course.existeGagnantUno= true;
              }
              }else{
                pari.etat = EtatPari.Perdant;
                course.misesDesPerdants += pari.mise;
              }
            }
          }

          //calcul du coefficient pour chaque type de gain (tierce, duo, uno)
          //en fonction de la présence ou non de chacun de ces types
          function calculerCoefficientsPrime(uint idCourse) private {
            Course course = courses[idCourse];
            bool existeGagnantTierce = course.existeGagnantTierce;
            bool existeGagnantDuo = course.existeGagnantDuo;
            bool existeGagnantUno = course.existeGagnantUno;
            if(existeGagnantTierce && existeGagnantDuo && existeGagnantUno){
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 60; //le gagnant d'un tierce bénéficie d'un coefficient de 60
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 30; //le gagnant d'un doublet bénéficie d'un coefficient de 30
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 10; //le gagnant sur un cheval bénéficie d'un coefficient de 10
            }
            else if(existeGagnantTierce && !existeGagnantDuo && existeGagnantUno){
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 80;
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 0;
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 20;
            }
            else if(existeGagnantTierce && existeGagnantDuo && !existeGagnantUno){
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 66;
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 34;
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 0;
            }
            else if(existeGagnantTierce && !existeGagnantDuo && !existeGagnantUno){
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 100;
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 0;
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 0;
            }
            else if(existeGagnantDuo && existeGagnantUno){
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 0;
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 75;
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 25;
            }
            else if(existeGagnantDuo && !existeGagnantUno){
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 0;
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 100;
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 0;
            }
            else{
              course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 0;
              course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 0;
              course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 100;
            }
          }

          //si personne n'a gagné, on rend leur argent à tout les parieurs
          function annulerParis(uint idCourse) private {
            Course course = courses[idCourse];
            for(uint p = 0 ; p < course.parisKeySet.length ; p++){
              Pari pari = course.paris[course.parisKeySet[p]];
              if (!pari.adresseParieur.send(pari.mise)) {
                // si un envoi est impossible, on rend leur argent à tous les parieurs
                // mais tel que c'est fait là, si un des envois échoue,
                // alors tout la méthode terminerCourse est rollbackée et personne ne reçoit rien
                // TODO faire que ça ne soit pas bloquant pour les autres
                throw;
              }
            }
          }


}
