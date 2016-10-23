contract('MonTierce', function(accounts) {

  //account owner du contrat
  var account_one = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
  var account_two = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0";
  var account_three = "0x22d491bde2303f2f43325b2108d26f1eaba1e32b";
  var account_four = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
  var account_five = "0xd03ea8624c8c5987235048901fb614fdca89b117";
  var account_six = "0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc";
  var chevauxEnCourse = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("doit garder une struct Course dans le storage lorsque l'on appelle la méthode init", function(done) {
    var contratTierce = MonTierce.deployed();
    var chevauxEnCourse = [10, 20, 30];
    //contratTierce.terminee.call() : accéder aux attributs publiques du contract
    contratTierce.initialiserCourse(chevauxEnCourse)
    .then(function(transactionId) {
      console.log("transactionId="+transactionId);
      var idCourseCree = 0;
      return contratTierce.getInfosCourse.call(idCourseCree);})
      .then(function(courseDatas){
        assert.equal(courseDatas[0], 0, "L'id de la course dans le storage doit être 0");
        assert.equal(courseDatas[1].valueOf(), 0, "Le montant total des paris de la course dans le storage doit être 0");
        assert.equal(courseDatas[2], false, "La course ne doit pas être terminée");
        //web3 renvoie des BigInteger pour les uint, il faut donc les convertir en nombre standards
        var chevauxEnCourseRetournes = [];
        for(var i = 0 ; i < courseDatas[3].length; i++){
          chevauxEnCourseRetournes.push(Number(courseDatas[3][i]));
        }
        assert.deepEqual(chevauxEnCourseRetournes, chevauxEnCourse, "Les chevaux en course dans le storage doivent être ceux passés à l'initialisation");
        assert.equal(courseDatas[4], false, "Les paris doivent être autorisés sur la course");
        done();
      }).catch(done);
    });


    it("possède une fonction parier qui va permettre de miser si les paris ne sont bloqués, la course encore en cours,  les chevaux du pari existent et le parieur n'a pas déjà parié", function(done) {
      var contratTierce = MonTierce.deployed();
      //récupère tous les events InitialisationCourse du dernier block
      // var eventInitCourse = contratTierce.InitialisationCourse({ fromBlock:'latest' });
      // eventInitCourse.watch(function(error, result) {
      //   //loggue chaque event
      //   console.log("Event init course : ");
      //   console.log(result.args);
      // });

      //pas de filtre, va tout loguer
      // var eventPari = contratTierce.Parier({});
      // eventPari.watch(function(error, result) {
      //   // This will catch all Transfer events, regardless of how they originated.
      //   console.log("Event pari : ");
      //   console.log(result.args);
      // });
      var events = contratTierce.allEvents({});
      events.watch(function(error, result) {
        console.log(result.event);
        console.log(result.args);
      });

      // var eventCompPari = contratTierce.ComparaisonPari({ fromBlock:'latest' });
      // eventCompPari.watch(function(error, result) {
      //   //loggue chaque event
      //   console.log("Event comparaison pari  : ");
      //   console.log(Number(result.args.chevauxTierceGagnant[0]));
      //   console.log(Number(result.args.chevauxTierceGagnant[1]));
      //   console.log(Number(result.args.chevauxTierceGagnant[2]));
      //
      //   console.log(Number(result.args.chevauxPari[0]));
      //   console.log(Number(result.args.chevauxPari[1]));
      //   console.log(Number(result.args.chevauxPari[2]));
      // });



      var pari3EnErreur = false;
      var pari5EnErreur = false;
      var pari6EnErreur = false;

      contratTierce.initialiserCourse(chevauxEnCourse)
      .then(function(transactionId) {
        console.log("transactionId="+transactionId);
        console.log("pari 1");
        return contratTierce.parier(1, [4,3,10], {value: 300, gas: 2000000, from: account_one});
      })
      .then(function() {
        console.log("get info 1");
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        console.log("analyse info 1");
        assert.equal(courseDatas[0], 1, "L'id de la course dans le storage doit être 1");
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
        return contratTierce.parier(1, [6,10,8], {value: 200, gas: 2000000, from: account_two});
      })
      .then(function(){
        console.log("get info 2");
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        console.log("analyse info 2");
        assert.equal(courseDatas[1].valueOf(), 500, "Le montant total des paris de la course dans le storage doit être 300");
        console.log("pari 3");
        return contratTierce.parier(1, [12,3,2], {value: 1000, gas: 2000000, from: account_three});
      })
      .catch(function (err){
        console.log("catch 1");

        //l'erreur renvoyait quand on lance un throw depuis le contrat
        if(err.message.indexOf("VM Exception while executing transaction: invalid JUMP") !== -1){
          pari3EnErreur =true;
        }else{
          console.log(err);
        }
      })
      .then(function (){
        console.log("pari 4");
        return contratTierce.parier(1, [6,10,4], {value: 2000, gas: 2000000, from: account_four});
      })
      .then(function (){
        console.log("interdire pari");
        return contratTierce.interdireParis(1);
      })
      .then(function (){
        console.log("pari 5");
        return contratTierce.parier(1, [9,7,4], {value: 3000, gas: 2000000, from: account_five});
      })
      .catch(function (err){
        console.log("catch 2");

        //l'erreur renvoyée quand on lance un throw depuis le contrat
        if(err.message.indexOf("VM Exception while executing transaction: invalid JUMP") !== -1){
          pari5EnErreur =true;
        }else {
          console.log(err);
          assert.fail("Une erreur inattendue s'est produite "+ err.message);
        }
      })
      .then(function(){
        console.log("get info 3");
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        console.log("analyse info 3");
        assert.equal(courseDatas[1].valueOf(), 2500, "Le montant total des paris de la course dans le storage n'a pas bougé car le pari n'est pas passé");
        assert.equal(pari3EnErreur, true, "Le pari 3 ne devrait passé car les paris sont bloqués");
        assert.equal(pari5EnErreur, true, "Le pari 5 ne devrait pas être passé car il a misé sur le cheval 12 inexistant");
        assert.equal(courseDatas[4], true, "Les paris doivent être interdits sur la course");
        // eventPari.stopWatching();
        console.log("terminer course");
        return contratTierce.terminerCourse(1,[6,10,8]);
      })
      .then(function(){
        console.log("get info 4");
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        console.log("analyse info 4");
        assert.equal(courseDatas[2], true, "La course davrait être terminée");
        console.log("pari 6");
        return contratTierce.parier(1, [9,7,4], {value: 3000, gas: 2000000, from: account_one});
      })
      .catch(function(err){
        if(err.message.indexOf("VM Exception while executing transaction: invalid JUMP") !== -1){
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

  // NE FONCTIONNE PAS, AUCUNE TRANSACTION N'EST APPELEE SUR LE CONTRAT
   function initialiserParis(contratTierce){

     console.log("salut");
     contratTierce.initialiserCourse(chevauxEnCourse).catch(function(error){
       console.log("yop");
     })
     .then(function(transactionId) {
       console.log("when");
       return contratTierce.courseIDGenerator.call();
     })
     .then(function(lastCourseId){
       console.log("does this happen");
       courseId = Number(lastCourseId-1);
       return contratTierce.parier(courseId, [9,7,4], {value: 3000, gas: 2000000, from: account_one});
     })
     .then(function(){
       console.log("returning");
       return Promise.resolve(courseId);
     });
   }

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
      console.log("•••••••••••••••••••salut");
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
    // .then(function(courseId){
    //   return contratTierce.getInfosCourse.call(courseId);
    // })
    // .then(function(courseDatas){
    //   console.log("analyse course data");
    //   assert.equal(courseDatas[1].valueOf(), 3000, "Le montant total des paris de la course dans le storage n'a pas bougé car le pari n'est pas passé");
    //   assert.equal(true,true);
    //   done();
    // })

  });

});
