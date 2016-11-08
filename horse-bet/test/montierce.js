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
    var throwMessage = "VM Exception while processing transaction: invalid JUMP";
    
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
                //et on recherche ensuite des informations sur cette course
                return contratTierce.getInfosCourse.call(idCourseCree);
            })
            .then(function(courseDatas){
                assert.equal(courseDatas[0], idCourseCree, "L'id de la course dans le storage doit être 0");
                assert.equal(courseDatas[1].valueOf(), 0, "Le montant total des paris de la course dans le storage doit être 0");
                assert.equal(courseDatas[2], false, "La course ne doit pas être terminée");
                //web3 renvoie des BigInteger pour les uint, il faut donc les convertir en nombre standards
                var chevauxEnCourseRetournes = [];
                for(var i = 0 ; i < courseDatas[3].length; i++){
                    chevauxEnCourseRetournes.push(Number(courseDatas[3][i]));
                }
                assert.deepEqual(chevauxEnCourseRetournes, chevauxEnCourse, "Les chevaux en course dans le storage doivent être ceux passés à l'initialisation");
      assert.equal(courseDatas[4], false, "Les paris doivent être autorisés sur la course");
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
        contratTierce.initialiserCourse(chevauxEnCourse,{from: account_two}).catch(function(error){
            //cette création doit échouer
            initOwnerOnly = true;
        }).then(function(){
            assert.equal(initOwnerOnly, true, "La création de course doit être réservé au propriètaire du contrat.")
        });
    });
    
    
    
    it("possède une fonction parier qui va permettre de miser si les paris ne sont bloqués, la course encore en cours,  les chevaux du pari existent et le parieur n'a pas déjà parié", function(done) {
        var contratTierce = MonTierce.deployed();
        
        //permet de logguer tous les events lancés par le contrat
        var events = contratTierce.allEvents({});
        events.watch(function(error, result) {
            console.log(result.event);
            console.log(result.args);
        });
        
        var courseId = -1;
        var pari3EnErreur = false;
        var pari5EnErreur = false;
        
        contratTierce.initialiserCourse(chevauxEnCourse)
            .then(function(transactionId) {
                return contratTierce.courseIDGenerator.call();
            })
            .then(function(lastCourseId){
                courseId = Number(lastCourseId-1);
                console.log("courseId " + courseId);
                console.log("pari 1");
                return contratTierce.parier(courseId, [4,3,10], {value: 300, gas: 2000000, from: account_one});
            })
            .then(function() {
                console.log("get info 1");
                return contratTierce.getInfosCourse.call(courseId);
            })
            
            .then(function(courseDatas){
                console.log("analyse info 1");
                assert.equal(courseDatas[0], courseId, "L'id de la course dans le storage doit être 1");
                assert.equal(courseDatas[1].valueOf(), 300, "Le montant total des paris de la course dans le storage doit être 300");
                assert.equal(courseDatas[2], false, "La course ne doit pas être terminée");
                
                //web3 renvoie des BigInteger pour les uint, il faut donc les convertir en nombre standards
                var chevauxEnCourseRetournes = [];
                for(var i = 0 ; i < courseDatas[3].length; i++){
                    chevauxEnCourseRetournes.push(Number(courseDatas[3][i]));
                }
                assert.deepEqual(chevauxEnCourseRetournes, chevauxEnCourse, "Les chevaux en course dans le storage doivent être ceux passés à l'initialisation");
                assert.equal(courseDatas[4], false, "Les paris doivent être autorisés sur la course");
                console.log("pari 2");
                return contratTierce.parier(courseId, [6,10,8], {value: 200, gas: 2000000, from: account_two});
            })
            .then(function(){
                console.log("get info 2");
                return contratTierce.getInfosCourse.call(courseId);
            })
            .then(function(courseDatas){
                console.log("analyse info 2");
                assert.equal(courseDatas[1].valueOf(), 500, "Le montant total des paris de la course dans le storage doit être 500");
                console.log("pari 3");
                //on essaye de parier sur des chevaux qui ne sont pas en course
                return contratTierce.parier(courseId, [12,3,2], {value: 1000, gas: 2000000, from: account_three});
            })
            .catch(function (err){
                console.log("catch 1");
                
                //l'erreur renvoyée lorsque l'on lance un throw depuis le contrat
                if(err.message.indexOf(throwMessage) !== -1){
                    pari3EnErreur =true;
                }else{
                    console.log(err);
                }
            })
            .then(function (){
                console.log("pari 4");
                return contratTierce.parier(courseId, [6,10,4], {value: 2000, gas: 2000000, from: account_four});
            })
            .then(function (){
              console.log("interdire pari");
              //INFO : on souhatte maintenant interdire les paris en appelant la fonction interdireParis du contrat
              return FIX_ME;
            })
            .then(function (){
              console.log("pari 5");
              return contratTierce.parier(courseId, [9,7,4], {value: 3000, gas: 2000000, from: account_five});
            })
            .catch(function (err){
              console.log("catch 2");
              console.log(err.message);
              //l'erreur renvoyée quand on lance un throw depuis le contrat
              if(err.message.indexOf(throwMessage) !== -1){
                pari5EnErreur =true;
              }else {
                console.log(err);
                assert.fail("Une erreur inattendue s'est produite "+ err.message);
              }
            })
            .then(function(){
                console.log("get info 3");
                return contratTierce.getInfosCourse.call(courseId);
            })
            .then(function(courseDatas){
                console.log("analyse info 3");
                assert.equal(courseDatas[1].valueOf(), 2500, "Le montant total des paris de la course dans le storage n'a pas bougé car le pari n'est pas passé");
                assert.equal(pari3EnErreur, true, "Le pari 3 ne devrait passé car les paris étaient bloqués");
                assert.equal(pari5EnErreur, true, "Le pari 5 ne devrait pas être passé car il a misé sur le cheval 12 inexistant");
                assert.equal(courseDatas[4], true, "Les paris doivent être interdits sur la course");
                //INFO : comment faire pour que mes tests me rendent la main après leur lancement
                //INDICE : le framework web3 est encore en attente de lecture d'events
                // https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-allevents
                FIX_ME
                done();
            })
            .catch(function(err){
                console.log(err);
                assert.fail("Une erreur inattendue s'est produite" + err.message);
                events.stopWatching();
                done();
            });
    });
});
