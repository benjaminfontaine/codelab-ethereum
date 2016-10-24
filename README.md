# Codelab-ethereum DevFest 2O16

##Présentation et installation de l'environnement de travail
Nous allons développer notre premier smart contract au sein d'un environnement de développement propre à Ethereum.
Pour ce TP, vous aurez besoin :
1. De votre IDE préféré qui gère le javascript, de préférence.

2. D'un client/node blockchain

    Plusieurs clients, à choisir selon vos goûts, car ils ont tous les mêmes fonctionnalités. Les principaux :

    * Geth : client en GO (utilisé pour ce tp),
    * Eth : en C++,
    * Pyethapp : en python


3. D'un framework de développement

   Trois principaux :

    * embarkJS
    * truffle
    * dapple

    Pour ce TP, nous utiliserons Truffle parce qu'i était conseillé pour les débutants.

    Truffle va simplifier plusieurs étapes de réalistion de D-app :
   - compilation intégrée de smart contract, linkink, déploiement et gestion des livrables,
   - test automatisé des contracts avec Mocha (framework de test JS) et Chai (framework BDD),
   - pipeline de build configurable et personnalisable,
   - déploiements scriptables et framework de gestion de migration,
   - gestion des blockchains de déploiement (public et privée),
   - console interactive de communication avec les contrats ...

### Installation de Truffle :
Pré-requis :
-nodejs 5+

Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)

     npm install -g truffle

Image docker Linux / Mac
TODO

Image docker Windows
TODO

(TODO : tester l'install Windows)

### Installation de Geth

#### Mac
Lien d'installation :
https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Mac

Image docker : TODO

#### Ubuntu
Lien d'installation :
https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu

Image docker : TODO


#### Windows
Lien d'installation : https://github.com/ethereum/go-ethereum/wiki/Installation-instructions-for-Windows

Image docker :
TODO

(TODO : tester l'install Windows)

### Installation de testrpc :
Pré-requis :
-nodejs 5+

Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)

     npm install -g ethereumjs-testrpc

Image docker Linux / Mac
TODO

Image docker Windows
TODO

(TODO : tester l'install Windows)

##Récupération des sources
A cloner depuis le repo de ce codelab : [https://github.com/benjaminfontaine/codelab-ethereum/tree/master/horse-bet]

     git clone https://github.com/benjaminfontaine/codelab-ethereum/tree/master/horse-bet

##Etape 1

Se mettre sur la branche Step 1.

     git checkout step1

Cette branche est le résultat des commandes suivantes :

      truffle init

Qui va créer l'arborescence de notre projet :

- app => le répertoire contenant la partie WEB de notre D-app, qui contiendra le site en Angular 2

- build => fichier de l'IHM préts au déploiement du

   - contract => dossier où sont créer les fichier .sol.js qui sont des artifacts crées par un framework appelé Ether Pudding. Ces fichiers sont crées à partir d'une ABI, d'un binaire ou d'une adresse de contrat et vont permettre de s'interfacer facilement avec le contrat en Javascript.
- contracts => les sources .sol des contracts de votre D-app
- migration => les scripts de déploiement
- test => le fichier contenant les sources js de test Mocha et Chai de nos smart-contract
- truffle.js : le fichier de configuration de truffle


      truffle create:contract MonTierce

Qui va permettre de créer le contract.

Ce repo contient aussi un test unitaire qui va tester les premières méthodes de notre contrat.

Description de l'arborescence du projet
- app : sources de la partie IHM de la D-app.
- build : contient les contrats compilés

## Etape 2 : Création et consultation d'une course
Sur la base du test unitaire présent On a un test unitaire, il faut maintenant créer le contrat et les méthodes de création et de consultation qui permettront de le faire passer.



Pour avoir une compilation en temps réel de votre contract, vous pouvez utiliser votre navigateur à l'adresse suivante :
https://ethereum.github.io/browser-solidity/#version=soljson-v0.3.6+commit.3fc68da.js


##Etape 2
Implémentation de la fonctionnalité de récupération des infos de la Course

##Etape 3
Implémentation de la fonctionnalité de la méthode parieurs.
Le but du jeu est que le TU passes

##Etape4
Implémentation de la méthode de fin de course.
Cette méthode doit parcourir tous les paris de la course, déterminer ceux qui sont gagnants.
Et mettre à disposition le gain de chaque vainqueur dans une structure de données afin que chque parieurs puisse venir le récupérer (pattern withdrawal).

##Etape5
Déploiement du contrat sur blockchain public + test via testrpc, une blockchain de test in memory.
Installation :

npm install -g ethereumjs-testrpc


Test :

##Etape 6 (Optionnelle)
Déploiement et test en live en live sur la blockchain de test Ethereum :
Très compliqué à moins d'avoir déjà téléchargé la blockchain de test (prendre au moins 6h).


#Etape 7 (Optionnelle)
Sécurisation du smart contract, application du pattern withdrawal.

#Annexe : Interagir en mode console
//TODO : remplacer par des vrais appels à notre contrat
// get the deployed version of our contract
truffle(default)> var poe = ProofOfExistence1.deployed()
// and print its address
truffle(default)> console.log(poe.address)
0x3d3bce79cccc331e9e095e8985def13651a86004
// let's register our first "document"
truffle(default)> poe.notarize('An amazing idea')
Promise { <pending> }
// let's now get the proof for that document
truffle(default)> poe.calculateProof('An amazing idea').then(console.log)
Promise { <pending> }
0xa3287ff8d1abde95498962c4e1dd2f50a9f75bd8810bd591a64a387b93580ee7
// To check if the contract's state was correctly changed:
truffle(default)> poe.proof().then(console.log)
0xa3287ff8d1abde95498962c4e1dd2f50a9f75bd8810bd591a64a387b93580ee7
// The hash matches the one we previously calculated


#Annexes
## Le debuggage :
Créer un event pour pouvoir debugger votre contrat :
Dans le test unitaire ou votre IHM :
```javascript
var eventPari = contratTierce.Parier({});
eventPari.watch(function(error, result) {
  // This will catch all Transfer events, regardless of how they originated.
  console.log("Event pari : ");
  console.log(result.args);
});
```

Dans votre smart-contract :
```solidity
...
event Parier(uint idCourse, uint32[3] chevauxTierce, address messageSender, uint mise, uint senderBalance);

function parier(uint idCourse, uint32[3] chevauxTierce) public returns(bool pariPrisEnCompte){
 Parier(idCourse, chevauxTierce, msg.sender, msg.value, msg.sender.balance);

 if(msg.sender.balance < msg.value){
   throw;
 }
 ...
}
```
