#!/bin/sh
# Dépôts
sudo curl -fsSL https://yum.dockerproject.org/gpg | sudo apt-key add -
sudo apt-get install software-properties-common
sudo add-apt-repository \
       "deb https://apt.dockerproject.org/repo/ \
       ubuntu-$(lsb_release -cs) \
       main"
sudo apt-get update
# Docker install, pour test du setup
sudo apt-get -y install docker-engine docker-compose
sudo usermod -a -G docker ubuntu