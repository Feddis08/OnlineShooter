echo "This is a installation for debian or a kind of linux"

apt-get install npm
apt-get install screen
apt-get update -y

cd ./server
npm install
screen -S shooter node server.js
