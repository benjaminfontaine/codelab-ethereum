
// Contrat de tierce en ligne

contract MonTierce {

	struct Bet {
		address adresseParieur;
		uint mise;
		bytes32[3] chevauxTierce;
	}

	struct Course {
		uint idCourse;
		uint montantTotalMises;
		bool terminee;
		//les chevaux sont représentés par un hash de leur id et nom
		bytes32[] chevauxEnCourse;
		Bet[] paris;
	}

  struct CoefficientsPrime {
		uint coefficientTierce;
		uint coefficientDuo;
		uint coefficientUno;
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

		course.paris.push( Bet(msg.sender, mise, chevauxTierce));
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
		Bet[] parisGagnantsTierce;
		Bet[] parisGagnantsDuo;
		Bet[] parisGagnantsUno;

		for(uint i = 0 ; i < course.paris.length ; i++){
			Bet pari = course.paris[i];
			if(pari.chevauxTierce[0] == chevauxTierceGagnant[0]){
				if(pari.chevauxTierce[1] == chevauxTierceGagnant[1]){
					if(pari.chevauxTierce[2] == chevauxTierceGagnant[2]){
						//le code suivant est interdit car les arrays in memory doivent avoir une taille fixe
						parisGagnantsTierce.push(pari);
					} else {
						parisGagnantsDuo.push(pari);
					}
				} else {
					parisGagnantsUno.push(pari);
				}
			}
		}
		bool existeGagnantTierce = parisGagnantsTierce.lenght > 0;
		bool existeGagnantDuo = parisGagnantsDuo.lenght > 0;
		bool existeGagnantUno = parisGagnantsUno.lenght > 0;

		if(!existeGagnantTierce && !existeGagnantDuo && !existeGagnantUno){
			course.terminee=true;
			annulerParis(course);

		} else {
			CoefficientsPrime coefficientsPrime = calculerCoefficientsPrime(existeGagnantTierce, existeGagnantDuo, existeGagnantUno);
      uint sommeMiseParCoefficientParis = calculerSommeMiseParCoefficientPourChaquePari(parisGagnantsTierce, parisGagnantsDuo, parisGagnantsUno, coefficientsPrime);

				//TODO mettre la prime dans la struct pari pour simplifier les algos
				//calcul de la somme due à chaque parieurs
				//paiement du tierce
				//facteurGainX = uno duo ou tierce ou rien
				//gain pariX = (miseX * facteurGainX * totalMise) / somme pour tous les paris de misePari * facteurGainPari
				for(uint j = 0 ; j < parisGagnantsTierce.length ; j++){
					//TODO gérer la division qui n'est pas entière
					uint gainPari = (parisGagnantsTierce[j].mise * coefficientsPrime.coefficientTierce * course.montantTotalMises) / sommeMiseParCoefficientParis;
					//TODO mettre en place withdraw pattern
					parisGagnantsTierce[j].adresseParieur.send(gainPari);
				}
				for(uint k = 0 ; k < parisGagnantsDuo.length ; k++){
					gainPari = (parisGagnantsDuo[k].mise * coefficientsPrime.coefficientDuo * course.montantTotalMises) / sommeMiseParCoefficientParis;
					parisGagnantsDuo[k].adresseParieur.send(gainPari);
				}
				for(uint l = 0 ; l < parisGagnantsUno.length ; l++){
					gainPari = (parisGagnantsUno[l].mise * coefficientsPrime.coefficientUno * course.montantTotalMises) / sommeMiseParCoefficientParis;
					parisGagnantsUno[l].adresseParieur.send(gainPari);
				}

		}





	}
	// cette méthode va faire la somme pour chaque pari gagnant, de la mise multipliée par le coefficients de prime associé au pari
	function calculerSommeMiseParCoefficientPourChaquePari(Bet[] parisGagnantsTierce, Bet[] parisGagnantsDuo, Bet[] parisGagnantsUno, CoefficientsPrime coefficientsPrime) private returns (uint) {
		uint result = 0;
		for(uint m = 0 ; m < parisGagnantsTierce.length ; m++){
			result += parisGagnantsTierce[m].mise * coefficientsPrime.coefficientTierce;
		}
		for(uint n = 0 ; n < parisGagnantsDuo.length ; n++){
			result += parisGagnantsDuo[n].mise * coefficientsPrime.coefficientDuo;
		}
		for(uint o = 0 ; o < parisGagnantsUno.length ; o++){
			result += parisGagnantsUno[o].mise * coefficientsPrime.coefficientUno;
		}
		return result;
	}

	function calculerCoefficientsPrime(bool existeGagnantTierce, bool existeGagnantDuo, bool existeGagnantUno) private  returns (CoefficientsPrime) {
		CoefficientsPrime result;
		if(existeGagnantTierce && existeGagnantDuo && existeGagnantUno){
      result = CoefficientsPrime(60, 30, 10);
		}
		else if(existeGagnantTierce && !existeGagnantDuo && existeGagnantUno){
      result = CoefficientsPrime(80, 0, 20);
		}
		else if(existeGagnantTierce && existeGagnantDuo && !existeGagnantUno){
			result = CoefficientsPrime(66, 34, 0);
		}
		else if(existeGagnantTierce && !existeGagnantDuo && !existeGagnantUno){
			result = CoefficientsPrime(100, 0, 0);
		}
		else if(existeGagnantDuo && existeGagnantUno){
				result = CoefficientsPrime(0, 75, 25);
		}
		else if(existeGagnantDuo && !existeGagnantUno){
			result = CoefficientsPrime(0, 100, 0);
		}
		else{
			result = CoefficientsPrime(0, 0, 100);
		}
		return result;
	}

	function annulerParis(Course course) private {
		for(uint p = 0 ; p < course.paris.length ; p++){
			Bet pari = course.paris[p];
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
