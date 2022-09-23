#!/bin/bash

containers=$(docker ps -q)

if [[ ! -z $containers ]]; then                   # if the string <containers> is not null, then
  echo "Killing all containers."
  docker kill $containers;

  containers=$(docker ps -q)
  if [[ ! -z $containers ]]; then
    echo "Killing all containers failed. Skipping deployment."
    exit 1
  else
    echo "All containers successfully killed."
  fi
  else
  echo "No containers to kill."
fi