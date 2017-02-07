#!/bin/sh
# Dépôts
sudo 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo bash -
sudo apt-get update
## Google Chrome, pour tester le setup avec metamask
sudo apt-get -y install google-chrome-stable