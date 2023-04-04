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
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "./Map.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import axios from "axios";
import icon from "../../assets/icons/banana.png";
import Papa from 'papaparse';

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
  const position = { lat: 4.570868, lng: -74.297333 };
  console.log(carouselMajorItems)
  console.log(carouselLandraceItems)

  const google = window.google;
  const { context } = useContext(DataContext);
  const { iso } = useContext(DataContext);
  const [ubicaciones, setUbicaciones] = useState([]);

  const { data } = useContext(DataContext);
  const { elevationsg, setElevationsg } = useContext(DataContext);
  const { distance, setDistance } = useContext(DataContext);
  const { time, setTime } = useContext(DataContext);
  const { travel, setTravel } = useContext(DataContext);
  const { elevationProm, setElevationProm} = useContext(DataContext);
  const [distances, setDistances] = useState([]);
  const [layerr, setLayerr] = useState([]);

  const { layerc } = useContext(DataContext);
  const [prueba, setPrueba] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [wmsTileLayer, setWMSTileLayer] = useState(null);
  const[elevations,setElevations]=useState([])
  const [tooltipInfo, setTooltipInfo] = useState(null);
  useEffect(() => {
    // Aquí puedes hacer cualquier acción que necesites cada vez que cambie layerc
    // En este caso, no haremos nada especial
  }, [layerc]);

  let url = "https://maps.googleapis.com/maps/api/directions/json?";
  const urlCrops='http://127.0.0.1:5000/api/v1/crops';
const [crops, setCrops] = useState([]);
const [accessions, setAccessions] = useState([]);
useEffect(()=>{
    const getCrops =async ()=>{
        try{
            const responde= await axios.get(urlCrops)
            setCrops(responde.data)
            
        }catch(error){
            console.log(error)
        }
        
    }
    getCrops();

},[])

const[filteredCrops,setFilteredCrops]=useState([])
console.log(carouselMajorItems)
useEffect(() => {
  if (carouselMajorItems !== null) {
    const filteredData = crops.filter((item) =>
      carouselMajorItems.includes(item.app_name)
      
    );
    setFilteredCrops(filteredData);
  }
}, [crops, carouselMajorItems]);

console.log(filteredCrops)

  useEffect(() => {
    if ( carouselMajorItems !== null && carouselMajorItems.length === 1 && carouselLandraceItems.length==0) {
      const cropId = filteredCrops[0].id;
      setLayerr(`${iso}_${filteredCrops[0].ext_id}`)
      console.log(cropId)

      axios
        .get(`http://localhost:5000/api/v1/accessionsbyidcrop?id=${cropId}&iso=${iso}`)
        .then((response) => {
          console.log(response)
          setAccessions(response.data.flatMap((crop) => crop.accessions));
        })
        .catch((error) => {
          console.log(error);
        });
    } else if(carouselMajorItems!=null && carouselMajorItems.length==0) {
      setAccessions([])
    }

    
  }, [filteredCrops]);
  console.log(accessions)
  console.log(layerr)

  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");
console.log(idsCropss)
console.log(iso)

  useEffect(() => {
    if ( carouselMajorItems !== null && carouselMajorItems.length >1 && carouselLandraceItems.length==0) {
      setAccessions([])
      const endopointAccesionsByCrop = `http://localhost:5000/api/v1/accessionsbyidcrop?id=${idsCropss}&iso=${iso}`

      axios.get(endopointAccesionsByCrop).then((response) => {
        // 4. Manejar la respuesta de la solicitud HTTP
        //setAccesionDataByCrop(response.data)
        if (response.data[0]?.accessions) {

          setAccessions(response.data.flatMap((crop) => crop.accessions));
        } else {
          setAccessions(response.data);
        }
      });
    }
    
  }, [filteredCrops]);


