echo "This is an installation for debian or a kind of linux with apt"

apt-get install npm
apt-get install screen
apt-get update -y

cd ./server
npm install
screen -S shooter node server.js
