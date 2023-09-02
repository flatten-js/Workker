const geolib = require('geolib')

const es = require('##/stores/elasticsearch.js')
const place = require('##/stores/place.js')
const { retry } = require('##/utils.js')

function to_positions(markers) {
  return markers.map(marker => marker.position)
}

function origin_position(positions) {
  const { minLat, maxLat, minLng, maxLng } = geolib.getBounds(positions)
  const { latitude, longitude } = geolib.getCenter([[minLng, minLat], [maxLng, maxLat]])
  const distance = geolib.getPreciseDistance([maxLng, maxLat], [longitude, latitude])
  return { center_position: { lat: latitude, lon: longitude }, distance }
}

function order_by_markers(markers, positions) {
  const map = new Map(positions.map((position, i) => [JSON.stringify(position), i]))
  return markers.sort((a, b) => map.get(JSON.stringify(a.position)) - map.get(JSON.stringify(b.position)))
}

function order_by_distance(positions) {
  const ordered_positions = [positions.shift()]
  while (positions.length) {
    const [base_position] = ordered_positions.slice(-1)
    const nearest_position = geolib.findNearest(base_position, positions)
    const i = positions.findIndex(position => JSON.stringify(position) == JSON.stringify(nearest_position))
    positions.splice(i, 1)
    ordered_positions.push(nearest_position)
  }
  return ordered_positions
}

function total_distance(positions) {
  return positions.reduce((acc, cur, i) => {
    const next_i = i + 1
    if (!positions[next_i]) return acc
    return acc + geolib.getPreciseDistance(cur, positions[next_i])
  }, 0)
}

async function nearby(position, radius, size) {
  let near = await es.nearby(position, radius, size)
	if (near.places.length < size) {
		const places = await place.nearby(position, radius)
		if (places.length) {
			await es.bulk(places, place => {
				const { name, geometry: { location } } = place
				return { title: name, position: { lat: location.lat, lon: location.lng } }
			})
			near = await retry(5, 1000, () => es.nearby(position, radius, size), result => result.places.length)
		}
	}
  return near
}

module.exports = {
  to_positions,
  origin_position,
  order_by_markers,
  order_by_distance,
  total_distance,
  nearby
}