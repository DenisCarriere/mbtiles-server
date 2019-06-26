FROM mhart/alpine-node:10
MAINTAINER Denis Carriere <@DenisCarriere>

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY package.json /src/
COPY yarn.lock /src/
RUN yarn install --production

# Remove unused sqlite3-offline binaries
RUN /bin/mv \
  node_modules/sqlite3-offline/binaries/sqlite3-linux/node-v64-linux-x64 \
  node_modules/sqlite3-offline/binaries/node-v64-linux-x64 \
  && /bin/rm -rf \
  node_modules/sqlite3-offline/binaries/sqlite3-darwin/* \
  node_modules/sqlite3-offline/binaries/sqlite3-darwin/* \
  node_modules/sqlite3-offline/binaries/sqlite3-linux/* \
  && /bin/mv \
  node_modules/sqlite3-offline/binaries/node-v64-linux-x64 \
  node_modules/sqlite3-offline/binaries/sqlite3-linux

# Smaller image
FROM mhart/alpine-node:slim-10

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
