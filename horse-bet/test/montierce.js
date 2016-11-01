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
    // récupère l'interface MonTierce.sol.js
    var contratTierce = MonTierce.deployed();
    var initOwnerOnly = false;
    var idCourseCree = -1;


    var events = contratTierce.allEvents({});
    events.watch(function(event){
      console.log(event.args);
    });
    //tente de faire une transaction de création de course sur un account autre que le owner
    contratTierce.initialiserCourse(chevauxEnCourse, {from : account_two}).catch(function(error){
      //cette création doit échouer
      initOwnerOnly = true;
    }).then(function(){
      assert.equal(initOwnerOnly, true, "La création de course doit être réservé au propriètaire du contrat.")
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
      done();
    })
    //on catche les erreurs pour effectuer le done() dans tous les cas
    .catch(function(err){
      console.log(err);
      assert.fail("Une erreur inattendue s'est produite" + err.message);
      done();
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
    var pari6EnErreur = false;

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
          assert.equal(courseDatas[1].valueOf(), 500, "Le montant total des paris de la course dans le storage doit être 300");
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
          return contratTierce.interdireParis(courseId);
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
        // eventPari.stopWatching();
        console.log("terminer course");
        return contratTierce.terminerCourse(courseId,[6,10,8]);
      })
      .then(function(){
        console.log("get info 4");
        return contratTierce.getInfosCourse.call(courseId);
      })
      .then(function(courseDatas){
        console.log("analyse info 4");
        assert.equal(courseDatas[2], true, "La course davrait être terminée");
        console.log("pari 6");
        return contratTierce.parier(courseId, [9,7,4], {value: 3000, gas: 2000000, from: account_one});
      })
      .catch(function(err){
        if(err.message.indexOf(throwMessage) !== -1){
          pari6EnErreur =true;
        }else {
          console.log(err);
          assert.fail("Une erreur inattendue s'est produite "+ err.message);
        }
      })
      .then(function(courseDatas){
        assert.equal(pari6EnErreur, true, "Le dernier pari devrait avoir été refusé car la course est terminée");
          events.stopWatching();
          done();
        })
        .catch(
            done
        );
  });

  it("possède une fonction terminerCourse qui va calculer les gains et payer tous les parieurs", function(done) {
    var balanceAccount2, balanceAccount3, balanceAccount4, balanceAccount5, balanceAccount6;

    var contratTierce = MonTierce.deployed();
    var events = contratTierce.allEvents({});
    var courseId;
    events.watch(function(error, result) {
      console.log(result.event);
      console.log(result.args);
    });
    contratTierce.initialiserCourse(chevauxEnCourse).catch(function(error){
      console.log(console.error());
    })
    .then(function(transactionId) {
      return contratTierce.courseIDGenerator.call();
    })
    .then(function(lastCourseId){
      courseId = Number(lastCourseId-1);
      console.log("courseId" + courseId);
      return contratTierce.parier(courseId, [9,7,4], {value: 3000, gas: 2000000, from: account_six});
    })
    .then(function(){
      return contratTierce.parier(courseId, [10,5,6], {value: 4000, gas: 2000000, from: account_two});
    })
    .then(function(){
      return contratTierce.parier(courseId, [1,2,3], {value: 1000, gas: 2000000, from: account_three});
    })
    .then(function(){
      return contratTierce.parier(courseId, [1,2,5], {value: 2000, gas: 2000000, from: account_four});
    })
    .then(function(){
      return contratTierce.parier(courseId, [1,8,9], {value: 10000, gas: 2000000, from: account_five});
    })
    .then(function (){
      return contratTierce.interdireParis(courseId);
    })
    .then(function(){
      balanceAccount2=web3.eth.getBalance(account_two);
      balanceAccount3=web3.eth.getBalance(account_three);
      balanceAccount4=web3.eth.getBalance(account_four);
      balanceAccount5=web3.eth.getBalance(account_five);
      balanceAccount6=web3.eth.getBalance(account_six);

      return contratTierce.terminerCourse(courseId,[1,2,3]);
    })
    .then(function(){
      console.log("asserts");
      var balanceAccount2Apres=web3.eth.getBalance(account_two);
      var balanceAccount3Apres=web3.eth.getBalance(account_three);
      var balanceAccount4Apres=web3.eth.getBalance(account_four);
      var balanceAccount5Apres=web3.eth.getBalance(account_five);
      var balanceAccount6Apres=web3.eth.getBalance(account_six);

      assert.equal(balanceAccount2Apres.minus(balanceAccount2).toString(10), "0", "Le compte 2 devrait avoir gagné weis");
      assert.equal(balanceAccount3Apres.minus(balanceAccount3).toString(10), "2909", "Le compte 3 devrait avoir gagné 1909 weis");
      assert.equal(balanceAccount4Apres.minus(balanceAccount4).toString(10), "3909", "Le compte 4 devrait avoir gagné 1909 weis");
      assert.equal(balanceAccount5Apres.minus(balanceAccount5).toString(10), "13181", "Le compte 5 devrait avoir gagné 3181 weis");
      assert.equal(balanceAccount6Apres.minus(balanceAccount6).toString(10),  "0", "Le compte 6 devrait avoir gagné weis");
      events.stopWatching();
      done();
    })
    .catch(function(err){
      console.log(err);
      events.stopWatching();
      done();
    })
  });

});
