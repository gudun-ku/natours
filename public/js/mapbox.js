//console.log('Hello from the client side :D');
/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ3VkdW4ta3UiLCJhIjoiY2s0enlrbzVsMDl1OTNscW44bXMyN2I1YiJ9.u7yQCVVDUTxLiZJDhsc25g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/gudun-ku/ck4zyopdd4y311cqltt7cyov6'
  // center: [-118.998, 34.111],
  // zoom: 6,
  // interactive: false
});
