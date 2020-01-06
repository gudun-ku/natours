//console.log('Hello from the client side :D');
/* eslint-disable */
const mapBox = document.getElementById('map');
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  //console.log(locations);

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZ3VkdW4ta3UiLCJhIjoiY2s0enlrbzVsMDl1OTNscW44bXMyN2I1YiJ9.u7yQCVVDUTxLiZJDhsc25g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gudun-ku/ck4zyopdd4y311cqltt7cyov6',
    scrollZoom: false
    // center: [-118.998, 34.111],
    // zoom: 6,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}
