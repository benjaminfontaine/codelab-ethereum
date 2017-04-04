module.exports = function(deployer) {
  deployer.deploy(owned);
  deployer.autolink();
  deployer.deploy(mortal);
  deployer.autolink();
  deployer.deploy(MonTierce);


};
