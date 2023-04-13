import { React, useState, useEffect, useContext, useRef,Control } from "react";
import { CloseButton, Button, Form } from "react-bootstrap";
import { DataContext } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import RouteError from "../routeError/RouteError";
import Select from "react-select";
import { saveAs } from "file-saver";
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
  ImageOverlay
} from "react-leaflet";
import "./Map.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import axios from "axios";
import icon from "../../assets/icons/banana.png";
import Papa from "papaparse";

const { BaseLayer } = LayersControl;
function Map({
  carouselMajorItems,
  setCarouselMajorItems,
  carouselLandraceItems,
  setCarouselLandraceItems,
}) {
  const [showe, setShowe] = useState(false); // estado para controlar la visualización del Modal

  const handleClosee = () => {
    setShowe(false);
  };

  const handleRemoveFromMajorCarousel = (index) => {
    const itemToRemove = carouselMajorItems.splice(index, 1)[0];
    setCarouselMajorItems([...carouselMajorItems]);
  };

  const handleRemoveFromLandraceCarousel = (index) => {
    const itemToRemove = carouselLandraceItems.splice(index, 1)[0];
    setCarouselLandraceItems([...carouselLandraceItems]);
  };
  const position = { lat: 4.570868, lng: -74.297333 };
  // console.log(carouselMajorItems)
  //console.log(carouselLandraceItems)

  const google = window.google;
  const { context } = useContext(DataContext);
  const { iso } = useContext(DataContext);
  const { image } = useContext(DataContext);
  const [ubicaciones, setUbicaciones] = useState([]);

  const { data } = useContext(DataContext);
  const { elevationsg, setElevationsg } = useContext(DataContext);
  const { distance, setDistance } = useContext(DataContext);
  const { dataRoutestoExport, setDataRoutestoExport } = useContext(DataContext);

  const { time, setTime } = useContext(DataContext);
  const { travel, setTravel } = useContext(DataContext);
  const { pointDistance, setPointDistance } = useContext(DataContext);
  const { elevationProm, setElevationProm } = useContext(DataContext);
  const [distances, setDistances] = useState([]);
  const [layerr, setLayerr] = useState([]);

  
  const [prueba, setPrueba] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [wmsTileLayer, setWMSTileLayer] = useState(null);
  const [elevations, setElevations] = useState([]);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [groups, setGroups] = useState([]);
  
  let url = "https://maps.googleapis.com/maps/api/directions/json?";
  const urlCrops = "http://127.0.0.1:5000/api/v1/crops";
  const [crops, setCrops] = useState([]);
  const [accessions, setAccessions] = useState([]);
  const [filteredgroups, setFilteredGroups] = useState([]);
  useEffect(() => {
    const getCrops = async () => {
      try {
        const responde = await axios.get(urlCrops);
        setCrops(responde.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCrops();
  }, []);

  const [filteredCrops, setFilteredCrops] = useState([]);
  //console.log(carouselMajorItems)
  useEffect(() => {
    if (carouselMajorItems !== null) {
      const filteredData = crops.filter((item) =>
        carouselMajorItems.includes(item.app_name)
      );
      setFilteredCrops(filteredData);
    }
  }, [crops, carouselMajorItems]);

  //console.log(filteredCrops)

  useEffect(() => {
    if (
      carouselMajorItems !== null &&
      carouselMajorItems.length === 1 &&
      carouselLandraceItems.length == 0
    ) {
      const cropId = filteredCrops[0].id;
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr([`${iso}_${filteredCrops[0].ext_id}`]);
      //console.log(cropId)

      axios
        .get(
          `http://localhost:5000/api/v1/accessionsbyidcrop?id=${cropId}&iso=${iso}`
        )
        .then((response) => {
          //console.log(response)
          setAccessions(response.data.flatMap((crop) => crop.accessions));
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (carouselMajorItems != null && carouselMajorItems.length == 0) {
      setAccessions([]);
    }
  }, [filteredCrops]);

  useEffect(() => {
    if (
      carouselLandraceItems !== null &&
      carouselLandraceItems.length > 0 &&
      carouselMajorItems.length > 0
    ) {
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      const cropId = filteredCrops[0].id;

      axios
        .get(`http://localhost:5000/api/v1/groups?id=${cropId}`)
        .then((response) => {
          //console.log(response)
          setGroups(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
    }
  }, [filteredCrops]);

  //console.log(groups)
  //console.log(carouselLandraceItems)

  useEffect(() => {
    if (carouselLandraceItems != null && groups[0]?.groups != null) {
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      const filteredgroups = groups[0]?.groups
        .map((obj) =>
          carouselLandraceItems.includes(obj.group_name) ? obj : null
        )
        .filter((obj) => obj !== null);
      setFilteredGroups(filteredgroups);
    }
    console.log(groups);
  }, [carouselLandraceItems, groups]);

  ////console.log(filteredgroups)

  const idsgroups = filteredgroups.map((obj) => obj.id).join(",");
  //console.log(idsgroups)
  const extidsgroup = filteredgroups
    .map((obj) => obj.ext_id)
    .join(",")
    .split(",");
  //console.log(extidsgroup)
  //console.log(layerr.length)

  useEffect(() => {
    if (carouselLandraceItems != null && carouselLandraceItems.length > 0) {
      setAccessions([]);
      const newArray = extidsgroup.map((element) => `${iso}_${element}`);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr(newArray);
      axios
        .get(
          `http://localhost:5000/api/v1/accessionsbyidgroup?id=${idsgroups}&iso=${iso}`
        )
        .then((response) => {
          //console.log(response)
          setAccessions(response.data.flatMap((crop) => crop.accessions));
        })
        .catch((error) => {
          //console.log(error);
        });
    } else if (
      carouselLandraceItems != null &&
      carouselLandraceItems.length == 0
    ) {
      setAccessions([]);
    }
  }, [filteredgroups]);
  //console.log(accessions)

  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");
  //console.log(idsCropss)
  //console.log(iso)
  const extids = filteredCrops
    .map((obj) => obj.ext_id)
    .join(",")
    .split(",");

  //console.log(extids)
  useEffect(() => {
    if (carouselMajorItems === null || carouselMajorItems.length == 0) {
      setLayerr([]);
    }
  }, [carouselMajorItems]);

  useEffect(() => {
    if (carouselLandraceItems === null || carouselLandraceItems.length == 0) {
      setLayerr([]);
    }
  }, [carouselLandraceItems]);

  useEffect(() => {
    if (
      carouselMajorItems !== null &&
      carouselMajorItems.length > 1 &&
      carouselLandraceItems.length == 0
    ) {
      const newArray = extids.map((element) => `${iso}_${element}`);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr(newArray);
      setAccessions([]);
      const endopointAccesionsByCrop = `http://localhost:5000/api/v1/accessionsbyidcrop?id=${idsCropss}&iso=${iso}`;

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

  useEffect(() => {
    if (
      carouselMajorItems !== null &&
      carouselMajorItems.length == 1 &&
      carouselLandraceItems.length == 0
    ) {
      const newArray = extids.map((element) => `${iso}_${element}`);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr(newArray);
      setAccessions([]);

      const endopointAccesionsByCrop = `http://localhost:5000/api/v1/accessionsbyidcrop?id=${idsCropss}&iso=${iso}`;

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
  }, [carouselLandraceItems]);

  console.log(layerr);

  // Agregar un evento load al objeto window
  window.addEventListener("load", () => {
    // Crear un objeto DirectionsService
  });
  useEffect(() => {
    if (context.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const elevationService = new google.maps.ElevationService();
      const puntos = context.map((punto) => ({ location: punto }));
      const geocoder = new google.maps.Geocoder();
      const contextWithCoords = [];

      const getCoordsForCity = (city) => {
        return new Promise((resolve, reject) => {
          geocoder.geocode({ address: city }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              const location = results[0].geometry.location;
              const coords = {
                latitude: location.lat(),
                longitude: location.lng(),
              };
              resolve({
                ...coords,
                location: new google.maps.LatLng(
                  coords.latitude,
                  coords.longitude
                ),
              });
            } else {
              reject(new Error(`Geocode failed: ${status}`));
            }
          });
        });
      };

      Promise.all(context.map((city) => getCoordsForCity(city)))
        .then((coordsArray) => {
          setUbicaciones(coordsArray);
        })
        .catch((error) => {
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

          const coordinates = route.overview_path.map((point) => [
            point.lat(),
            point.lng(),
          ]);

          const duration = response.routes[0].legs.reduce(
            (total, leg) => total + leg.duration.value,
            0
          );
          const hours = Math.floor(duration / 3600);
          const minutes = Math.floor((duration % 3600) / 60);
          const timeString = `${hours} hours and ${minutes} minutes`;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${
            puntos[0].location
          }&destination=${puntos[puntos.length - 1].location}&waypoints=${puntos
            .slice(1, -1)
            .map((punto) => punto.location)
            .join("|")}&travelmode=driving`;
          setTravel(url);
          const coordenadasApi = coordinates.map((coordenadas) => {
            return {
              lat: coordenadas[0],
              lng: coordenadas[1],
            };
          });
          setTime([hours, minutes]);
          const distance = route.legs.reduce(
            (acc, leg) => acc + leg.distance.value,
            0
          );
          setDistance(distance / 1000);

          const distances = [];
          for (let i = 0; i < coordenadasApi.length - 1; i++) {
            const from = new google.maps.LatLng(coordenadasApi[i]);
            const to = new google.maps.LatLng(coordenadasApi[i + 1]);
            const distance =
              google.maps.geometry.spherical.computeDistanceBetween(from, to);
            distances.push(distance);
          }

          setDistances(distances);
          setPointDistance(distances);
          //console.log(coordenadasApi)

          elevationService.getElevationAlongPath(
            {
              path: coordenadasApi,
              samples: 256,
            },
            (results, status) => {
              if (status === google.maps.ElevationStatus.OK) {
                // Obtener las elevaciones de los puntos de la ruta
                console.log(results);
                const elevations = results.map((result) => result.elevation);
                // Las elevaciones están en metros
                const promelevation = (
                  elevations.reduce(
                    (acumulador, numero) => acumulador + numero,
                    0
                  ) / elevations.length
                ).toFixed(2);
                console.log(`el promedio es ${promelevation}`);
                setElevationProm(promelevation);
                setElevationsg(elevations);

                const data = coordenadasApi.map((coordenada, index) => ({
                  Latitude: coordenada.lat,
                  Longitude: coordenada.lng,
                  Elevation: elevations[index],
                  Distance: distances[index],
                  PromElevation: promelevation,
                  time: timeString,
                }));
                console.log(time);
                setDataRoutestoExport(data);
              } else {
                console.error(`Error al obtener la elevación: ${status}`);
              }
            }
          );

          // Las coordenadas están en formato [latitud, longitud]

          setLugares(coordinates);
        } else {
          console.error(`Error al obtener la dirección: ${status}`);
          setShowe(true);
        }
      });
    }
  }, [context]);
  console.log(distances);

  const customIcon = L.icon({
    iconUrl: "https://img.icons8.com/color/256/circled-dot.png",
    iconSize: [20, 20], // tamaño del icono
  });

  const accessionsArreglo = prueba.map((objeto) => objeto.accessions);

  const [clickedMarkerIndices, setClickedMarkerIndices] = useState(new Set());
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [datatoExport, setDataToExport] = useState([]);
  useEffect(() => {
    if (selectedMarkers.length > 0) {
      setDataToExport(selectedMarkers.map((dat) => dat.tooltipInfo));
    }
  }, [selectedMarkers]);

  //console.log(selectedMarkers)
  // console.log(datatoExport)
  useEffect(() => {
    if (carouselMajorItems && carouselMajorItems.length == 0) {
      setCarouselLandraceItems([]);
    }
  }, [carouselMajorItems]);

  const handleClick = (index, tooltipInfo) => {
    const newSet = new Set(clickedMarkerIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
      setSelectedMarkers(
        selectedMarkers.filter((marker) => marker.index !== index)
      );
    } else {
      newSet.add(index);
      setSelectedMarkers([...selectedMarkers, { index, tooltipInfo }]);
    }
    setClickedMarkerIndices(newSet);
    console.log("marker clicked", index);
  };

  console.log(selectedMarkers);

  const customControl = L.control({ position: "topright" });
  console.log(datatoExport);
  console.log(datatoExport.length);

  const handleButtonClick = () => {
    // Tu lógica de código aquí
    console.log("¡El botón ha sido clickeado!");
  };
console.log(image)
var initLat = 38.9761;
var initLon = -77.4875;

var imageUrl = 'data:image/jpeg;base64,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6yx8szlgyElvq5r42nHbcQBiaen6qlmoRNL069q9O/B8IIruQVYgvgAr3557nnidHasH0mi3TQDuV3T7K2B/Bzx9pehRvifQWjw9TqbzWFb9DTVtipcKSxbIzY+0HzHAGQMesltX/wBxp2OjJ01YrO24IFfhfKEVx5UGBk45H047zd1nwvXZeuqYeO6LhBazPWnuUTOATxzjP3nz8R9H1Osp+X8bwUYjxFrXazoOdgds7c/j/wBt/BB1lhpl0+iKrqrHcWPjcagzlntb3cjG0dySD2UkYekX2act02sNbY2UF2BmtFJUvYefOEKgDHLfbJFq6f09qa/CpqTTgAgOWNthOMbiTjJ7ckma/wAP/DjaNXVHDNYzPbcy7tQ7sckk8KPtxx95bfRCJSdJq/ldCqGx6la4bT4aKWI8RyP68AHk5Yg9skjL8S9Mdq6tHp1LlrKhe+M7awGD84ILkN6988yyV/D1Aax9nmsKmw5JZiOBuJ5Mk6NKiABQAB6SdCJq6WLVVLKlSpBWErzn6GDISR7FVIHv+JM0UKgwqgfiZZ7JaEREgREQEREBERAREQEREBERAREQEREBERAREQPMRiexA8xGJ7EBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERA//9k=';
var imageBounds = [[initLat + 3, initLon + 3], [initLat - 3, initLon - 3]];
  // Crea el componente de control personalizado

  const convertirA_CSV = (datatoExport) => {
    const cabecera = Object.keys(datatoExport[0]);
    const filas = datatoExport.map((obj) => cabecera.map((key) => obj[key]));
    filas.unshift(cabecera);
    return filas.map((fila) => fila.join(",")).join("\n");
  };
  const mapRef = useRef(null);
  useEffect(() => {
    if (accessions.length > 0) {
      const latLngs = accessions.map((coordenada) => [
        coordenada.latitude,
        coordenada.longitude,
      ]);
      const bounds = L.latLngBounds(latLngs);
      if (mapRef.current) {
        mapRef.current.flyToBounds(bounds, { padding: [200, 200] });
      }
    }
  }, [accessions]);
  const descargarCSV = () => {
    const contenidoCSV = convertirA_CSV(datatoExport);
    const nombreArchivo = "accessions.csv";
    const archivo = new File([contenidoCSV], nombreArchivo, {
      type: "text/csv;charset=utf-8",
    });
    saveAs(archivo); // Utilizar la función saveAs de FileSaver.js para descargar el archivo
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { value: "markers", label: "Show accessions" },
    { value: "layer", label: "Show gap" },
    { value: "both", label: "Show both" },
  ];

  const [option1Checked, setOption1Checked] = useState(true);
  const [option2Checked, setOption2Checked] = useState(true);
  console.log(option1Checked);
  console.log(option2Checked);
  const [currentLayer, setCurrentLayer] = useState('normal');

  
  return (
    <div className="mapDiv mx-0 p-0">
      <RouteError showe={showe} handleClosee={handleClosee} />

      <div
        className="div-filter-map"
        style={{
          backgroundColor: "transparent",
          zIndex: "1000",
          position: "relative",
        }}
      >
        <div className="px-4 py-2">
         
          {carouselMajorItems && carouselMajorItems.length > 0 && (
            //<Select options={options} onChange={setSelectedOption}></Select>
             <div class="image-container">
            <img  className="icon"
              src="https://unpkg.com/leaflet@1.2.0/dist/images/layers.png"
              alt="jejej"
            ></img>

            <div class="options">
              <label>
                <input type="checkbox" name="Markers"  checked={option1Checked} onChange={(e) => setOption1Checked(e.target.checked)} />
                Accesions
              </label>
              <label>
                <input type="checkbox" name="Gap" checked={option2Checked}
          onChange={(e) => setOption2Checked(e.target.checked)} />
                Gap
              </label>
            </div>
          </div>
          )}

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
                  src={`https://ciat.shinyapps.io/LGA_dashboard/_w_ff143018/crops_icons/${item
                    .split(" ")[0]
                    .toLowerCase()}.png`}
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
                {carouselMajorItems.length > 0 && (
                  <img
                    alt=""
                    src={`https://ciat.shinyapps.io/LGA_dashboard/_w_ff143018/crops_icons/${carouselMajorItems[0]
                      .split(" ")[0]
                      .toLowerCase()}.png`}
                    width="20"
                  />
                )}
                {item}
                <CloseButton
                  disabled
                  className="ms-1 close-button"
                ></CloseButton>
              </div>
            ))}
          {selectedMarkers &&
            selectedMarkers.length > 0 &&
            accessions.length > 0 && (
              <div className="div-inferior-derecha">
                <Button
                  variant="primary"
                  className="text-white accession"
                  type="submit"
                  onClick={descargarCSV}
                  id="button-downloadAccesion"
                >
                  Download accessions
                  <FontAwesomeIcon
                    className="search-icon"
                    icon={faDownload}
                  ></FontAwesomeIcon>
                </Button>
              </div>
            )}
        </div>
      </div>

      <MapContainer
        id="mapid mapLayer"
        ref={mapRef}
        center={[14.88, -35, 76]}
        zoom={3}
        maxBounds={[
          [90, -180.0],
          [-90, 180.0],
        ]}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
          top: "58px",
        }}
        zoomControl={false}
      >
        {option1Checked==true && option2Checked==false &&
        
          accessions &&
          accessions.length > 0 &&
          accessions.map((marker, index) =>
            marker.latitude && marker.longitude ? (
              <Marker
                eventHandlers={{
                  click: (e) => {
                    handleClick(index, {
                      Id: marker.id,
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
                    console.log("marker clicked", e);
                  },
                }}
                key={index}
                position={[marker.latitude, marker.longitude]}
                zIndex={15000+index}
                icon={
                  clickedMarkerIndices.has(index)
                    ? L.icon({
                        iconUrl:
                          "https://cdn-icons-png.flaticon.com/512/5610/5610944.png",
                        iconSize: [20, 20],
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
                  Institution: {marker.institution_name} <br /> Source:
                  {marker.source_database} id: {marker.ext_id}
                  <p>
                    {" "}
                    <strong>
                      click if you want to save this accession for export
                    </strong>{" "}
                  </p>
                </Tooltip>
              </Marker>
            ) : null
          )}

        {option1Checked==false && option2Checked==true  &&
          layerr.length > 0 &&
          layerr.map((layerr, index) => (
            <WMSTileLayer
              key={layerr}
              url="https://isa.ciat.cgiar.org/geoserver2/wms"
              layers={`gap_analysis:${layerr}`}
              format="image/png"
              transparent={true}
              zIndex={1000 + index}
            />
          ))}

        {option1Checked==true && option2Checked==true && (
          <>
            {accessions &&
              accessions.length > 0 &&
              accessions.map((marker, index) =>
                marker.latitude && marker.longitude ? (
                  <Marker
                    eventHandlers={{
                      click: (e) => {
                        handleClick(index, {
                          Id: marker.id,
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
                        console.log("marker clicked", e);
                      },
                    }}
                    key={index}
                    position={[marker.latitude, marker.longitude]}
                    zIndex={10000 + index}
                    icon={
                      clickedMarkerIndices.has(index)
                        ? L.icon({
                            iconUrl:
                              "https://cdn-icons-png.flaticon.com/512/5610/5610944.png",
                            iconSize: [20, 20],
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
                      Institution: {marker.institution_name} <br /> Source:
                      {marker.source_database} id: {marker.ext_id}
                      <p>
                        {" "}
                        <strong>
                          click if you want to save this accession for export
                        </strong>{" "}
                      </p>
                    </Tooltip>
                  </Marker>
                ) : null
              )}
            {layerr.length > 0 &&
              layerr.map((layerr, index) => (
                <WMSTileLayer
                  key={layerr}
                  url="https://isa.ciat.cgiar.org/geoserver2/wms"
                  layers={`gap_analysis:${layerr}`}
                  format="image/png"
                  transparent={true}
                  zIndex={1000 + index}
                />
              ))}
          </>
        )}

    

        {ubicaciones.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]}>
            <Popup>Destino: {index + 1}</Popup>
          </Marker>
        ))}

        <LayersControl position="topleft" className="mt-5">
          <LayersControl.BaseLayer checked name="Normal">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Relief">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        
       // {/* <ImageOverlay zIndex={1000} url={imageUrl} bounds={imageBounds} /> */}

        <Polyline color="lime" positions={lugares} weight={5} />
      </MapContainer>
    </div>
  );
}

export default Map;
