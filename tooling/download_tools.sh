#!/bin/sh
mkdir tools
COMMANDS="'wget https://github.com/MetaMask/metamask-plugin/releases/download/v3.5.2/metamask-chrome-3.5.2.zip -P tools -q' \
'wget https://github.com/MetaMask/metamask-plugin/releases/download/v3.5.2/metamask-firefox-3.5.2.zip -P tools -q' \
'wget https://github.com/MetaMask/metamask-plugin/releases/download/v3.5.2/metamask-edge-3.5.2.zip -P tools -q' \
'wget https://download.docker.com/mac/stable/Docker.dmg -O tools/`date +%Y%m%d_%H%M%S`_Docker_native_macosx.dmg -q' \
'wget https://download.docker.com/win/stable/InstallDocker.msi -O tools/`date +%Y%m%d_%H%M%S`_Docker_native_win.msi -q' \
'wget https://download.docker.com/mac/stable/DockerToolbox.pkg -O tools/`date +%Y%m%d_%H%M%S`_Docker_toolbox_win.pkg -q' \
'wget https://download.docker.com/win/stable/DockerToolbox.exe -O tools/`date +%Y%m%d_%H%M%S`_Docker_toolbox_win.exe -q' \
'wget http://download.virtualbox.org/virtualbox/5.1.18/VirtualBox-5.1.18-114002-Win.exe -O tools/`date +%Y%m%d_%H%M%S`_VirtualBox-5.1.18-114002-Win.exe -q' \
'wget http://download.virtualbox.org/virtualbox/5.1.18/VirtualBox-5.1.18-114002-OSX.dmg -O tools/`date +%Y%m%d_%H%M%S`_VirtualBox-5.1.18-114002-OSX.dmg -q' \
'wget http://download.virtualbox.org/virtualbox/5.1.18/virtualbox-5.1_5.1.18-114002~Ubuntu~xenial_amd64.deb -O tools/`date +%Y%m%d_%H%M%S`_virtualbox-5.1_5.1.18-114002~Ubuntu~xenial_amd64.deb -q' \
'wget https://releases.hashicorp.com/vagrant/1.9.3/vagrant_1.9.3.msi -O tools/`date +%Y%m%d_%H%M%S`_vagrant_1.9.3.msi -q' \
'wget https://releases.hashicorp.com/vagrant/1.9.3/vagrant_1.9.3_x86_64.deb -O tools/`date +%Y%m%d_%H%M%S`_vagrant_1.9.3_x86_64.deb -q' \
'wget https://releases.hashicorp.com/vagrant/1.9.3/vagrant_1.9.3_x86_64.dmg -O tools/`date +%Y%m%d_%H%M%S`_vagrant_1.9.3_x86_64.dmg -q'"

echo $COMMANDS | xargs -n 1 -P 8 sh -c 