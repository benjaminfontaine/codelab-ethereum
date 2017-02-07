#!/bin/sh
# Dépôts
#sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo bash -
curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
sudo apt-get update
# Git, node et le code	
sudo apt-get -y install git nodejs node-gyp
sudo npm i -g truffle
sudo npm i -g ethereumjs-testrpc
sudo npm i -g gulp-cli
sudo npm i -g gulp 
git clone https://github.com/benjaminfontaine/codelab-ethereum.git
cd codelab-ethereum/horse-bet 
npm i -D
chown -R ubuntu:ubuntu /home/ubuntu/codelab-ethereum