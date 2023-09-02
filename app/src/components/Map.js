import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { Skeleton } from '@mui/material'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-sprite/dist/leaflet.sprite.js'

L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/'

function Map(props) {
  const position = props.position
  const radius = props.radius
  const loaded = props.loaded || false
  
  let markers = props.markers
  markers ||= (props._markers || []).map(marker => ({ ...marker, position: marker.position.split(',') }))

  return (
    loaded
    ? (
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={ markers[0].position } 
        zoom={13} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {
          position && <Marker position={ position } /> 
        }

        {
          markers.map(marker => {
            return (
              <Marker position={ marker.position } icon={ L.spriteIcon('red') } key={ marker.id }>
                <Popup>
                  { marker.description }
                </Popup>
                
                {
                  radius && (
                    <Circle color="#CB2742" fillColor="#CB2742" center={ marker.position } radius={ marker.radius || radius } />
                  )
                }
              </Marker>
            )
          })
        }
        
      </MapContainer>
    )
    : (
      <Skeleton variant="rectangular" sx={{ width: '100%', height: '100%' }} />
    )
  )
}

export default Map