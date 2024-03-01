#!/bin/bash

# Wait until mongos can return a connection
until /usr/bin/mongo --quiet --eval 'db.getMongo()'; do
    sleep 1
done

sleep 1

# Split set of shard URLs text by ';' separator
IFS=';' read -r -a array <<< "$SHARD_LIST"

# Add each shard definition to the cluster
for shard in "${array[@]}"; do  
    /usr/bin/mongo --port 27017 <<EOF
        sh.addShard("${shard}");
EOF
done
/usr/bin/mongo --port 27017 <<EOF
	db.getSiblingDB("admin").createUser({user: "rootuser", pwd: "rootpass", roles: [{"role":"root","db":"admin"}]});
EOF
