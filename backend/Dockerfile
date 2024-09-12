FROM node:21.7.2

COPY . ./pre_build
RUN npm install -f --prefix /pre_build
RUN npm run build --prefix /pre_build

RUN mkdir -p /build/

RUN cp -R pre_build/dist /build/dist
RUN cp -R pre_build/node_modules /build/node_modules
RUN cp -R pre_build/logs /build/logs
RUN cp -R pre_build/package.json /build/package.json

RUN rm -r /pre_build

CMD [ "node", "/build/dist/main.js" ]