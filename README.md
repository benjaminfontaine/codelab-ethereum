# Codelab-ethereum DevFest 2O16

## Présentation  de l'environnement de travail
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

## Arborescence du projet

A cloner depuis le repo de ce codelab : [https://github.com/benjaminfontaine/codelab-ethereum]

     git clone https://github.com/benjaminfontaine/codelab-ethereum.git

Ensuite aller dans le répertoire horse-bet pour découvrir le code final de notre application :
     cd horse-bet


L'arborescence de notre projet est constituée de :

- .truffle-solidity-loader : fichier .sol.js qui sont des artifacts crées par un framework appelé Ether Pudding. Ces fichiers sont crées à partir d'une ABI, d'un binaire ou d'une adresse de contrat et vont permettre de s'interfacer facilement avec le contrat en Javascript,

- build => répertoire de travail de truffle

- client => le répertoire contenant la partie WEB de notre D-app, qui contient donc le site en Angular 2

- contracts => dossier où sont stockés les smart-contracts de notre D-app en Solidity (.sol)

- migrations => les scripts de déploiement des smart-contract sur la blockchain

- test => le fichier contenant les sources js de test Mocha et Chai de nos smart-contract

- server : sources et configuration du serveur koa qui sert l'ihm

- tasks : tasks gulp servant à automatiser le déploiement de notre application

- test : test unitaire sur nos smart-contract

- truffle.js : le fichier de configuration de truffle


## Installation de l'environnement de développement :
Pré-requis :
- sur tous les environnements : nodejs 5+


### Pré-requis Windows : installer les outils pour rebuilder une obscure librairie npm

*Option 1: Installer tous les outils requis via npm (run as Administrator) :*

    npm install --global --production

Option 2 manuelle : (si la 1 ne fonctionne pas)

- Installer package [Framework DotNet 4.6.1]

- Installer [Visual C++ Build Tools] (http://landinghub.visualstudio.com/visual-cpp-build-tools) - install par défaut.
- Installer Python 2.7
- Configurer Python
     run npm config set python python2.7
- Configurer la version du framework .NET à utiliser

     npm config set msvs_version 2015

-L'erreur OpenSSL n'empeche pas l'installation mais vous pouvez l'installer quand même au [lien suivant](https://wiki.openssl.org/index.php/Binaries)


Lancer truffle dans un autre typ de terminal que celui par défaut car il peut y avoir des conflits Power shell, git bash ou babun


#### Installation des dépendances npm
Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)

     cd horse-bet
     npm install
     npm install -g gulp

Cette commande va installer toutes les dépendances npm du projet (truffle, ethereumjs-testrpc, angular2, webpack, gulp ...)


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

### Installation de Chrome et du plugin Metamask

Installez le navigateur Chrome et le plugin [Metamask](https://metamask.io/)



### Test de l'application

Récupèrer la version finale du projet :

     git checkout master

Lancer testrpc avec l'option -d (déterministe) qui va faire que les comptes générés par testrpc auront toujours les mêmes clés (indispensable) pour le fonctionnement du test unitaire :

     testrpc -d


#### Lancement des tests unitaires
Puis lancer les tests truffle qui doivent passer :

    truffle test

#### Lancement de l'IHM

    npm install (si pas déjà fait)
    npm install -g gulp (si pas déjà fait)
    gulp serve

Cela lance une url [localhost:9000](http://localhost:9000/) dans votre navigateur web favori.
Mais *ouvrez la plutôt avec Chrome* car nous aurons besoin du plugin Metamask.

Cliquer sur l'icone du plugin Metamask en haut à droite de votre fenêtre (un renard orangé).

Pour qu'une IHM de D-app fonctionne, elle doit être interfacée avec un portefeuille contenant les comptes et les clés privée des utilisateurs. Sans cet interfaçage avec le portefeuille, l'utilisateur ne peut pas signer ses transactions et donc, par extension, pas interagir avec une blockchain.

A l'heure actuelle, il y a deux solutions : *Metamask* qui permet d'ajouter un portefeuille ultra léger à Chrome (il ne télécharge pas de blockchain) et le navigateur dédie *Mist* qui se veut être l'appstore des D-apps.

Le plugin Metamask va permettre à une application web qui utilise la librairie js web3, de se connecter à un compte d'un portefeuille de n'importe quelle blockchain (rpc, 
privée, morden ou la principale).

Pour pouvoir interfacer le plugin Metamask avec votre blockchain RPC, il faut le configurer.

Sur l'écran de connexion (écran disponible de base ou accessible via Menu Lock puis Back), choisir l'option 'Restore existing Vault'.
Il vous sera demandé douze mots clés permettant de récupérer votre portefeuille ainsi qu'un nouveau mot de passe.

Pour se connecter au testrpc local, rentrer les deux mots clés fournis au lancement de testrpc dans la partie Mnemonic :

     HD Wallet
     ==================
     Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect

Une fois cette configuration effectuée, vous serez connecté sur la blockchain avec le compte par défaut (qui sera l'owner du contrat).

Vous aurez donc accès à l'interface spécifique du owner (création de course, blocage des paris, déclenchement de la fin de course).

Vous pouvez à tout moment changer d'utilisateur en faisant un switch account dans Metamask afin d'accèder, par la même url, à l'interface de pari et de récupération des gains.



#Démarrage du TP

##Etape 1-1 : Le contrat - Création d'une course

Se mettre sur la branche Step 1-1.

     git checkout step1-1

S'il y a des modifications qui vous empêche de faire le switch de branche, faites un git stash.


Sur cette branche, le contrat est déjà crée, ainsi que son test unitaire.

Seulement, j'ai sadiquement supprimé certaines lignes de code qui empèche les tests unitaires de fonctionner.

Les deux fichiers impactés sont :
- `contacts/MonTierce.sol` : le contract, qui va être le code déploié sur la blockchain et qui contiendra toutes les méthodes permettant de gérer des paris sur les courses. Ce contrat est écrit en SOLIDITY.
- `test/montierce.js` : son test unitaire, qui va utilisé Mocha et Chai pour fournir des tests unitaires et d'intégration sur notre contrat

Vous repérerez les zones corromptues par le pattern FIX_ME disséminé un peu partout dans le code.
Au dessus de ces FIX_ME, des TAGs INFO vous donneront les indications pour compléter les trous.

Vous pouvez tester la compilation du contrat en temps réel via :
https://ethereum.github.io/browser-solidity/

Les tests unitaires se lancent, à la racine du répertoire horse-bet par le biais de la commande :

     truffle test


*Pour le debug*, c'est compliqué et rien n'est fourni de base.

Vous pouvez cependant utiliser [les events et les logs js](#le-debuggage)

Au terme de cette première partie de TP, les tests unitaires doivent être au vert.


Pour voir la correction de ce TP :

     git checkout step1-1c


<details>
  <summary>SPOILER ALERT: solution de la copie de tableau dans la méthode initialiserCourse </summary>


```
        for(uint x= 0; x< chevauxParticipants.length; x++ ){
          courses[courseIDGenerator].chevauxEnCourse.push(chevauxParticipants[x]);
        }
```

</details>


##Etape 1-2 : Le contrat - Consultation d'une course

Se mettre sur la branche Step 1-2.

     git checkout step1-2

Dans cette partie, nous avons rajouté une méthode getInfosCourse dans le contrat `contacts/MonTierce.sol`. Cette méthode va permettre de consulter des données sur une course.
Pas de FIX_ME dans le code de ce contrat.
Par contre, le test unitaire `test/montierce.js`, en appliquant le même principe vicieux que précedemment, nécessite d'être complété pour fonctionner.



Pour voir la correction de ce TP :

     git checkout step1-2c




## Etape 2 : Le contrat - Mise en place de la fonctionnalité de pari

Maintenant que nous pouvons créer et consulter les informations d'une course, nous pouvons passer à l'étape suivante : la fonctionnalité de parier.

### Etape 2-1 - La fonction parier

Tout d'abord charger la deuxième partie du TP :

     git checkout step2-1

Une nouvelle méthode a fait son apparition dans le contrat `contacts/MonTierce.sol`
- parier : méthode publique qui va permettre au parieur de miser un tierce une certaine somme d'argent. Stocke ce pari dans la course.


De la même manière que l'exercice 1, traquez les FIX_ME dans ce contrat afin qu'il compile et que le nouveau test unitaire du fichier `test/montierce.js` passe.


Pour voir la correction de ce TP :

     git checkout step2-1
     
     
### Etape 2-2 - La fonction interdirePari

     git checkout step2-2

Une nouvelle méthode a fait son apparition dans le contrat `contacts/MonTierce.sol`
- interdireParis : méthode du propriètaire qui va bloquer la fonctionnalité de pari une fois la course démarrée

Cette fois-ci, c'est notre TU qu'il va falloir réparer, dans `test/montierce.js`.

Pour voir la correction de ce TP :

     git checkout step2-2c
   
   

##Etape 3 : Le contrat - Implémentation de la méthode de fin de course.

Cette méthode doit parcourir tous les paris de la course, déterminer ceux qui sont gagnants, et d'envoyer le gain à tous les vainqueurs.

Vous devez commencer à avoir l'habitude, pour la troisième partie du TP, on lance :

     git checkout step3-1


Deux méthodes ont fait leur apparition dans le contrat `contacts/MonTierce.sol`
- terminerCourse : méthode du propriètaire qui va effectuer toutes les opérations de fin de course.
- annulerParis : méthode qui va rendre leur argent aux parieurs si personne n'a gagné ou s'il y a un soucis sur la course

Concernant l'algorithme de distribution des gains.
C'est un algorithme maison dont je n'ai pas encore complétement testé la fiabilité.
Cependant, il permet de rétribuer chaque parieur en fonction de son type de gain (tierce, doublet ou unique) et du montant de sa mise.

La formule de calcul est la suivante :

     gain parieur = (mise * facteurGain * miseDesPerdants) / (somme pour tous les paris de (misePari * facteurGainPari))
où facteurGain est un nombre entre 0 et 100 qui varie en fonction du fait qu'il y ait ou pas des gagnants de chaque type.


De la même manière que les exercices 1 et 2, traquez les FIX_ME dans ce contrat afin qu'il compile et que le nouveau test unitaire du fichier `test/montierce.js` passe.


Pour voir la correction de ce TP :

     git checkout step3-1c


## Etape 4 : L'IHM
Nous voila de retour dans un domaine un peu plus connu, l'IHM de la D-app.
L'avantage de truffle c'est qu'il va utiliser le framework Javascript WEB3, avec la surcouche Ether Pudding pour appeler le contrat, depuis nos fichier js ou ts.
La bonne nouvelle, c'est que c'est exactement les mêmes surcouches qui sont utilisée dans les tests que nous avons fait jusqu'à présent.
Par conséquent, vous connaissez déjà la syntaxe.

L'IHM est en Angular 2 mais libre à vous d'utiliser n'importe quelle autre techno web.
J'ai utilisé la base du projet https://github.com/blacksonic/angular2-babel-esnext-starter pour notre IHM.

Cela fournit une IHM Angular de base en ES6, servie par un serveur koa, avec liveReload et contruite avec gulp et webpack.

Pour la lancer : 

    npm install (si pas déjà fait)
    npm install -g gulp (si pas déjà fait)
    gulp serve

### Etape 4-1 : Intégration des smart-contrats à l'application





##Etape 5 : Déploiement du contrat sur une blockchain privée (Optionnelle)
Utilisation du client geth pour monter une blockchain privée et configuration de Truffle pour l'utiliser.

Création d'une blockchain de test privée :

    geth --dev

Brancher le plugin Metamask sur cette nouvelle blockchain.

#Etape 6 : Sécurisation du smart contract
Application du pattern withdrawal.

//TODO



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
