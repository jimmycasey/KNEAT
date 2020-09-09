FROM node:10.22.0

WORKDIR /opt/KNEAT

COPY package.json main.js README.md /opt/KNEAT/
COPY services/* /opt/KNEAT/services/
COPY tests/* /opt/KNEAT/tests/
COPY utils/* /opt/KNEAT/utils/

RUN npm install

ENTRYPOINT [ "node", "main.js"]