// Agregar un evento load al objeto window
window.addEventListener("load", () => {
  // Crear un objeto DirectionsService
  
});
useEffect(()=>{
  if(context.length>0){
    
    const directionsService = new google.maps.DirectionsService();
    const elevationService = new google.maps.ElevationService();
    const puntos=  context.map(punto => ({location: punto}));
    const geocoder = new google.maps.Geocoder();
const contextWithCoords = [];

const getCoordsForCity = (city) => {
  return new Promise((resolve, reject) => {
    geocoder.geocode({address: city}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        const coords = {latitude: location.lat(), longitude: location.lng()};
        resolve({...coords, location: new google.maps.LatLng(coords.latitude, coords.longitude)});
      } else {
        reject(new Error(`Geocode failed: ${status}`));
      }
    });
  });
};

Promise.all(context.map(city => getCoordsForCity(city)))
  .then(coordsArray => {
    setUbicaciones(coordsArray);
  })
  .catch(error => {
    console.error(error);
  });
  
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
          
          const coordinates = route.overview_path.map(point => [point.lat(), point.lng()]);
   
          const duration = response.routes[0].legs.reduce(
            (total, leg) => total + leg.duration.value,
            0
          );
          const hours = Math.floor(duration / 3600);
          const minutes = Math.floor((duration % 3600) / 60);
          const url = `https://www.google.com/maps/dir/?api=1&origin=${puntos[0].location}&destination=${puntos[puntos.length - 1].location}&waypoints=${puntos.slice(1, -1).map(punto => punto.location).join('|')}&travelmode=driving`;
          setTravel(url)
          const coordenadasApi = coordinates.map((coordenadas) => {
            return {
              lat: coordenadas[0],
              lng: coordenadas[1]
            };
          });
          setTime([hours,minutes])
          const distance = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
          setDistance(distance/1000)
 
          const distances = [];
          for (let i = 0; i < coordenadasApi.length - 1; i++) {
            const from = new google.maps.LatLng(coordenadasApi[i]);
            const to = new google.maps.LatLng(coordenadasApi[i + 1]);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              from,
              to
            );
            distances.push(distance);
          }

          setDistances(distances);

          elevationService.getElevationAlongPath(
            {
              path: coordenadasApi,
              samples: 256
            },
            (results, status) => {
              if (status === google.maps.ElevationStatus.OK) {
                // Obtener las elevaciones de los puntos de la ruta
                console.log(results)
                const elevations = results.map(result => result.elevation);
                // Las elevaciones están en metros
                const promelevation = (elevations.reduce((acumulador, numero) => acumulador + numero, 0)/elevations.length).toFixed(2);
                console.log(`el promedio es ${promelevation}`)
                setElevationProm(promelevation)
                setElevationsg(elevations)
              } else {
                console.error(`Error al obtener la elevación: ${status}`);
              }
            }
          );
    
          // Las coordenadas están en formato [latitud, longitud]

          setLugares(coordinates);
        } else {
          console.error(`Error al obtener la dirección: ${status}`);
        }
      });
  }
  
},[context])
console.log(ubicaciones)

    
  const customIcon = L.icon({
    iconUrl: "https://img.icons8.com/material-outlined/256/marker.png",
    iconSize: [35, 35], // tamaño del icono
  });

  const accessionsArreglo = prueba.map((objeto) => objeto.accessions);
  
  

  const [clickedMarkerIndices, setClickedMarkerIndices] = useState(new Set());
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const[datatoExport,setDataToExport]=useState([])
  useEffect(()=>{
    if(selectedMarkers.length>0){
      setDataToExport(selectedMarkers.map((dat)=>dat.tooltipInfo))
    }
  },[selectedMarkers])
  
  //console.log(selectedMarkers)
 // console.log(datatoExport)

    
  const handleClick = (index, tooltipInfo) => {
    const newSet = new Set(clickedMarkerIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
      setSelectedMarkers(selectedMarkers.filter((marker) => marker.index !== index));
    } else {
      newSet.add(index);
      setSelectedMarkers([...selectedMarkers, { index, tooltipInfo }]);
    }
    setClickedMarkerIndices(newSet);
    console.log('marker clicked', index);
  };
  


  //console.log(data)
  return (
   
    

    <div className="mapDiv mx-0 p-0">
      <div className="div-filter-map" style={{backgroundColor:'transparent', zIndex:'1000', position:'relative'}}>
        <div className="px-4 py-2">
          {carouselMajorItems && carouselMajorItems.length > 0 && (
            <h6>Major crops</h6>
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
         <Marker
          eventHandlers={{
            click: (e) => {
              console.log('marker clicked', e)
            },
          }}
        position={position}
        onMouseOver={e => {
          e.target.openPopup();
        }}
        onMouseOut={e => {
          e.target.closePopup();
        }}
      >
        <Tooltip>I appear on mouse over</Tooltip>
      </Marker>
        {accessions &&
          accessions.length > 0 &&
          accessions.map((marker, index) =>
            marker.latitude && marker.longitude ? (
              <Marker
              eventHandlers={{
                click: (e) => {
                  handleClick(index, {
                    Id:marker.id,
                    AccecionID: marker.accession_id,

                    SpeciesName: marker.species_name,
                    Ext_id: marker.ext_id,
                    Crop: marker.crop,
                    Latitude: marker.latitude,
                    Longitude: marker.longitude,
                    Institution: marker.institution_name,
                    Source: marker.source_database,

                  });
                  const newSet = new Set(clickedMarkerIndices);
                  if (newSet.has(index)) {
                    newSet.delete(index);
                  } else {
                    newSet.add(index);
                  }
                  setClickedMarkerIndices(newSet);
                  console.log('marker clicked', e);
                },
              }}
                key={index}
                position={[marker.latitude, marker.longitude]}
                icon={
                  clickedMarkerIndices.has(index)
                    ? L.icon({
                        iconUrl: "https://img.icons8.com/arcade/256/place-marker.png",
                        iconSize: [35, 35],
                      })
                    : customIcon
                }
                onMouseOver={(e) => {
                  e.target.openPopup();
                }}
                onMouseOut={(e) => {
                  e.target.closePopup();
                }}
              >
                <Tooltip direction="top" offset={[0, -30]}>
                  Institution: {marker.institution_name} <br /> Source:{marker.source_database} id: {marker.ext_id}
                  <p>  <strong>Click si quiere guardar esta accesion para exportar</strong> </p>
                </Tooltip>
              </Marker>
            ) : null
          )}

        {ubicaciones.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]}>
            <Popup>
              Destino: {index + 1 }
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
<Polyline color="lime" positions={lugares} weight={5} />

      </MapContainer>
      
    </div>

    
  );
}

export default Map;
