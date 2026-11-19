#!/bin/bash
set -e

dnf install -y docker
systemctl enable --now docker

docker run -d \
  --name learning-nginx \
  --restart unless-stopped \
  -p 80:80 \
  nginx:alpine