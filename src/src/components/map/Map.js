import { React, useState, useEffect,useContext } from "react";
import { CloseButton } from "react-bootstrap";
import { DataContext } from "../../context/context";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  WMSTileLayer,
  LayersControl,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "./Map.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import axios from "axios";
const { BaseLayer } = LayersControl;
function Map({
  carouselMajorItems,
  setCarouselMajorItems,
  carouselLandraceItems,
  setCarouselLandraceItems,
}) {
  const handleRemoveFromMajorCarousel = (index) => {
    const itemToRemove = carouselMajorItems.splice(index, 1)[0];
    setCarouselMajorItems([...carouselMajorItems]);
  };

  const handleRemoveFromLandraceCarousel = (index) => {
    const itemToRemove = carouselLandraceItems.splice(index, 1)[0];
    setCarouselLandraceItems([...carouselLandraceItems]);
  };

  let markerPosition=[4.4419,-75.2327]
  var markerPositionv=['2.9342','-75.2858']
  markerPositionv=[1.2136,-77.2811]

const { context } = useContext(DataContext);
const { data } = useContext(DataContext);
console.log(context)


// Array con las ciudades
let ciudades = ['bogota', 'medellin','cali','barranquilla'];

// Construimos la URL de la API de direcciones de Google Maps
let url = 'https://maps.googleapis.com/maps/api/directions/json?';

// Creamos una lista vacía para almacenar las ubicaciones
/* let ubicaciones = []; */
const [ubicaciones,setUbicaciones]=useState([])
// Iteramos sobre el array de ciudades y obtenemos las coordenadas de cada una
/* const response = await fetch(`${baseURLCategories}${genre}${opts}`, ); */
useEffect(()=>{
  if (context.length>0){
    context.forEach(function(ciudad) {
      // Creamos una consulta para obtener las coordenadas de la ciudad
      let query = {'address': ciudad, 'key': 'AIzaSyARbwF61yXA-0aEOfeDYanC-IpgfxMQL-w'};
      // Hacemos la petición a la API de Geocodificación de Google Maps
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {params: query})
        .then(function(response) {
          // Obtenemos las coordenadas de la ciudad
          let location = response.data.results[0].geometry.location;
          // Agregamos las coordenadas a la lista de ubicaciones
          setUbicaciones(prevUbicaciones => [...prevUbicaciones, {lat: location.lat, lng: location.lng}]);

          
          // Si ya hemos obtenido las coordenadas de todas las ciudades, construimos la consulta para obtener la ruta
          if (ubicaciones.length === context.length) {
            let query = {
              'origin': ubicaciones[0],
              'destination': ubicaciones[ubicaciones.length - 1],
              'waypoints': ubicaciones.slice(1, ubicaciones.length - 1).join('|'),
              'key': 'AIzaSyARbwF61yXA-0aEOfeDYanC-IpgfxMQL-w',
              
            };
            // Hacemos la petición a la API de Direcciones de Google Maps
            axios.get(url, {params: query})
              .then(function(response) {
                // Obtenemos los pasos de la ruta y los imprimimos
                let pasos = response.data.routes[0].legs[0].steps;
                pasos.forEach(function(paso) {
                  console.log(paso.html_instructions);
                });
              })
              .catch(function(error) {
                console.log('Error al obtener la ruta: ' + error.message);
              });
          }
          
        })
        .catch(function(error) {
          console.log('Error al obtener las coordenadas de ' + ciudad + ': ' + error.message);
        });
    });
  
  }else{
    console.log('aun no hay nada')
  }
},[context])

let ubicors=[ubicaciones];
console.log(ubicaciones[0])
console.log(data)
const cities = [
  { name: "Neiva", position: [2.9344, -75.2819] },
  { name: "Bogotá", position: [4.6097, -74.0817] },
  { name: "Medellín", position: [6.2442, -75.5812] },
];
const customIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/447/447031.png',
  iconSize: [40, 40], // tamaño del icono
});
  return (
    <div className="mapDiv mx-0 p-0" >
      <div className="div-filter-map">
        <div className="px-4 py-2">
          {carouselMajorItems && carouselMajorItems.length > 0 && (
            <h6>Major items</h6>
          )}
          {carouselMajorItems &&
            carouselMajorItems.map((item, i) => (
              <div
                className="btn border border-top-0 px-3 py-1 rounded-3 me-1 hoverable filter-map"
                key={i}
                onClick={() => handleRemoveFromMajorCarousel(i)}
              >
                <img
                  alt=""
                  src="https://ciat.shinyapps.io/LGA_dashboard/_w_ff143018/crops_icons/banana.png"
                  width="20"
                />{" "}
                {item}
                <CloseButton
                  disabled
                  className="ms-1 close-button"
                ></CloseButton>
              </div>
            ))}
        </div>

        <div className=" px-4 py-2">
          {carouselLandraceItems && carouselLandraceItems.length > 0 && (
            <h6>Landrace items</h6>
          )}
          {carouselLandraceItems &&
            carouselLandraceItems.map((item, i) => (
              <div
                className="btn border border-top-0 px-3 py-1 rounded-3 me-1 hoverable filter-map"
                key={i}
                onClick={() => handleRemoveFromLandraceCarousel(i)}
              >
                <img
                  alt=""
                  src="https://ciat.shinyapps.io/LGA_dashboard/_w_ff143018/crops_icons/banana.png"
                  width="20"
                />{" "}
                {item}
                <CloseButton
                  disabled
                  className="ms-1 close-button"
                ></CloseButton>
              </div>
            ))}
        </div>
      </div>
      
      <MapContainer
        id="mapid"
        
        center={[14.88, -35, 76]}
        zoom={3}
        maxBounds={[
          [90, -180.0],
          [-90, 180.0],
        ]}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        
        
      {data.map((marker, index) => (
        <Marker key={index} position={[marker.latitude, marker.longitude]} icon={customIcon}>
          <Popup>Institution: {marker.institution_name} <br /> Institution: {marker.source_database}</Popup>
        </Marker>
      ))}
        <ZoomControl position="topright"></ZoomControl>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
       
     
       
        
        
       {/*  
        <WMSTileLayer 
        url="https://isa.ciat.cgiar.org/geoserver2/gap_analysis/wms"
        layers={selectedLayer}
        format="image/png"
        transparent={true}
      /> */}
   
      </MapContainer>
    </div>
  );
}

export default Map;
