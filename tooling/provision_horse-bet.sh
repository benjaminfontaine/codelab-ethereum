#!/bin/sh
# Dépôts
#sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo bash -
curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
sudo apt-get update
# Git, node et le code	
sudo apt-get -y install git nodejs node-gyp
sudo npm i -g truffle@2.1.1
sudo npm i -g ethereumjs-testrpc@3.0.3
sudo npm i -g gulp-cli@3.9.1
sudo npm i -g gulp@3.9.1 
git clone https://github.com/benjaminfontaine/codelab-ethereum.git
cd codelab-ethereum/horse-bet 
npm i -D
chown -R ubuntu:ubuntu /home/ubuntu/codelab-ethereum