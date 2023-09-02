const axios = require('axios')

const es = axios.create({
  baseURL: 'http://elasticsearch:9200/places',
  headers: { 'Content-Type': 'application/json' }
})

async function bulk(results, field_cb) {
  const ndjson = results.reduce((acc, cur) => {
    const index = { index: { _id: cur.place_id } }
    const field = field_cb(cur)
    return [...acc, ...[index, field].map(JSON.stringify)]
  }, []).join('\n') + '\n'

  await es.post('_bulk?pipeline=ingest_timestamp', ndjson, {
    headers: {
      'Content-Type': 'application/x-ndjson'
    }
  })
}

async function nearby(position, radius, size = 10) {
  const query = {
    "query": {
      "function_score": {
        "query": {
          "geo_distance": {
            "distance": `${radius}m`,
            "position": position
          }
        },
        "random_score": {}
      }
    },
    "aggs": {
      "latest_timestamp": {
        "max": {
          "field": "@timestamp"
        }
      }
    },
    "size": size
  }

  const { data } = await es.post('_search', query)

  return { 
    places: (data.hits?.hits || []).map(hit => hit._source), 
    latest_timestamp: data.aggregations?.latest_timestamp?.value || 0 
  }
}

module.exports = { bulk, nearby }
