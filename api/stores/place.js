const axios = require('axios')

const { GCP_PLACE_APIKEY } = require('../config')
const { sleep } = require('../utils.js')

const place = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/place',
  params: {
    key: GCP_PLACE_APIKEY,
    language: 'ja'
  }
})

async function nearby(location, radius) {
  location = [location.lat, location.lon].join(',')

  const max_size = 3
  const results = []

  let pagetoken
  for (let i = 0; i < max_size; i++) {
    const { data } = await place.get('nearbysearch/json', { params: { location, radius, pagetoken } })
    if (!data.results?.length) break

    pagetoken = data.next_page_token
    results.push(...(data.results || []))

    await sleep(3000)
  }

  return results
}

module.exports = { nearby }
