import { React, useState, useEffect, useContext } from "react";
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
  useMapEvents,
} from "react-leaflet";
import "./Map.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import axios from "axios";
import icon from "../../assets/icons/banana.png";
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

  let markerPosition = [4.4419, -75.2327];
  var markerPositionv = ["2.9342", "-75.2858"];
  markerPositionv = [1.2136, -77.2811];
  const google = window.google;
  const { context } = useContext(DataContext);
  const { data } = useContext(DataContext);
  const { layerc } = useContext(DataContext);
  const [prueba, setPrueba] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [wmsTileLayer, setWMSTileLayer] = useState(null);
  useEffect(() => {
    // Aquí puedes hacer cualquier acción que necesites cada vez que cambie layerc
    // En este caso, no haremos nada especial
  }, [layerc]);

  console.log(data);
  // Array con las ciudades
  /* useEffect(() => {
    // Actualiza el estado de wmsTileLayer cuando layer cambia
    setWMSTileLayer(
      <WMSTileLayer 
        url="http://localhost:8080/geoserver/otrico/wms"
        layers={`otrico:${layerc}`}
        format="image/png"
        transparent={true}
      />
    );
  }, [layerc]); */

  let url = "https://maps.googleapis.com/maps/api/directions/json?";

  // Creamos una lista vacía para almacenar las ubicaciones
  /* let ubicaciones = []; */
  const cities = [
    [4.710989, -74.072092], //Bogotá
    [3.451647, -76.531982], //Cali
    [6.244203, -75.581211], //Medellín
  ];
  // Agregar un evento load al objeto window
  window.addEventListener("load", () => {
    // Crear un objeto DirectionsService
  });
  useEffect(() => {
    if (context.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const puntos = context.map((punto) => ({ location: punto }));
      // Crear una solicitud de dirección
      const request = {
        origin: puntos[0].location,
        destination: puntos[puntos.length - 1].location,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: puntos.slice(1, -1),
      };

      // Enviar la solicitud de dirección a la API de Google Maps
      directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          // Obtener las coordenadas de la ruta
          const route = response.routes[0];
          const coordinates = route.overview_path.map((point) => [
            point.lat(),
            point.lng(),
          ]);

          // Las coordenadas están en formato [latitud, longitud]

          setLugares(coordinates);
        } else {
          console.error(`Error al obtener la dirección: ${status}`);
        }
      });
    }
  }, [context]);

  const [ubicaciones, setUbicaciones] = useState([]);
  // Iteramos sobre el array de ciudades y obtenemos las coordenadas de cada una
  /* const response = await fetch(`${baseURLCategories}${genre}${opts}`, ); */
  useEffect(() => {
    if (context.length > 0) {
      context.forEach(function (ciudad) {
        // Creamos una consulta para obtener las coordenadas de la ciudad
        let query = {
          address: ciudad,
          key: "AIzaSyARbwF61yXA-0aEOfeDYanC-IpgfxMQL-w",
        };
        // Hacemos la petición a la API de Geocodificación de Google Maps
        axios
          .get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: query,
          })
          .then(function (response) {
            // Obtenemos las coordenadas de la ciudad
            let location = response.data.results[0].geometry.location;
            // Agregamos las coordenadas a la lista de ubicaciones
            setUbicaciones((prevUbicaciones) => [
              ...prevUbicaciones,
              { lat: location.lat, lng: location.lng },
            ]);

            // Si ya hemos obtenido las coordenadas de todas las ciudades, construimos la consulta para obtener la ruta
            if (ubicaciones.length === context.length) {
              let query = {
                origin: ubicaciones[0],
                destination: ubicaciones[ubicaciones.length - 1],
                waypoints: ubicaciones
                  .slice(1, ubicaciones.length - 1)
                  .join("|"),
                key: "AIzaSyARbwF61yXA-0aEOfeDYanC-IpgfxMQL-w",
              };
              // Hacemos la petición a la API de Direcciones de Google Maps
              axios
                .get(url, { params: query })
                .then(function (response) {
                  // Obtenemos los pasos de la ruta y los imprimimos
                  let pasos = response.data.routes[0].legs[0].steps;
                  pasos.forEach(function (paso) {
                    console.log(paso.html_instructions);
                  });
                })
                .catch(function (error) {
                  console.log("Error al obtener la ruta: " + error.message);
                });
            }
          })
          .catch(function (error) {
            console.log(
              "Error al obtener las coordenadas de " +
                ciudad +
                ": " +
                error.message
            );
          });
      });
    } else {
      console.log("aun no hay nada");
    }
  }, [context]);

  const customIcon = L.icon({
    iconUrl: "https://img.icons8.com/material-outlined/256/marker.png",
    iconSize: [35, 35], // tamaño del icono
  });

  console.log(layerc);
  const accessionsArreglo = prueba.map((objeto) => objeto.accessions);

  return (
    <div className="mapDiv mx-0 p-0">
      <div className="div-filter-map" style={{backgroundColor:'transparent', zIndex:'1000', position:'relative'}}>
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
        style={{ height: "100%", width: "100%", position:'fixed', top: '58px' }}
        zoomControl={false}
      >
        {data &&
          data.length > 0 &&
          data.map((marker, index) =>
            marker.latitude && marker.longitude ? (
              <Marker
                key={index}
                position={[marker.latitude, marker.longitude]}
                icon={customIcon}
              >
                <Popup>
                  Institution: {marker.institution_name} <br /> Source:{" "}
                  {marker.source_database}
                </Popup>
              </Marker>
            ) : null
          )}

        {/* {accessionsArreglo && accessionsArreglo.length > 0 && accessionsArreglo[0].map((marker, index) => (
  (marker.latitude && marker.longitude) ? (
    <Marker key={index} position={[marker.latitude, marker.longitude]} icon={customIcon}>
      <Popup>Institution: {marker.institution_name} <br /> Source: {marker.source_database}</Popup>
    </Marker>
  ) : null
))} */}

        {ubicaciones.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>
              Institution: <br /> Source:{" "}
            </Popup>
          </Marker>
        ))}

        <ZoomControl position="topright"></ZoomControl>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {layerc && (
          <WMSTileLayer
            key={`layer-${layerc}`}
            url="https://isa.ciat.cgiar.org/geoserver2/gap_analysis/wms"
            layers={`gap_analysis:${layerc}`}
            format="image/png"
            transparent={true}
          />
        )}
        <Polyline color="lime" positions={lugares} />
        {/* <Marker  position={[4.71096, -74.07221000000001]}>
            <Popup>
              Institution: <br /> Source:{" "}
            </Popup>
          </Marker> */}
      </MapContainer>
    </div>
  );
}

export default Map;
