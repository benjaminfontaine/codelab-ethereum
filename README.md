# Codelab ethereum

## Pré-requis
Pour ce TP vous aurez besoin :

1. D'un éditeur de texte ou un IDE. S'il prend en charge le javascript c'est mieux.

2. D'une version récente de docker

3. Google chrome et [l'extension metamask](https://metamask.io/) (il n'est malheureusement pas encore disponible pour Firefox)

## Installation
```sh
git clone https://github.com/benjaminfontaine/codelab-ethereum.git
cd codelab-ethereum/horse-bet
```
Récupérez l'image docker via clef USB fournie en séance ou bien via :
```sh
docker pull francoiskha/codelab-ethereum

```
Installez [l'extension chrome metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

Vérifiez que tout fonctionne via en lançant depuis la racine du projet :
```sh
docker-compose up -d
docker-compose logs -f unit
```
Vous devez obtenir à la fin du log la mention `3 passing`
Lancez ensuite 
```
docker-compose logs -f web
```
Vous devez obtenir un log sans erreur avec, à la fin, la mention `Listening on port 9000`. Si besoin, [une capture complète du lancement du projet est disponible ici](horse-bet/BUILD.md)

## Plus de détails 
Pour construire l'image docker de zéro reportez vous [à la page dédiée](horse-bet/BUILD.md) (ne le faites pas en séance !).

Pour plus de détails sur l'architecture du projet, [consultez la page dédiée](horse-bet/OVERVIEW.md)

## Les commandes importantes :
Lancer tous les conteneurs (à faire au début)
```sh
docker-compose up
```
Lancer les tests unitaires
```sh
docker-compose run unit
```
Consulter les logs de l'application web (option `-f` pour `tail`)
```sh
docker-compose logs web 
```
Redémarrer l'application web
```sh
docker-compose restart web 
```

##Etape 1-1 : Le contrat - Création d'une course

Se mettre sur la branche Step 1-1.

     git checkout step1-1

S'il y a des modifications qui vous empêche de faire le switch de branche, faites un git stash.

Sur cette branche, le contrat est déjà crée, ainsi que son test unitaire.

Seulement, j'ai sadiquement supprimé certaines lignes de code, ce qui empèche les tests unitaires de fonctionner.

Les deux fichiers impactés sont :
- `contacts/MonTierce.sol` : le contract, qui va être le code déploié sur la blockchain et qui contiendra toutes les méthodes permettant de gérer des paris sur les courses. Ce contrat est écrit en SOLIDITY.
- `test/montierce.js` : son test unitaire, qui va utilisé Mocha et Chai pour fournir des tests unitaires et d'intégration sur notre contrat

Vous repérerez les zones corromptues par le pattern FIX_ME disséminé un peu partout dans le code.
Au dessus de ces FIX_ME, des TAGs INFO vous donneront les indications pour compléter les trous.

Vous pouvez tester la compilation du contrat en temps réel via :
https://ethereum.github.io/browser-solidity/


Les tests unitaires se lancent, à la racine du répertoire horse-bet par le biais de la commande :

```sh
docker-compose run unit
```
Depuis le répertoire `horse-bet`.

*Pour le debug*, c'est compliqué et rien n'est fourni de base.

Vous pouvez cependant utiliser [les events et les logs js](#le-debuggage-)

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

```sh
docker-compose start web
```

Consultez [http://localhost:9000](http://localhost:9000/) dans votre google chrome.

Cliquer sur l'icone de l'extension chrome Metamask en haut à droite de votre fenêtre (un renard orangé). 

Pour pouvoir interfacer l'extension chrome Metamask avec votre blockchain RPC, il faut le configurer.

Sur l'écran de connexion (écran disponible de base ou accessible via Menu Lock puis Back), choisir l'option *Restore existing Vault*.
Il vous sera demandé douze mots clés permettant de récupérer votre portefeuille ainsi qu'un nouveau mot de passe.

Pour se connecter au démon simulant une blockchain (testrpc), il rentrer les deux mots clés fournis au lancement de testrpc dans la partie Mnemonic (comme c'est un outil de test, ce sont toujours les mêmes) :

     HD Wallet
     ==================
     Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect

Une fois cette configuration effectuée, vous serez connecté sur la blockchain avec le compte par défaut (qui sera l'owner du contrat).

Vous aurez donc accès à l'interface spécifique du owner (création de course, blocage des paris, déclenchement de la fin de course).

Vous pouvez à tout moment changer d'utilisateur en faisant un switch account dans Metamask afin d'accèder, par la même url, à l'interface de pari et de récupération des gains.

Pour changer de compte, affichez la fenêtre de metamask, cliquez sur *Switch Accounts* en haut à droite, cliquez sur l'icône *+* pour faire apparaître les comptes préconfigurés par le daemon testrpc.

### Etape 4-1 : Intégration des smart-contrats à l'application

Placez vous sur la branche de cette nouvelle partie du TP :

     git checkout step4-1

Les endroits à modifier sont là encore marqués par des FIX_ME.

Cette branche est une version de l'application sans lien avec Ethereum.
C'est comme si on démarrait du project starter Angular2 (https://github.com/blacksonic/angular2-babel-esnext-starter), avec les quelques ajouts suivants :
- j'ai ajouté les répertoires *contracts* (nos fichiers .sol) et *migrations* (les scripts de déploiement Truffle) à la racine du projet.
- ainsi que les le fichier truffle.js pour que la configuration truffle soit prise en compte.

A partir de là, pour pouvoir utiliser nos smarts contracts dans l'application, la configuration est assez simple.

Tout d'abord, ajouter un loader webpack spécifique à Truffle *truffle-solidity-loader*.
Ce loader va automatiquement rendre disponible vos ABI Javascript (fichier .sol.js) dans le fichier vendor.js aggrégant toutes les sources Js de l'appli.

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


https://live.ether.camp/
https://benjifontaine.by.ether.camp/ide.html
