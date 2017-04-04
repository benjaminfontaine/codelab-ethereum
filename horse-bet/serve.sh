#!/bin/sh
socat TCP-LISTEN:8545,fork,reuseaddr TCP:testrpc:8545 &
gulp serve