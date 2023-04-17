import { React, useState, useEffect, useContext, useRef, Control } from "react";
import { CloseButton, Button, Form } from "react-bootstrap";
import { DataContext } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import RouteError from "../routeError/RouteError";
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
  ImageOverlay,
} from "react-leaflet";
import "./Map.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import axios from "axios";

//const { BaseLayer } = LayersControl;
function Map({
  carouselMajorItems,
  setCarouselMajorItems,
  carouselLandraceItems,
  setCarouselLandraceItems,
  indexStep,
  setIndexStep,
  crops,
  placesCoordinates,
  polylineCoords
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

 
  const { iso } = useContext(DataContext);
  const { image } = useContext(DataContext);

  const [layerr, setLayerr] = useState([]);


  const [groups, setGroups] = useState([]);

  const [accessions, setAccessions] = useState([]);
  const [filteredgroups, setFilteredGroups] = useState([]);
 

  const [filteredCrops, setFilteredCrops] = useState([]);
  useEffect(() => {
    if (carouselMajorItems !== null) {
      const filteredData = crops.filter((item) =>
        carouselMajorItems.includes(item.app_name)
      );
      setFilteredCrops(filteredData);
    }
  }, [crops, carouselMajorItems]);


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

      axios
        .get(
          `http://localhost:5000/api/v1/accessionsbyidcrop?id=${cropId}&iso=${iso}`
        )
        .then((response) => {
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
  }, [carouselLandraceItems, groups]);


  const idsgroups = filteredgroups.map((obj) => obj.id).join(",");
  const extidsgroup = filteredgroups
    .map((obj) => obj.ext_id)
    .join(",")
    .split(",");

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
          setAccessions(response.data.flatMap((crop) => crop.accessions));
        })
        .catch((error) => {
        });
    } else if (
      carouselLandraceItems != null &&
      carouselLandraceItems.length == 0
    ) {
      setAccessions([]);
    }
  }, [filteredgroups]);

  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");
  const extids = filteredCrops
    .map((obj) => obj.ext_id)
    .join(",")
    .split(",");

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

  const customIcon = L.icon({
    iconUrl: "https://img.icons8.com/color/256/circled-dot.png",
    iconSize: [20, 20], // tamaño del icono
  });

 

  const [clickedMarkerIndices, setClickedMarkerIndices] = useState(new Set());
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [datatoExport, setDataToExport] = useState([]);
  useEffect(() => {
    if (selectedMarkers.length > 0) {
      setDataToExport(selectedMarkers.map((dat) => dat.tooltipInfo));
    }
  }, [selectedMarkers]);

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
        coordenada.longitude +5,
      ]);
      const bounds = L.latLngBounds(latLngs);
      if (mapRef.current) {
        mapRef.current.flyToBounds(bounds, { padding: [250, 250] });
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
    setIndexStep(12);
  };
  const [option1Checked, setOption1Checked] = useState(true);
  const [option2Checked, setOption2Checked] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    // Borra la imagen anterior si existe
    if (currentImage) {
      currentImage.remove();
    }
    // Agrega la nueva imagen
    if (image != undefined) {
      image.options.zIndex = 1000;
      image.addTo(mapRef.current);
      mapRef.current.flyToBounds(image.getBounds());
      //image._image.style.backfaceVisibility = 'hidden';
    }

    // Actualiza el estado con la nueva imagen
    setCurrentImage(image);
  }, [image]);

  return (
    <div className="mapDiv mx-0 p-0 " id="mapLayer">
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
                    src={require(`../../assets/icons/${item.split(' ')[0].toLowerCase()}.png`)}

                    width="20"
                  />
                  {" "}
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
                    src={require(`../../assets/icons/${carouselMajorItems[0]
                      .split(" ")[0]
                      .toLowerCase()}.png`)}

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
        {carouselMajorItems && carouselMajorItems.length > 0 && (
          //<Select options={options} onChange={setSelectedOption}></Select>
          <div class="image-container ">
            <img
              className="icon"
              src="https://unpkg.com/leaflet@1.2.0/dist/images/layers.png"
              alt="jejej"
            ></img>

            <div class="options">
              <label>
                <input
                  type="checkbox"
                  name="Markers"
                  checked={option1Checked}
                  onChange={(e) => setOption1Checked(e.target.checked)}
                />
                Accesions
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Gap"
                  checked={option2Checked}
                  onChange={(e) => setOption2Checked(e.target.checked)}
                />
                Gap
              </label>
            </div>
          </div>
        )}
      </div>

      <MapContainer
        id="mapid"
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
        {option1Checked == true &&
          option2Checked == false &&
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
                zIndex={15000 + index}
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
        {option1Checked == false &&
          option2Checked == true &&
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
        {option1Checked == true && option2Checked == true && (
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
                        setTimeout(() => {
                          console.log("tIME");
                          setIndexStep(11);
                        }, 200);
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
        {placesCoordinates.map((marker, index) => (
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
        //{" "}
        {/* <ImageOverlay zIndex={1000} url={imageUrl} bounds={imageBounds} /> */}
        <Polyline color="lime" positions={polylineCoords} weight={5} />
      </MapContainer>
    </div>
  );
}

export default Map;
