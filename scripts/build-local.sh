docker-compose --env-file  .env -f  docker/docker-compose.local.yaml up -d --build
npm run migration:run --prefix backend
