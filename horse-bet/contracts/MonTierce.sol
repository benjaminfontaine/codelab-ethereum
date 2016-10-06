
// Contrat de tierce en ligne

contract MonTierce {

  enum EtatPari { NonDetermine, Perdant, GagnantTierce, GagnantDuo, GagnantUno }
	struct Pari {
		address adresseParieur;
		uint mise;
		bytes32[3] chevauxTierce;
		EtatPari etat;
	}

	  struct CoefficientsPrime {
			uint coefficientTierce;
			uint coefficientDuo;
			uint coefficientUno;
		}

	struct Course {
		uint idCourse;
		uint montantTotalMises;
		bool terminee;
		//les chevaux sont représentés par un hash de leur id et nom
		bytes32[] chevauxEnCourse;
		//on ne peut pas itérer sur le mapping paris :( sans ça
		address[] parisKeySet;
		mapping (address => Pari) paris;
		mapping (uint8 => uint8) coefficientsPrime;
		uint sommeCoefficientsParMises;
	}

	// sera automatiquement assigné
	//lors de la construction du contract
	// lorsque le msg.sender sera le propriètaire du contrat
	address public owner = msg.sender;

	uint courseIDGenerator = 0;
	mapping (uint => Course) courses;

	modifier ownerOnly()
	{
		if (msg.sender != owner)
		throw;
		// Le  "_;"! est important car il sera remplacé
		// par le contenu de la fonction sur laquelle
		// on placera le modifier
		_
	}


	function initialiserCourse(bytes32[] chevauxParticipants) ownerOnly returns(bool creationOK) {

		//les struct Course du mapping courses sont déjà initialisés, il suffit juste de leur positionner des attributs
		//L'initialisation suivante ne fonctionne pas
		//Course course = Course({idCourse:courseIDGenerator, montantTotalMises:0,  terminee:false, chevauxEnCourse:chevauxParticipants });
		courses[courseIDGenerator].idCourse= courseIDGenerator;
		courses[courseIDGenerator].montantTotalMises=0;
		courses[courseIDGenerator].terminee=false;
		courses[courseIDGenerator].chevauxEnCourse=chevauxParticipants;
		courseIDGenerator++ ;
		return true;
	}

	function parier(uint idCourse, bytes32[3] chevauxTierce, uint mise) public returns(bool pariPrisEnCompte){
		if(msg.sender.balance < mise){
			throw;
		}
		Course course = courses[idCourse];
		//si la course n'existe pas ou bien est terminée
		if(course.idCourse == 0){
			throw;
		}

		if(course.terminee){
			throw;
		}

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
		course.paris[msg.sender] = Pari(msg.sender, mise, chevauxTierce, EtatPari.NonDetermine);
		course.montantTotalMises += mise;
		return true;
	}


	function terminerCourse(uint idCourse, bytes32[3] chevauxTierceGagnant) ownerOnly {
		Course course = courses[idCourse];
		if( course.idCourse == 0){
			throw;
		}

		if(course.terminee){
			throw;
		}

		course.terminee = true;

		//Les primes sont intégralement redistribuées aux parieurs
		bool existeGagnantTierce = false;
		bool existeGagnantDuo = false;
		bool existeGagnantUno = false;

		for(uint i = 0 ; i < course.parisKeySet.length ; i++){
			Pari pari = course.paris[course.parisKeySet[i]];
			if(pari.chevauxTierce[0] == chevauxTierceGagnant[0]){
				if(pari.chevauxTierce[1] == chevauxTierceGagnant[1]){
					if(pari.chevauxTierce[2] == chevauxTierceGagnant[2]){
						//le code suivant est interdit car les arrays in memory doivent avoir une taille fixe
						pari.etat = EtatPari.GagnantTierce;
						existeGagnantTierce = true;
					} else {
						pari.etat = EtatPari.GagnantDuo;
						existeGagnantDuo = true;
					}
				} else {
					pari.etat = EtatPari.GagnantUno;
					existeGagnantUno= true;
				}
			}else{
				pari.etat = EtatPari.Perdant;
			}
		}


		if(!existeGagnantTierce && !existeGagnantDuo && !existeGagnantUno){
			course.terminee=true;
			annulerParis(course.idCourse);
		} else {
			calculerCoefficientsPrime(existeGagnantTierce, existeGagnantDuo, existeGagnantUno, course.idCourse);
      calculerSommeMiseParCoefficientPourChaquePari(course.idCourse);

				//TODO mettre la prime dans la struct pari pour simplifier les algos
				//calcul de la somme due à chaque parieurs
				//paiement du tierce
				//facteurGainX = uno duo ou tierce ou rien
				//gain pariX = (miseX * facteurGainX * totalMise) / somme pour tous les paris de misePari * facteurGainPari
				for(uint j = 0 ; j < course.parisKeySet.length ; j++){
					address addresseParieur = course.parisKeySet[j];
					//TODO gérer la division qui n'est pas entière
					EtatPari etatPari = course.paris[addresseParieur].etat;
					if(etatPari != EtatPari.Perdant && etatPari != EtatPari.NonDetermine){
						uint gainPari = (course.paris[addresseParieur].mise * course.coefficientsPrime[uint8(course.paris[addresseParieur].etat)] * course.montantTotalMises) / course.sommeCoefficientsParMises;
						//TODO mettre en place withdraw pattern
						bool envoiOK = course.paris[addresseParieur].adresseParieur.send(gainPari);
						if(!envoiOK){
						    //TODO regarder comment traiter ce retour
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

	function calculerCoefficientsPrime(bool existeGagnantTierce, bool existeGagnantDuo, bool existeGagnantUno, uint idCourse) private {
	    Course course = courses[idCourse];
		if(existeGagnantTierce && existeGagnantDuo && existeGagnantUno){
      course.coefficientsPrime[uint8(EtatPari.GagnantTierce)] = 60;
			course.coefficientsPrime[uint8(EtatPari.GagnantDuo)] = 30;
      course.coefficientsPrime[uint8(EtatPari.GagnantUno)] = 10;
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

	function annulerParis(uint idCourse) private {
	    Course course = courses[idCourse];
		for(uint p = 0 ; p < course.parisKeySet.length ; p++){
			Pari pari = course.paris[course.parisKeySet[p]];
			if (!pari.adresseParieur.send(pari.mise)) {
					//TODO faire que ça ne soit pas bloquant pour les autres
					throw;
      }
		}
	}

	function detruire() ownerOnly returns(bool destructionOk) {
		//envoi tous les fonds du contract au propriétaire
		suicide(owner);
	}
}
