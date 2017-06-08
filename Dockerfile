FROM node:6
MAINTAINER Denis Carriere <@DenisCarriere>

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY package.json /src/
COPY yarn.lock /src/
RUN yarn

# Bundle app source
COPY . /src/
RUN mkdir -p /root/mbtiles

# Run App
EXPOSE 5000
CMD ["yarn", "start"]