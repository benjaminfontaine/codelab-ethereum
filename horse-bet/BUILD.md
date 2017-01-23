# Construction et lancement du projet

## Construire l'image docker

Pour les sessions de ce TP, l'image sera disponible en ligne et par clef USB. Elle contient *tout* ce dont nous auront besoin :
* Les outils : npm, truffle, ethereumjs-testrpc, gulp etc.
* Les dépendances npm du projet dans `/usr/src/node_modules`

Pour la construire, dans le répetoire du projet :
```sh
docker build -t codelab-ethereum .
```

## lancement de conteneurs

```sh
docker-compose up -d
```
### Vérifier que lest tests unitaires passent
```sh
docker-compose logs unit
```
Vous devez obtenir à la fin :
```3 passing ```

### Vérifier que l'application web se lance
```sh
docker-compose logs web
```
Vous devez obtenir une trace sans erreur

```
[14:05:32] Using gulpfile /usr/src/app/gulpfile.js
[14:05:32] Starting 'serve'...
[14:05:32] Starting 'clean'...
[14:05:32] Finished 'clean' after 36 ms
[14:05:32] Starting 'client-build'...
[14:05:32] Starting 'client-copy'...
[14:05:32] Starting 'client-stylesheet'...
[14:05:32] Starting 'livereload'...
[14:05:32] Finished 'livereload' after 3.38 ms
[14:05:32] Starting 'client-stylesheet-watch'...
[14:05:32] Finished 'client-stylesheet-watch' after 65 ms
[14:05:33] Finished 'client-stylesheet' after 833 ms
[TRUFFLE SOLIDITY] Writing temporary contract build artifacts to /usr/src/app/.truffle-solidity-loader
[14:05:38] Finished 'client-copy' after 5.34 s
[TRUFFLE SOLIDITY] Compiling MonTierce.sol...
[TRUFFLE SOLIDITY] Compiling MonTierceLib.sol...
[TRUFFLE SOLIDITY] Compiling mortal.sol...
[TRUFFLE SOLIDITY] Compiling owned.sol...
[TRUFFLE SOLIDITY] Writing artifacts to ./.truffle-solidity-loader
[TRUFFLE SOLIDITY] COMPILATION FINISHED
[TRUFFLE SOLIDITY] RUNNING MIGRATIONS
[TRUFFLE SOLIDITY] Running migration: 1_initial_migration.js
[TRUFFLE SOLIDITY]   Deploying Migrations...
[TRUFFLE SOLIDITY]   Migrations: 0xe982e462b094850f12af94d21d470e21be9d0e9c
[TRUFFLE SOLIDITY] Saving successful migration to network...
[TRUFFLE SOLIDITY] Saving artifacts...
[TRUFFLE SOLIDITY] Running migration: 2_deploy_contracts.js
[TRUFFLE SOLIDITY]   Deploying MonTierceLib...
[TRUFFLE SOLIDITY]   MonTierceLib: 0x0290fb167208af455bb137780163b7b7a9a10c16
[TRUFFLE SOLIDITY]   Deploying owned...
[TRUFFLE SOLIDITY]   owned: 0x9b1f7f645351af3631a656421ed2e40f2802e6c0
[TRUFFLE SOLIDITY]   Deploying mortal...
[TRUFFLE SOLIDITY]   mortal: 0x67b5656d60a809915323bf2c40a8bef15a152e3e
[TRUFFLE SOLIDITY]   Deploying MonTierce...
[TRUFFLE SOLIDITY]   MonTierce: 0x2612af3a521c2df9eaf28422ca335b04adf3ac66
[TRUFFLE SOLIDITY] Saving successful migration to network...
[TRUFFLE SOLIDITY] Saving artifacts...
here undefined
[14:05:48] Finished 'client-build' after 16 s
[14:05:48] Starting 'server-start'...
[14:05:48] Finished 'server-start' after 44 ms
[14:05:48] Finished 'serve' after 16 s
[14:05:48] [nodemon] 1.11.0
[14:05:48] [nodemon] to restart at any time, enter `rs`
[14:05:48] [nodemon] watching: /usr/src/app/server/**/*
[14:05:48] [nodemon] starting `node server/index.js`
Listening on port 9000
```

## Debug de l'image docker

Décommenter si besoin la conf du conteneur `command`, puis :
`docker-compose run -p 9000:9000 -p 35729:35729 command`

## Initialisation projet
Pour initialiser le projet on a exécuté :
```sh
      truffle init
```
Pour créer un contrat :
```sh
      truffle create:contract MonTierce
```
## Notes

Le truffle-solidity-loader utilise une connexion à 127.0.0.1:8545, même lorsque l'on change [la conf du loader comme spécifié](https://github.com/ConsenSys/truffle-solidity-loader#installation) et/ou [la conf des networks dans truffle.js](http://truffleframework.com/docs/advanced/configuration). D'où l'utilisation inélégante d'un port forward TCP via `socat`.
