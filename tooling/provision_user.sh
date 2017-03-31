#!/bin/sh
sudo useradd vagrant
sudo usermod --password kV1OEl.2KgnVs vagrant
sudo usermod -a -G sudo vagrant
sudo usermod -a -G docker vagrant || :
sudo usermod --password kV1OEl.2KgnVs ubuntu