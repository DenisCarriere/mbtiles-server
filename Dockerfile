FROM mhart/alpine-node:8
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

# Enables customized options using environment variables
ENV CACHE='/root/mbtiles'
ENV PROTOCOL='http'
ENV DOMAIN='localhost'
ENV PORT='5000'
ENV VERBOSE='true'

# Run App
EXPOSE 5000
CMD ["yarn", "start"]
