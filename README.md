# Codelab-ethereum DevFest 2O16

##Installation de l'environnement de travail
Choix d'un framework de développement.
Deux principaux :
- embarkJS
- truffle
Et d'autres concurrent un peu moins connu mais qui montent petit à petit :
-dapple
(TODO trouver les autres)...

Pour ce TP, nous utiliserons Truffle.
Truffle va simplifier plusieurs étapes de réalistion de D-app :
- compilation intégrée de smart contract, linkink, déploiement et gestion des livrables,
- test automatisé des contracts avec Mocha (framework de test JS) et Chai (framework BDD),
- pipeline de build configurable et personnalisable,
- déploiements scriptables et framework de gestion de migration,
- gestion des blockchains de déploiement (public et privée),
- console interactive de communication avec les contrats,
- ...

Pour installer Truffle :
Pré-requis :
-nodejs 5+

Pour Linux, MacOS et Windows
(sous Windows, il est conseillé d'utiliser PowerShell ou git bash sont peine de conflit)
npm install -g truffle
(TODO : tester l'install Windows)

Choix d'un client Ethereum :
Plusieurs clients, à choisir selon vos goûts, car ils ont tous les mêmes fonctionnalités. Les principaux :
- Geth : client en GO (utilisé pour ce tp),
- Eth : en C++,
- Pyethapp : en python

J'ai choisi Geth pour ce tp.


##Récupération des sources
A cloner depuis ce repo : [https://github.com/benjaminfontaine/codelab-ethereum/tree/master/horse-bet]

##Etape 1
Description de l'arborescence du projet
- app : sources de la partie IHM de la D-app.
- build : contient les contrats compilés

## Etape 2 CRéation de la course
["0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "0x1123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "0x2123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"]


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
