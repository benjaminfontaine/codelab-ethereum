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

La version attendue est la 2.1.0

Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)

     npm install -g truffle

Image docker Linux / Mac
TODO

Image docker Windows
TODO

(TODO : tester l'install Windows)

### Installation de testrpc :
Pré-requis :
-nodejs 5+

La version attendue est la 3.0.0

Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)

     npm install -g ethereumjs-testrpc

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



##Récupération des sources
A cloner depuis le repo de ce codelab : [https://github.com/benjaminfontaine/codelab-ethereum]

     git clone https://github.com/benjaminfontaine/codelab-ethereum.git

###Etape 0 : Test du bon fonctionnement de vos Installation

Récupèrer la correction du TP1 :

     git checkout step1-final

Lancer testrpc avec l'option -d (déterministe) qui va faire que les comptes générés par testrpc auront toujours les mêmes clés (indispensable) pour le fonctionnement du test unitaire :

     testrpc -d

Puis lancer les tests truffle qui doivent passer :

    truffle test


##Etape 1 : Le contrat - Création et consultation d'une course

Se mettre sur la branche Step 1.

     git checkout step1

Le projet ainsi récupéré est déjà initialisé (NE PAS LES RELANCER, JUSTE POUR INFO [voir les étapes d'initialisation](#initialisation-projet))



L'arborescence de notre projet est constituée de :

- app => le répertoire contenant la partie WEB de notre D-app, qui contiendra le site en Angular 2

- build => fichier de l'IHM préts au déploiement du

   - contract => dossier où sont créer les fichier .sol.js qui sont des artifacts crées par un framework appelé Ether Pudding. Ces fichiers sont crées à partir d'une ABI, d'un binaire ou d'une adresse de contrat et vont permettre de s'interfacer facilement avec le contrat en Javascript.
- contracts => les sources .sol des contracts de votre D-app
- migration => les scripts de déploiement
- test => le fichier contenant les sources js de test Mocha et Chai de nos smart-contract
- truffle.js : le fichier de configuration de truffle


Le contrat est déjà crée, ainsi que son test unitaire.

Seulement, j'ai sadiquement supprimé certaines lignes de code qui empèche les tests unitaires de fonctionner.

Les fichiers impactés sont :
- `contacts/MonTierce.sol` : le contract
- `test/montierce.js` : son test unitaire

Vous repérerez les zones corromptues par le pattern FIX_ME disséminé un peu partout dans le code.
Au dessus de ces FIX_ME, des TAGs INFO vous donneront les indications pour compléter les trous.

Vous pouvez tester la compilation du contrat en temps réel via :
https://ethereum.github.io/browser-solidity/

Les tests unitaires se lancent, à la racine du répertoire horse-bet par le biais de la commande :
     truffle test

Truffle 2.1.0


Au terme de cette première partie de TP, les tests unitaires doivent être au vert.

Pour voir la correction de ce TP :

     git checkout step1-final

<details>
  <summary>SPOILER ALERT: solution de la copie de tableau dans la méthode initialiserCourse </summary>


```
        for(uint x= 0; x< chevauxParticipants.length; x++ ){
          courses[courseIDGenerator].chevauxEnCourse.push(chevauxParticipants[x]);
        }
```

</details>

## Etape 2 : Mise en place de la fonctionnalité de pari

Maintenant que nous pouvons créer et consulter les informations d'une course, nous pouvons passer à l'étape suivante : la fonctionnalité de parier.

Tout d'abord charger la deuxième partie du TP :

     git checkout step2

Deux méthodes ont fait leur apparition dans le contrat `contacts/MonTierce.sol`
- parier : méthode publique qui va permettre au parieur de miser un tierce une certaine somme d'argent. Stocke ce pari dans la course.
- interdireParis : méthode du propriètaire qui va bloquer la fonctionnalité de pari une fois la course démarrée


De la même manière que l'exercice 1, traquez les FIX_ME dans ce contrat afin qu'il compile et que le nouveau test unitaire du fichier `test/montierce.js`, lui aussi un peu troué passe.


Pour voir la correction de ce TP :

     git checkout step2-final



##Etape 3 : Implémentation de la méthode de fin de course.

Cette méthode doit parcourir tous les paris de la course, déterminer ceux qui sont gagnants, et d'envoyer le gain à tous les vainqueurs.

Vous devez commencer à avoir l'habitude, pour la troisième partie du TP, on lance :

     git checkout step3




Deux méthodes ont fait leur apparition dans le contrat `contacts/MonTierce.sol`
- terminerCourse : méthode du propriètaire qui va effectuer toutes les opérations de fin de course.

Concernant l'algorithme de distribution des gains.
C'est un algorithme maison dont je n'ai pas encore complétement testé la fiabilité.
Cependant, il permet de rétribuer chaque parieur en fonction de son type de gain (tierce, doublet ou unique) et du montant de sa mise.

La formule de calcul est la suivante :

     gain parieur = (mise * facteurGain * miseDesPerdants) / (somme pour tous les paris de (misePari * facteurGainPari))
où facteurGain est un nombre entre 0 et 100 qui varie en fonction du fait qu'il y ait ou pas des gagnants de chaque type.


De la même manière que les exercices 1 et 2, traquez les FIX_ME dans ce contrat afin qu'il compile et que le nouveau test unitaire du fichier `test/montierce.js`, lui aussi un peu troué passe.


Pour voir la correction de ce TP :

     git checkout step3-final

## Etape 4 : L'IHM
Nous voila de retour dans un domaine un peu plus connu, l'IHM de la D-app.
L'avantage de truffle c'est qu'il va utiliser le framework Javascript WEB3, avec la surcouche Ether Pudding pour appeler le contrat, depuis nos fichier js ou ts.
La bonne nouvelle, c'est que c'est exactement les mêmes surcouches qui sont utilisée dans les tests que nous avons fait jusqu'à présent.
Par conséquent, vous connaissez déjà la syntaxe.


##Etape 5 : Déploiement du contrat sur une blockchain privée (Optionnelle)
Utilisation du client geth pour monter une blockchain privée et configuration de Truffle pour l'utiliser.
Voir comment on autorise les transactions pour les paris


#Etape 6 : Sécurisation du smart contract
Application du pattern withdrawal.


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
##Initialisation projet
Initialiser le projet :

      truffle init

Créer un contrat :

      truffle create:contract MonTierce



https://live.ether.camp/
https://benjifontaine.by.ether.camp/ide.html
