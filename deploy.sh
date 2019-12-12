#!/bin/bash
echo "***********[ Pulling latest images ]***********"
ssh $SERVER_USERNAME@fiksu.codecontrol.fi -p 20150 "docker pull codecontrol/fiksu-frontend:dev-$TRAVIS_BUILD_NUMBER"
ssh $SERVER_USERNAME@fiksu.codecontrol.fi -p 20150 "docker pull codecontrol/fiksu-backend:dev-$TRAVIS_BUILD_NUMBER"
echo "***********[ Updating images]***********"
BACKEND="docker service update --env-add VERSION='$TRAVIS_BUILD_NUMBER' --image codecontrol/fiksu-backend:dev-'${TRAVIS_BUILD_NUMBER}' fiksu_backend"
FRONTEND="docker service update --env-add VERSION='$TRAVIS_BUILD_NUMBER' --image codecontrol/fiksu-frontend:dev-'${TRAVIS_BUILD_NUMBER}' fiksu_frontend"
ssh $SERVER_USERNAME@fiksu.codecontrol.fi -p 20150 $FRONTEND
ssh $SERVER_USERNAME@fiksu.codecontrol.fi -p 20150 $BACKEND
echo "***********[ Cleanup ]***********"
CLEANUP="docker system prune -f"
ssh $SERVER_USERNAME@fiksu.codecontrol.fi -p 20150 $CLEANUP