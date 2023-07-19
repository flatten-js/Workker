#!/bin/bash

apt update
apt install wget

wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh 

/bin/bash /usr/local/bin/wait-for-it.sh localhost:9200 -t 0 -s -- /bin/bash << EOF
  curl -X PUT http://localhost:9200/places

  curl -X PUT http://localhost:9200/places/_mapping -H 'Content-Type: application/json' -d '
    {
      "properties": {
        "name": {
          "type": "text"
        },
        "location": {
          "type": "geo_point"
        }
      }
    }
  '

  curl -X PUT http://localhost:9200/_ingest/pipeline/ingest_timestamp -H 'Content-Type: application/json' -d '
    {
      "processors": [
        {
          "set": {
            "field": "@timestamp",
            "value": "{{_ingest.timestamp}}"
          }
        }
      ]
    }
  '
EOF