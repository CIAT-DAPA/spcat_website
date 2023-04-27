import FilterLeft from "../../components/filterLeft/FilterLeft";
import Map from "../../components/map/Map";
import "./MapTools.css";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import FilterRight from "../../components/filterRight/FilterRight.jsx";
import axios from "axios";
import { steps, style } from "../../utilities/steps";
import { stepsMap } from "../../utilities/steps_map";
import Joyride from "react-joyride";
import { DataContext } from "../../context/context";
import RouteError from "../../components/routeError/RouteError";
import Loader from "../../components/loader/Loader";
import { async } from "regenerator-runtime";
const google = window.google;

function MapTools() {
  //states of vaiables
  const [statusFail, setStatusFail] = useState(false);
  const [showe, setShowe] = useState(false);
  const [placesCoordinates, setPlacesCoordinates] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const { metrics, setMerics } = useContext(DataContext);
  //state for loading
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //context
  const { places } = useContext(DataContext);

  const { elevationsPoints, setElevationsPoints } = useContext(DataContext);
  const { averageDistance, setAverageDistance } = useContext(DataContext);
  const { dataRoutestoExport, setDataRoutestoExport } = useContext(DataContext);
  const { distanBetween, setDistanceBetween } = useContext(DataContext);

  const { travelTime, setTravelTime } = useContext(DataContext);
  const { travel, setTravel } = useContext(DataContext);
  const { pointDistance, setPointDistance } = useContext(DataContext);
  const { elevationProm, setElevationProm } = useContext(DataContext);

  const handleClosee = () => {
    setShowe(false);
  }; // estado para controlar la visualización del Modal

  useEffect(() => {
    if (places.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const elevationService = new google.maps.ElevationService();
      const puntos = places.map((punto) => ({ location: punto }));
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

      Promise.resolve()
  .then(() => Promise.all(
    places.map((city) => getCoordsForCity(city))
  ))
  .then((coordsArray) => {
    console.log(coordsArray)
    setPlacesCoordinates(coordsArray);
    //getElevations(coordsArray)
    const promises = coordsArray.map((location) =>
      new Promise((resolve, reject) => {
        const latLng = new google.maps.LatLng(location.latitude, location.longitude);
        const request = { locations: [latLng] };
        const elevator = new google.maps.ElevationService();
        elevator.getElevationForLocations(request, (results, status) => {
          if (status === "OK" && results[0]) {
            resolve(results[0].elevation);
          } else {
            reject(new Error(`Error al obtener la elevación para ${latLng}: ${status}`));
          }
        });
      })
    );
    Promise.all(promises)
      .then((elevations) => {
        setElevationsPoints(elevations);
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });


        
      //  console.log(placesCoordinates)
      const request = {
        origin: puntos[0].location,
        destination: puntos[puntos.length - 1].location,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: puntos.slice(1, -1),
      };
      setShow(true);
      // Enviar la solicitud de dirección a la API de Google Maps
      directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          // Obtener las coordenadas de la ruta
          const route = response.routes[0];
          setDistanceBetween(route.legs.map((dat) => dat.distance.value));
          const geojson = {
            type: "FeatureCollection",
            features: [],
          };
          const coordinates = route.overview_path.map((point) => [
            point.lat(),
            point.lng(),
          ]);
          coordinates.forEach((coord) => {
            geojson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coord,
              },
              properties: {},
            });
          });
          const lineString = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
            properties: {},
          };

          geojson.features.push(lineString);
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

          setTravelTime([hours, minutes]);
          const distance = route.legs.reduce(
            (acc, leg) => acc + leg.distance.value,
            0
          );

          setAverageDistance(distance / 1000);

          const distances = [];
          const data = [];
          for (let i = 0; i < coordenadasApi.length - 1; i++) {
            const from = new google.maps.LatLng(coordenadasApi[i]);
            const to = new google.maps.LatLng(coordenadasApi[i + 1]);
            const distance =
              google.maps.geometry.spherical.computeDistanceBetween(from, to);
            distances.push(distance);
          }

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
                //console.log(results);
                const elevations = results.map((result) => result.elevation);
                // Las elevaciones están en metros
                const promelevation = (
                  elevations.reduce(
                    (acumulador, numero) => acumulador + numero,
                    0
                  ) / elevations.length
                ).toFixed(2);
                // console.log(`el promedio es ${promelevation}`);
                setElevationProm(promelevation);
                

                const data = coordenadasApi.map((coordenada, index) => ({
                  Latitude: coordenada.lat,
                  Longitude: coordenada.lng,
                  Elevation: elevations[index],
                  Distance: distances[index],
                  PromElevation: promelevation,
                  time: timeString,
                  Url: travel,
                }));
                const datat = [
                  {
                    averageDistance: distance / 1000,
                    AverageAltitue: promelevation,
                    EstimatedTime: timeString,
                    Url: url,
                  },
                ];
                setMerics(datat);

                setDataRoutestoExport(data);
              } else {
                console.error(`Error al obtener la elevación: ${status}`);
              }
            }
          );

          // Las coordenadas están en formato [latitud, longitud]

          setPolylineCoords(coordinates);
        } else {
          console.error(`Error al obtener la dirección: ${status}`);
          setShowe(true);
          setPlacesCoordinates([]);
          setPolylineCoords([]);
        }
        setShow(false);
      });
    }
  }, [places]);

 
