FROM mongo:4.4.28

RUN apt-get update && apt-get -q install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && apt-get install -y mongodb-org-shell

COPY --chown=mongodb:mongodb mongos-start.sh /usr/local/bin/
COPY --chown=mongodb:mongodb mongos-runextra.sh /usr/local/bin/

RUN chmod u+x /usr/local/bin/mongos-start.sh /usr/local/bin/mongos-runextra.sh

ENTRYPOINT ["mongos-start.sh"]

CMD mongos --port 27017 --bind_ip 0.0.0.0
