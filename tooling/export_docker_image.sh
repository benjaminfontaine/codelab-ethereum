#!/bin/sh
docker save francoiskha/codelab-ethereum:$1 | gzip -c > codelab-ethereum_$1.tar.gz