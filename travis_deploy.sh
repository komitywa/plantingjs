#!/bin/bash
set -e # exit with nonzero exit code if anything fails

openssl aes-256-cbc -K $encrypted_7a9f37839964_key -iv $encrypted_7a9f37839964_iv -in github_deploy_key.enc -out github_deploy_key -d
chmod 600 github_deploy_key
eval `ssh-agent -s`
ssh-add github_deploy_key

cd dist
git init
git config user.name "Travis CI"
git config user.email "travis@kdp.pl"
git add .
git commit -m "Automatic deploy of compiled library"
git push --force --quiet "git@github.com:${GH_REF}" master:autodeploy > /dev/null 2>&1
