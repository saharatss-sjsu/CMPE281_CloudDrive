#!/bin/bash

cd $(dirname "$0")/package
zip -r ../lambda_function.zip .
# cd ..
# zip lambda_function.zip package