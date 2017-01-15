FROM zenika/alpine-node
COPY ./package.json .
RUN npm i -g truffle \
	&& npm i -g ethereumjs-testrpc \
	&& npm i -g gulp-cli \
	&& npm i -g gulp \
	&& npm i -D -g 
RUN npm install
EXPOSE 8545
EXPOSE 9000
EXPOSE 35729
CMD truffle version ; ls -al