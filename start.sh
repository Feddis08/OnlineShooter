echo "This is a installation for debian or a kind of linux"

apt-get install npm
apt-get install screen
apt-get update -y

npm install

cd ./server
screen -S shooter node server.js
