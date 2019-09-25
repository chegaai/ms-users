#!/bin/bash
set -e

kubectl config view
kubectl config current-context
helm upgrade --install --atomic --namespace=$KUBE_NAMESPACE --set env=$KUBE_NAMESPACE --set environment.DATABASE_MONGODB_DBNAME=$DATABASE_MONGODB_DBNAME --set environment.DATABASE_MONGODB_URI=$DATABASE_MONGODB_URI --set image.name=$DOCKER_IMAGE_BASENAME --set image.tag=$TRAVIS_TAG $DOCKER_IMAGE_BASENAME-$KUBE_NAMESPACE ./infrastructure/$DOCKER_IMAGE_BASENAME