console.log(elevationsPoints)

  


//console.log(elevationsPoints)
  
  
  

  const url = "http://127.0.0.1:5000/api/v1/countries";
  const [response, setResponse] = useState([]);
  useEffect(() => {
    const getCountries = async () => {
      try {
        const responde = await axios.get(url);
        setResponse(responde.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCountries();
  }, []);
  const urlCrops = "http://127.0.0.1:5000/api/v1/crops";
  const [crops, setCrops] = useState([]);
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

  const [carouselMajorItems, setCarouselMajorItems] = useState(null);
  const [carouselLandraceItems, setCarouselLandraceItems] = useState(null);
  const [showRoad, setShowRoad] = useState(false);
  const [indexStep, setIndexStep] = useState(0);
  const [indexStepMap, setIndexStepMap] = useState(0);
  const [tutorialFinished, setTutorialFinished] = useState(
    window.localStorage.getItem("tutorial") || false
  );
  const [tutorialMapFinished, setTutorialMapFinished] = useState(
    window.localStorage.getItem("tutorialMap") || false
  );

  useEffect(() => {
    window.localStorage.setItem("tutorial", true);
  }, [tutorialFinished]);

  useEffect(() => {
    window.localStorage.setItem("tutorialMap", true);
  }, [tutorialMapFinished]);

  return (
    <Row className="m-0 ">
      <RouteError showe={showe} handleClosee={handleClosee} />
      <Loader show={show} handleClose={handleClose} />

      <Col className="col-3 overflow-auto" style={{ height: "90vh" }}>
        <FilterLeft
          response={response}
          crops={crops}
          setCarouselMajorItems={setCarouselMajorItems}
          setCarouselLandraceItems={setCarouselLandraceItems}
          indexStep={indexStep}
          setIndexStep={setIndexStep}
        ></FilterLeft>
      </Col>
      <Col className="mx-0 px-0 ">
        <Map
          placesCoordinates={placesCoordinates}
          polylineCoords={polylineCoords}
          crops={crops}
          carouselMajorItems={carouselMajorItems}
          setCarouselMajorItems={setCarouselMajorItems}
          carouselLandraceItems={carouselLandraceItems}
          setCarouselLandraceItems={setCarouselLandraceItems}
          indexStep={indexStep}
          setIndexStep={setIndexStep}
          showRoad={showRoad}
          statusFail={statusFail}
        ></Map>
      </Col>
      <Col
        className="col-auto"
        style={{ zIndex: "1000", padding: 0, height: "91vh" }}
      >
        <FilterRight
          showRoad={showRoad}
          setShowRoad={setShowRoad}
          indexStep={indexStep}
          setIndexStepMap={setIndexStepMap}
        ></FilterRight>
      </Col>
      {!tutorialFinished && (
        <Joyride
          continuous
          showProgress
          showSkipButton={true}
          showStepsProgress={false}
          showCloseButton={false}
          hideBackButton
          callback={(data) => {
            const { action, index, status, type, lifecycle } = data;
            let currentIndex = indexStep;
            if (type === "error:target_not_found") {
              currentIndex++;
              setIndexStep(currentIndex);
            } else if (
              (index === 5 ||
                index === 0 ||
                index === 1 ||
                index === 2 ||
                index === 3 ||
                index === 6) &&
              lifecycle === "complete"
            ) {
              return;
            } else if (
              index === 4 &&
              lifecycle === "complete" &&
              action === "next" &&
              type === "step:after"
            ) {
              currentIndex++;
              setIndexStep(currentIndex);
            } else if (action === "skip") {
              setTutorialFinished(true);
            }
          }}
          stepIndex={indexStep}
          steps={steps}
          run
          styles={{
            options: {
              primaryColor: "#f56038",
              zIndex: 1000,
            },
            buttonNext: {
              display: indexStep !== 4 ? "none" : undefined,
            },
          }}
        />
      )}
      {showRoad && !tutorialMapFinished && (
        <Joyride
          continuous
          showProgress
          showSkipButton={true}
          showStepsProgress={false}
          showCloseButton={false}
          hideBackButton
          callback={(data) => {
            const { action, index, status, type, lifecycle } = data;
            let currentIndex = indexStepMap;
            console.log(data);
            if (type === "error:target_not_found") {
              currentIndex++;
              setIndexStepMap(currentIndex);
            } else if (
              (index === 5 || index === 1 || index === 3) &&
              lifecycle === "complete"
            ) {
              return;
            } else if (
              (index === 0 || index === 2) &&
              lifecycle === "complete" &&
              action === "next" &&
              type === "step:after"
            ) {
              currentIndex++;
              setIndexStepMap(currentIndex);
            } else if (action === "skip") {
              setTutorialMapFinished(true);
            }
          }}
          stepIndex={indexStepMap}
          steps={stepsMap}
          run
          styles={{
            options: {
              primaryColor: "#f56038",
              zIndex: 1000,
            },
            buttonNext: {
              display:
                indexStepMap !== 0 && indexStepMap !== 2 ? "none" : undefined,
            },
          }}
        />
      )}
    </Row>
  );
}

export default MapTools;
