#!/bin/bash
start=$(date +'%s')
echo "Begin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Begin install systems"

apt install update
sleep 1
apt install unzip
sleep 1
apt install wget
sleep 1

echo "bat dau thoi gian:$start"
end=$(date +'%s')
echo "ket thuc thoi gian:$end"
