FROM mhart/alpine-node:8
MAINTAINER Denis Carriere <@DenisCarriere>

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY package.json /src/
COPY yarn.lock /src/
RUN yarn install --production

# Smaller image
FROM mhart/alpine-node:slim-8

RUN mkdir -p /src
# Copy node_modules from previous layer
COPY --from=0 /src /src
WORKDIR /src

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
CMD ["node", "./bin/mbtiles-server.js", "--verbose"]
