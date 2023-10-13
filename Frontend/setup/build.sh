#!/bin/bash
cd $(dirname "$0")
npm run build
cd ../..
zip -r server_frontend.zip Frontend -i \
	"Frontend/setup/*.service" \
	"Frontend/build/*" \

