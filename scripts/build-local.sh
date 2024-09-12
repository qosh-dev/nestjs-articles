docker-compose --env-file  .env -f  docker/docker-compose.local.yaml up -d --build
# docker exec app_database npm run migration:run --prefix /build
npm run migration:run --prefix backend
