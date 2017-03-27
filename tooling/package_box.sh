#!/bin/sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
vagrant package --output ${TIMESTAMP}-ubuntu-xenial64-codelab-ethereum.box