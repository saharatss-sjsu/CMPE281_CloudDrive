#!/bin/bash
cd $(dirname "$0")
cd ../..
zip -r server_backend.zip Backend -i \
	"Backend/apps/*" \
	"Backend/CMPE281_CloudDrive/*" \
	"Backend/credentials/mysql.cnf" \
	"Backend/setup/*.service" \
	"Backend/setup/requirements.txt" \
	"Backend/manage.py" \

