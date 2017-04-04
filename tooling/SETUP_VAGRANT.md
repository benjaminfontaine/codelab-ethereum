# Plan B

Si votre machine ne parviens pas à gérer docker (oui, ça arrive), on vous propose un setup alternatif : monter une machine virtuelle plus classique.
* Installez virtualbox
* Installez vagrant
* Récupérez le fichier de la box :
	* En séance sur clef USB
	* hors séance [sur ce lien](http://dl.free.fr/rm.pl?h=oCTCWWoPk&i=82372531&s=qYljWEsza5KUQk1eetSyKT97fDTbmSMe)

Pour importer la box dans vagrant lancez la commande :
```bash
vagrant box add ./20170XXX_XXXXXX-ubuntu-xenial64-codelab-ethereum.box --name 20170XXX_XXXXXX-ubuntu-xenial64-codelab-ethereum
```
Elle doit ensuite figurer dans la liste des vagrant box de votre machine :
```bash
vagrant box list
```
renvoit 
```
20170XXX_XXXXXX-ubuntu-xenial64-codelab-ethereum          (virtualbox, 0)
```

Placez vous ensuite dans le répertoire `codelab-ethereum` du projet puis lancez la commande :
```bash
vagrant up
```
Une fois la VM lancez, connectez vous via la commande :
```bash
vagrant ssh
```
Vous avez maintenant un shell ouvert sur la machine.
Placez vous dans le répertoire `/vagrant/horse-bet` vous y trouverez le montage du répertoire du projet.
Vous pouvez y lancer toutes les commandes `docker-compose` du projet, rejoignez le [README.md](../README.md) pour continuer le TP.