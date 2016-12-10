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

    Pour ce TP, nous utiliserons Truffle parce qu'il était conseillé pour les débutants.

    Truffle va simplifier plusieurs étapes de réalistion de D-app (Decentralised application) :
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

- truffle.js : le fichier de configuration de truffle


###Installation de l'environnement de développement light via docker

Pour les premières étapes du tp vous avez juste de besoin de truffle et testrpc.
Nous avons fait une image Docker qui intégre ces deux outils.

Par contre, cette installation est insuffisante pour faire tourner l'ihm et vous devrez installer l'env de développement full pour la tester.

Pré-requis : la docker toolbox.

#### Lancement de testrpc :

      docker run -d -p 8545:8545 zenika/truffle-with-testrpc testrpc -d &

Récupérer l'ip  du host docker machine que vous utilisez
      $ docker-machine ls

      NAME      ACTIVE   DRIVER       STATE     URL                         SWARM
      default   *        virtualbox   Running   tcp://192.168.99.100:2376
      Then select one of the machines (the default one is called default) and:


      $ docker-machine ip default

      192.168.99.100


Et modifier la conf dans truffle.js :
```
rpc: {
   host: "192.168.99.100",//mon host docker :)
   port: 8545
 }
```
#### Lancement de truffle :

//imaginons être dans “horse-bet”

      docker run -it -v $(pwd):/app -w /app zenika/truffle-with-testrpc truffle test




## Installation de l'environnement de développement full :
Pré-requis :
- sur tous les environnements : nodejs 5+


### Pré-requis Windows : installer les outils pour rebuilder une obscure librairie npm


*Option 1: Installer tous les outils requis via npm (run as Administrator) :*

```
    npm install --global --production windows-build-tools
    npm install -g truffle
    npm install -g ethereumjs-testrpc
```
(cf. https://github.com/nodejs/node-gyp)

Option 2 manuelle : (si la 1 ne fonctionne pas)

- Installer package [Framework DotNet 4.6.1]

- Installer [Visual C++ Build Tools] (http://landinghub.visualstudio.com/visual-cpp-build-tools) - install par défaut.
- Installer Python 2.7
- Configurer Python
     run npm config set python python2.7
- Configurer la version du framework .NET à utiliser


     npm config set msvs_version 2015


-L'erreur OpenSSL n'empeche pas l'installation mais vous pouvez l'installer quand même au [lien suivant](https://wiki.openssl.org/index.php/Binaries)

-Pour résoudre les erreurs du type : 
```gyp ERR! stack Error: self signed certificate in certificate chain
gyp ERR! stack     at Error (native)
gyp ERR! stack     at TLSSocket.<anonymous> (_tls_wrap.js:1000:38)
gyp ERR! stack     at emitNone (events.js:67:13)
gyp ERR! stack     at TLSSocket.emit (events.js:166:7)
gyp ERR! stack     at TLSSocket._finishInit (_tls_wrap.js:567:8)
gyp ERR! System Windows_NT 6.1.7601
```

Définir une variable d'environnement (en mode quick & dirty) : 
```
set NODE_TLS_REJECT_UNAUTHORIZED="0"
export NODE_TLS_REJECT_UNAUTHORIZED=0
```


Lancer truffle dans un autre typ de terminal que celui par défaut car il peut y avoir des conflits Power shell, git bash ou babun


#### Installation des dépendances npm
Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)

     cd horse-bet
     npm install
     npm install -g gulp

Cette commande va installer toutes les dépendances npm du projet (truffle, ethereumjs-testrpc, angular2, webpack, gulp ...)



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


Depuis le répertoire `horse-bet`, lancer les tests en faisant : `docker run -it --rm -v $(pwd):/app -w /app zenika/truffle-with-testrpc truffle test`

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


#### Lancement de l'IHM

        npm install (si pas déjà fait)
        npm install gulp-cli -g
        npm install gulp -D (si pas déjà fait)
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



### Etape 4-1 : Intégration des smart-contrats à l'application

Placez vous sur la branche de cette nouvelle partie du TP :

     git checkout step4-1

Les endroits à modifier sont là encore marqués par des FIX_ME.

Cette branche est une version de l'application sans lien avec Ethereum.
C'est comme si on démarrait du project starter Angular2 (https://github.com/blacksonic/angular2-babel-esnext-starter), avec les quelques ajouts suivants :
- j'ai ajouté les répertoires *contracts* (nos fichiers .sol) et *migrations* (les scripts de déploiement Truffle) à la racine du projet.
- ainsi que les deux fichiers truffle.js et truffle-config.js pour que la configuration truffle soit prise en compte.

A partir de là, pour pouvoir utiliser nos smarts contracts dans l'application, la configuration est assez simple.

Tout d'abord, ajouter un loader webpack spécifique à Truffle *truffle-solidity-loader*.
Ce loader va automatiquement rendre disponible vos ABI Javascript (fichier .sol.js) dans le fichier vendor.js aggrégant toutes les sources Js de l'appli.

Pour cela, ajouter la ligne suivante dans les dépendances de votre package.json :

      ...
      "truffle-solidity-loader": "0.0.8",
      ...

Et faire un npm install

Puis modifier le fichier `tasks/config/webpack.js` en y référençant notre nouveau loader qui prendra en charge les fichiers .sol :
```
module: {
  loaders: [
    {
      ... ,

    {
      test: /\.json$/,
      loader: 'json'
    },
    {
      test: /\.sol/,
      loader: 'truffle-solidity'
    },
  ],
```

Vous pouvez maintenant utiliser faire appel à vos contrats dans les fichiers js.

Ouvrer le fichier `client/app/core/services/montierce/monTierce.service.js` qui centralise les appels au contrat dans l'application.

Importer le contrat en .sol (le truffle-solidity-loader se chargera pour vous de le rendre disponible en Js) :

     import MonTierce from "../../../../../contracts/MonTierce.sol";

Puis utiliser le contrat dans la méthode parier afin d'implémenter l'appel du pari.

C'est exactement la même syntaxe que le TU, sauf qu'il faut utiliser l'adresse window.web3.eth.defaultAccount dans le champs from.

Et voila, vous êtes maintenant un débutant aguerri dans le développement d'une application Ethereum.

Attention : les contrats développés dans le cadre de ce TP ne prennent pas en compte les bonnes pratique de sécurisation des contrats (parce que ça les complexifie beaucoup). Je vous encourage donc vivement à connaître et respecter ces régles listées sur la page suivante : https://github.com/ethereum/wiki/wiki/Safety lorsque vous vous lancerez dans l'aventure.

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
