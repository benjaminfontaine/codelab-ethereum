#!/bin/sh
# Dépôts
sudo 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
sudo apt-get update
## Google Chrome, pour tester le setup avec metamask
sudo apt-get -y install google-chrome-stable xfce4 virtualbox-guest-additions-iso virtualbox-guest-dkms virtualbox-guest-x11
sudo 'echo "allowed_users=anybody" >> /etc/X11/Xwrapper.config'
sudo usermod -a -G video vagrant || :
sudo usermod -a -G video ubuntu || :
sudo usermod -a -G audio vagrant || :
sudo usermod -a -G audio ubuntu || :