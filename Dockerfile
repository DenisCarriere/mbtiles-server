FROM node:6
MAINTAINER Denis Carriere <@DenisCarriere>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn

# Bundle app source
COPY . /usr/src/app/
RUN mkdir -p /root/mbtiles

# Run App
EXPOSE 5000
CMD ["yarn", "start"]