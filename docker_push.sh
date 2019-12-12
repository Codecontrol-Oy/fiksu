#!/bin/bash
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
docker push codecontrol/fiksu-frontend:dev-"$TRAVIS_BUILD_NUMBER"
docker push codecontrol/fiksu-backend:dev-"$TRAVIS_BUILD_NUMBER"