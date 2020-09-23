FROM node:latest
RUN mkdir -p /opt/nodejs
ADD package.json /opt/nodejs
WORKDIR /opt/nodejs
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]
ADD . /opt/nodejs