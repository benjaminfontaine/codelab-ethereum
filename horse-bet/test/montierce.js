contract('MonTierce', function(accounts) {
  
  //account owner du contrat
  var account_one = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
  
  //des comptes créés par testrpc, rendus fixes par l'option -d au lancement
  var account_two = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0";
  var account_three = "0x22d491bde2303f2f43325b2108d26f1eaba1e32b";
  var account_four = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
  var account_five = "0xd03ea8624c8c5987235048901fb614fdca89b117";
  var account_six = "0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc";
  
  //tableau indiquant la liste des chevaux participants à la course
  var chevauxEnCourse = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  it("contient une méthode initialiserCourse qui doit garder une struct Course dans le storage lorsque l'on l'appelle", function(done) {
    
    // INFO : récupère l'interface MonTierce.sol.js
    // http://truffle.readthedocs.io/en/latest/getting_started/contracts/#making-a-transaction
    // vous pouvez faire un console.log dessus pour observer l'objet renvoyé
    var contratTierce = MonTierce.deployed();
    var initOwnerOnly = false;
    var idCourseCree = -1;
  
    // va nous permettre d'observer tous les événements renvoyés par la blockchain
    var events = contratTierce.allEvents({});
    events.watch(function(error, event){
      console.log(event.args);
    });
    
    //création du compte avec le bon compte (account_one est le compte par défaut)
    contratTierce.initialiserCourse(chevauxEnCourse)
        .then(function(transactionId) {
          //une fonction générant une transaction renvoie toujours
          // l'id de la transaction même si la fonction renvoie autre chose dans le code du contract
          console.log("transactionId="+transactionId);
          
          //on récupére l'id de la dernière course créée
          return contratTierce.courseIDGenerator.call();
        })
        .then(function (idCourseCompteur){
          //idCourseCompteur est un BigInteger, on doit le convertir
          idCourseCree = Number(idCourseCompteur - 1);
          //on recherche ensuite des informations sur cette course
          //INFO : même syntaxe que pour l'id generator avec un paramètre en plus
          return FIX_ME;
        })
        .then(function(courseDatas){
          //INFO : les données de la course sont retournées dans le tableau courseDatas
          assert.equal(FIX_ME, idCourseCree, "L'id de la course dans le storage doit être 0");
          assert.equal(FIX_ME, false, "La course ne doit pas être terminée");
          //web3 renvoie des BigInteger pour les uint, il faut donc les convertir en nombre standards
          var chevauxEnCourseRetournes = [];
          for(var i = 0 ; i < FIX_ME.length; i++){
            chevauxEnCourseRetournes.push(Number(FIX_ME[i]));
          }
          assert.deepEqual(chevauxEnCourseRetournes, chevauxEnCourse, "Les chevaux en course dans le storage doivent être ceux passés à l'initialisation");
          //indispensable pour que le test unitaire se termine
          events.stopWatching();
          done();
        })
        //on catche les erreurs pour effectuer le done() dans tous les cas
        .catch(function(err){
          console.log(err);
          assert.fail("Une erreur inattendue s'est produite" + err.message);
          done();
        });
    
      //tente de faire une transaction de création de course sur un account autre que le owner
      // INFO : il faut appeler la fonction d'initialisation de la course
      // en lui passant les chevaux participants et en utilisant account_two
      // Syntaxe de l'appel d'une fonction sur un contrat : http://truffle.readthedocs.io/en/latest/getting_started/contracts/#making-a-transaction
      // cette appel déclenche une action d'écriture, on utilisera donc la syntaxe :
      // interfaceContrat.nomMethode(parametres1,[ parametres2 ...],[ {options} ])
      contratTierce.initialiserCourse(chevauxEnCourse,{'from': account_two}).catch(function(error){
        //cette création doit échouer
        initOwnerOnly = true;
      }).then(function(){
        assert.equal(initOwnerOnly, true, "La création de course doit être réservé au propriètaire du contrat.")
      });
  });
});
