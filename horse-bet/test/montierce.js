contract('MonTierce', function(accounts) {

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


    it("lorsque quelqu'un parie, cela doit modifier le montantTotalMises, sauf si les paris sont bloqués", function(done) {
      var contratTierce = MonTierce.deployed();
      var chevauxEnCourse = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var idCourseParTransaction = {};
      //récupère tous les events InitialisationCourse du dernier block
      var eventInitCourse = contratTierce.InitialisationCourse({ fromBlock:'latest' });
      eventInitCourse.watch(function(error, result) {
        //loggue chaque event
        console.log("Event init course : ");
        console.log(result.args);
      });

      //pas de filtre, va tout loguer
      var eventPari = contratTierce.Parier({});
      eventPari.watch(function(error, result) {
        // This will catch all Transfer events, regardless of how they originated.
        console.log("Event pari : ");
        console.log(result.args);
      });

      var account_one = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
      var account_two = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0";
      var account_three = "0x22d491bde2303f2f43325b2108d26f1eaba1e32b";
      var account_four = "0xe11ba2b4d45eaed5996cd0823791e0c93114882d";
      var account_five = "0xd03ea8624c8c5987235048901fb614fdca89b117";

      var pari3EnErreur = false;
      var pari5EnErreur = false;

      contratTierce.initialiserCourse(chevauxEnCourse)
      .then(function(transactionId) {
        console.log("transactionId="+transactionId);
        return contratTierce.parier(1, [4,3,10], {value: 300, gas: 2000000});
      })
      .then(function() {
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        assert.equal(courseDatas[0], 1, "L'id de la course dans le storage doit être 0");
        assert.equal(courseDatas[1].valueOf(), 300, "Le montant total des paris de la course dans le storage doit être 300");
        assert.equal(courseDatas[2], false, "La course ne doit pas être terminée");
        //web3 renvoie des BigInteger pour les uint, il faut donc les convertir en nombre standards
        var chevauxEnCourseRetournes = [];
        for(var i = 0 ; i < courseDatas[3].length; i++){
          chevauxEnCourseRetournes.push(Number(courseDatas[3][i]));
        }
        assert.deepEqual(chevauxEnCourseRetournes, chevauxEnCourse, "Les chevaux en course dans le storage doivent être ceux passés à l'initialisation");
        assert.equal(courseDatas[4], false, "Les paris doivent être autorisés sur la course");
        eventInitCourse.stopWatching();
        return contratTierce.parier(1, [6,10,8], {value: 200, gas: 2000000, from: account_two});
      })
      .then(function(){
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        assert.equal(courseDatas[1].valueOf(), 500, "Le montant total des paris de la course dans le storage doit être 300");
        return contratTierce.parier(1, [12,3,2], {value: 1000, gas: 2000000, from: account_three});
      })
      .catch(function (err){
        //l'erreur renvoyait quand on lance un throw depuis le contrat
        if(err.message.indexOf("VM Exception while executing transaction: invalid JUMP") !== -1){
          pari3EnErreur =true;
        }
      })
      .then(function (){
        return contratTierce.parier(1, [9,7,4], {value: 2000, gas: 2000000, from: account_four});
      })
      .then(function (){
        return contratTierce.interdireParis(1);
      })
      .then(function (){
        return contratTierce.parier(1, [9,7,4], {value: 3000, gas: 2000000, from: account_five});
      })
      .catch(function (err){
        //l'erreur renvoyait quand on lance un throw depuis le contrat
        if(err.message.indexOf("VM Exception while executing transaction: invalid JUMP") !== -1){
          pari5EnErreur =true;
        }
      })
      .then(function(){
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        assert.equal(courseDatas[1].valueOf(), 2500, "Le montant total des paris de la course dans le storage n'a pas bougé car le pari n'est pas passé");
        assert.equal(pari3EnErreur, true, "Le pari 3 ne devrait passé car les paris sont bloqués");
        assert.equal(pari5EnErreur, true, "Le pari 5 ne devrait pas être passé car il a misé sur le cheval 12 inexistant");
        assert.equal(courseDatas[4], true, "Les paris doivent être interdits sur la course");
        eventPari.stopWatching();
        return contratTierce.terminerCourse(1,[6,10,8]);
      })
      .then(function(){
        return contratTierce.getInfosCourse.call(1);
      })
      .then(function(courseDatas){
        assert.equal(courseDatas[2], true, "La course davrait être terminée");
        done();
      })
      .catch(function(err){
        console.log(err);
        done();
      });
    });


  });
