contract('MonTierce', function(accounts) {

  it("doit garder une struct Course dans le storage lorsque l'on appelle la méthode init", function() {
    var contratTierce = MonTierce.deployed();
    var chevauxEnCourse = ["0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "0x1123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "0x2123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"];
    return contratTierce.initialiserCourse.call(chevauxEnCourse).then(function(idCourse) {
      assert.equal(idCourse.valueOf(), 0, "L'id de la course doit être 0'");
      contratTierce.getInfosCourse.call(idCourse).then(function(courseDatas){
        assert.equal(courseDatas[0], 0, "L'id de la course dans le storage doit être 0");
        assert.equal(courseDatas[1], 0, "Le montant total des paris de la course dans le storage doit être 0");
        assert.equal(courseDatas[2], false, "La course ne doit pas être terminée");
        assert.equal(courseDatas[3], chevauxEnCourse, "Les chevaux en course dans le storage doivent être ceux passés à l'initialisation");
        assert.equal(courseDatas[4], false, "Les paris doivent être autorisés sur la course");
      });

    });
  });





});
