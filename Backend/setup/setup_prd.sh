#!/bin/bash

# This file use for running in EC2 instance user data

sudo apt update
sudo apt upgrade -y

sudo apt install python3-pip -y
sudo apt install python3-dev default-libmysqlclient-dev build-essential -y
sudo apt install libssl-dev -y
sudo apt install mysql-client-core-8.0 -y
sudo apt install pkg-config -y
sudo apt install unzip -y

export PROJECT_BASEPATH=/home/ubuntu
export PROJECT_DOWNLOAD=https://d2r279wybcc8qg.cloudfront.net/server_files
export PROJECT_FILENAME=server_backend_t0ht676t5W4qpsaJPYwR.zip
export PROJECT_SERVICE_NAME=cmpe281_backend.service

cd $PROJECT_BASEPATH
wget $PROJECT_DOWNLOAD/$PROJECT_FILENAME
unzip $PROJECT_FILENAME
rm $PROJECT_FILENAME

cd Backend
pip3 install -r setup/requirements.txt

touch run.sh
echo "
export DEBUG=False
export AWS_S3_ACCESS_KEY_ID=AKIATLOLONNQTN6JNR5W
export AWS_S3_SECRET_ACCESS_KEY=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
export AWS_S3_BUCKET_NAME=saharat-cmpe281-clouddrive
export AWS_S3_REGION_NAME=us-west-1
export AWS_S3_SIGNATURE_VERSION=s3v4
python3 $PROJECT_BASEPATH/Backend/manage.py runserver 0:8000
" > run.sh

cp setup/$PROJECT_SERVICE_NAME /etc/systemd/system/$PROJECT_SERVICE_NAME
sudo systemctl daemon-reload
sudo systemctl enable $PROJECT_SERVICE_NAME
sudo systemctl start $PROJECT_SERVICE_NAME

echo "Setup done!!"