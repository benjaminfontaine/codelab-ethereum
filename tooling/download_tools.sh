#!/bin/sh
mkdir tools
COMMANDS="'wget https://github.com/MetaMask/metamask-plugin/releases/download/v3.1.1/metamask-chrome-3.1.1.zip -P tools -q' \
'wget https://github.com/MetaMask/metamask-plugin/releases/download/v3.1.1/metamask-firefox-3.1.1.zip -P tools -q' \
'wget https://github.com/MetaMask/metamask-plugin/releases/download/v3.1.1/metamask-edge-3.1.1.zip -P tools -q' \
'wget https://download.docker.com/mac/stable/Docker.dmg -O tools/`date +%Y%m%d_%H%M%S`_Docker_native_macosx.dmg -q' \
'wget https://download.docker.com/win/stable/InstallDocker.msi -O tools/`date +%Y%m%d_%H%M%S`_Docker_native_win.msi -q' \
'wget https://download.docker.com/mac/stable/DockerToolbox.pkg -O tools/`date +%Y%m%d_%H%M%S`_Docker_toolbox_win.pkg -q' \
'wget https://download.docker.com/win/stable/DockerToolbox.exe -O tools/`date +%Y%m%d_%H%M%S`_Docker_toolbox_win.exe -q'"

echo $COMMANDS | xargs -n 1 -P 8 sh -c 