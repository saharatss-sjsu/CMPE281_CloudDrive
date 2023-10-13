#!/bin/bash

# This file use for running in EC2 instance user data

sudo apt update
sudo apt upgrade -y

sudo apt install -y unzip
sudo apt install -y nodejs
sudo apt install -y npm
sudo npm install -g serve@12.0.1

export PROJECT_BASEPATH=/home/ubuntu
export PROJECT_DOWNLOAD=https://d2r279wybcc8qg.cloudfront.net/server_files
export PROJECT_FILENAME=server_frontend_z0q5isqksYLPLYAyHT2o.zip
export PROJECT_SERVICE_NAME=cmpe281_frontend.service

cd $PROJECT_BASEPATH
wget $PROJECT_DOWNLOAD/$PROJECT_FILENAME
unzip $PROJECT_FILENAME
rm $PROJECT_FILENAME

cd Frontend

touch run.sh
echo "serve -s $PROJECT_BASEPATH/Frontend/build -p 3000" > run.sh

cp setup/$PROJECT_SERVICE_NAME /etc/systemd/system/$PROJECT_SERVICE_NAME
sudo systemctl daemon-reload
sudo systemctl enable $PROJECT_SERVICE_NAME
sudo systemctl start $PROJECT_SERVICE_NAME

echo "Setup done!!"