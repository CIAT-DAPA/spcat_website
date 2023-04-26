import { React, useState, useEffect, useContext, useRef, Control } from "react";
import { CloseButton, Button, Form } from "react-bootstrap";
import { DataContext } from "../../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import RouteError from "../routeError/RouteError";
import { saveAs } from "file-saver";
import MapLegend from "../mapLegend/MapLegend";
import Loader from "../loader/Loader";
import NoGaps from "../nogapsmodal/NoGaps";
import LayersMarkers from "../LayersMarkers/LayersMarkers";
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
  polylineCoords,
  showRoad,
}) {
  const [showe, setShowe] = useState(false); // estado para controlar la visualización del Modal

  const handleClosee = () => {
    setShowe(false);
  };
  //actions for modal loading
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //action for modal no gaps
  const [showg, setShowg] = useState(false);
  const { places } = useContext(DataContext);
  const [pruebita, setPruebita] = useState(false);

  const handleCloseg = () => setShowg(false);
  const handleShowg = () => setShowg(true);

  const handleRemoveFromMajorCarousel = (index) => {
    const itemToRemove = carouselMajorItems.splice(index, 1)[0];
    setCarouselMajorItems([...carouselMajorItems]);
    const colorToRemove = colors[index];
    const newcolores = [...colors.slice(0, index), ...colors.slice(index + 1)];
    setColors(newcolores);
  };
  const colorsInitialState = [
    "#FF5733", // Naranja
    "#8B78E6", // Morado
    "#FFC300", // Amarillo brillante
    "#00BFFF", // Azul claro
    "#FF69B4", // Rosa
    "#1E90FF", // Azul brillante
    "#008000", // Verde claro
  ];
  const [colors, setColors] = useState(colorsInitialState);
  useEffect(() => {
    if (carouselLandraceItems?.length === 0) {
      setColors(colorsInitialState);
    }
  }, [carouselLandraceItems]);
  useEffect(() => {
    if (carouselMajorItems?.length === 0) {
      setColors(colorsInitialState);
    }
  }, [carouselMajorItems]);
  const handleRemoveFromLandraceCarousel = (index) => {
    const itemToRemove = carouselLandraceItems.splice(index, 1)[0];
    const colorToRemove = colors[index];
    const newcolores = [...colors.slice(0, index), ...colors.slice(index + 1)];
    setColors(newcolores);

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
      setShow(true);
      const cropId = filteredCrops[0].id;
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr([`${iso}_${filteredCrops[0].ext_id}`]);

      axios
        .get(
          `http://localhost:5000/api/v1/accessionsbyidcrop?id=${cropId}&iso=${iso}`
        )
        .then((response) => {
          setShow(false);
          if (response.data[0].accessions.length === 0) {
            setShowg(true);
            setCarouselMajorItems([]);
          } else {
            setAccessions(response.data.flatMap((crop) => crop.accessions));
          }
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
      setShow(true);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      const cropId = filteredCrops[0].id;

      axios
        .get(`http://localhost:5000/api/v1/groups?id=${cropId}`)
        .then((response) => {
          setShow(false);
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
    .filter((obj) => carouselLandraceItems.includes(obj.group_name))
    .sort(
      (a, b) =>
        carouselLandraceItems.indexOf(a.group_name) -
        carouselLandraceItems.indexOf(b.group_name)
    )
    .map((obj) => obj.ext_id);

  useEffect(() => {
    if (carouselLandraceItems != null && carouselLandraceItems.length > 0) {
      setShow(true);
      setAccessions([]);
      //let hola= filteredgroups.ma
      const newArray = extidsgroup.map((element) => `${iso}_${element}`);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr(newArray);
      axios
        .get(
          `http://localhost:5000/api/v1/accessionsbyidgroup?id=${idsgroups}&iso=${iso}`
        )
        .then((response) => {
          setShow(false);
          if (response.data[0].accessions.length === 0) {
            setShowg(true);
            setCarouselMajorItems([]);
          } else {
            setAccessions(response.data.flatMap((crop) => crop.accessions));
          }
        })
        .catch((error) => {});
    } else if (
      carouselLandraceItems != null &&
      carouselLandraceItems.length == 0
    ) {
      setAccessions([]);
    }
  }, [filteredgroups]);
  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");
  const extids = filteredCrops
    .filter((obj) => carouselMajorItems.includes(obj.app_name))
    .sort(
      (a, b) =>
        carouselMajorItems.indexOf(a.app_name) -
        carouselMajorItems.indexOf(b.app_name)
    )
    .map((obj) => obj.ext_id);
  filteredCrops
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
      setShow(true);
      const newArray = extids.map((element) => `${iso}_${element}`);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr(newArray);
      setAccessions([]);
      const endopointAccesionsByCrop = `http://localhost:5000/api/v1/accessionsbyidcrop?id=${idsCropss}&iso=${iso}`;

      axios.get(endopointAccesionsByCrop).then((response) => {
        setShow(false);

        const flatMapAccesons = response.data.flatMap(
          (crop) => crop.accessions
        );
        // 4. Manejar la respuesta de la solicitud HTTP
        if (flatMapAccesons.length > 0) {
          setAccessions(flatMapAccesons);
        } else {
          setShowg(true);
          setAccessions([]);
          setCarouselMajorItems([]);
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
      setShow(true);
      const newArray = extids.map((element) => `${iso}_${element}`);
      setSelectedMarkers([]);
      setClickedMarkerIndices(new Set());
      setLayerr(newArray);
      setAccessions([]);

      const endopointAccesionsByCrop = `http://localhost:5000/api/v1/accessionsbyidcrop?id=${idsCropss}&iso=${iso}`;

      axios.get(endopointAccesionsByCrop).then((response) => {
        setShow(false);
        const flatMapAccesions = response.data.flatMap(
          (crop) => crop.accessions
        );
        if (flatMapAccesions.length > 0) {
          setAccessions(flatMapAccesions);
        } else {
          setAccessions([]);
          setShowg(true);
          setCarouselMajorItems([]);
        }
      });
    }
  }, [carouselLandraceItems]);

  const customIcon = idcrop => {
    const namecrop = crops.filter(crop => crop.id === idcrop )[0].base_name;

    return L.icon({
      iconUrl: require(`../../assets/icons/${namecrop}.png`),
      iconSize: [30, 30], // tamaño del icono
      className:"drop"
    });
  };

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

 
  const descargarCSV = (data, fileName) => {
    if (!data || data.length === 0) {
      console.error("No hay datos para exportar");
      return;
    }

    const header = Object.keys(data[0]);
    const headerWithoutLastColumn = header.slice(0, -1); // crear un nuevo encabezado sin la última columna
    const rows = data.map((obj) => {
      const valuesWithoutLastColumn = Object.values(obj).slice(0, -1); // crear un nuevo arreglo de valores sin la última columna
      return valuesWithoutLastColumn;
    });
    rows.unshift(headerWithoutLastColumn);
    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const file = new File([csvContent], fileName, {
      type: "text/csv;charset=utf-8",
    });
    saveAs(file);
    setIndexStep(7);
  };

  const handleSelectedDownloadClick = () => {
    descargarCSV(datatoExport, "selected_accessions.csv");
  };

  const handleAllDownloadClick = () => {
    descargarCSV(accessions, "all_accessions.csv");
  };


  const mapRef = useRef(null);
  useEffect(() => {
    if (accessions.length > 0) {
      const latLngs = accessions.map((coordenada) => [
        coordenada.latitude,
        coordenada.longitude + 5,
      ]);
      const bounds = L.latLngBounds(latLngs);
      if (mapRef.current) {
        mapRef.current.flyToBounds(bounds, { padding: [250, 250] });
      }
    }
  }, [accessions]);

  const [option1Checked, setOption1Checked] = useState(true);
  const [option2Checked, setOption2Checked] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  useEffect(() => {
    {
      option1Checked == false &&
        option2Checked == true &&
        layerr.length > 0 &&
        setColors(colorsInitialState);
    }
  }, [option2Checked, option1Checked]);
  useEffect(() => {
    {
      option1Checked == true &&
        option2Checked == false &&
        layerr.length > 0 &&
        setColors(colorsInitialState);
    }
  }, [option2Checked, option1Checked]);

  useEffect(() => {
    option1Checked == true &&
      option2Checked == true &&
      layerr.length > 0 &&
      setColors(colorsInitialState);
  }, [option2Checked, option1Checked]);

  useEffect(() => {
    // Borra la imagen anterior si existe
    if (currentImage) {
      currentImage.remove();
      setCurrentImage(null);
    }
    // Agrega la nueva imagen
    if (image != null) {
      image.options.zIndex = 1000;
      //image.color = #0000ff
      image.addTo(mapRef.current);
      mapRef.current.flyToBounds(image.getBounds());
      //image._image.style.backfaceVisibility = 'hidden';
    }

    // Actualiza el estado con la nueva imagen
    setCurrentImage(image);
  }, [image]);
  return (
    <div className="mapDiv mx-0 p-0 " id="mapLayer">
      <Loader show={show} handleClose={handleClose} />
      <RouteError showe={showe} handleClosee={handleClosee} />
      <NoGaps showg={showg} handleCloseg={handleCloseg} />

      <div
        className="div-filter-map"
        style={{
          backgroundColor: "transparent",
          zIndex: "1000",
          position: "relative",
          width: "fit-content",
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
                  src={require(`../../assets/icons/${item
                    .split(" ")[0]
                    .toLowerCase()}.png`)}
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
        </div>
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
        <LayersMarkers
          option1Checked={option1Checked}
          option2Checked={option2Checked}
          accessions={accessions}
          clickedMarkerIndices={clickedMarkerIndices}
          setIndexStep={setIndexStep}
          customIcon={customIcon}
          layerr={layerr}
          selectedMarkers={selectedMarkers}
          setSelectedMarkers={setSelectedMarkers}
          setClickedMarkerIndices={setClickedMarkerIndices}
        />
        {placesCoordinates.map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]}>
            <Popup>{`Destino ${index + 1} : ${
              places[index].charAt(0).toUpperCase() + places[index].slice(1)
            }`}</Popup>
          </Marker>
        ))}
        <LayersControl position="topright" className="mt-5">
          <LayersControl.BaseLayer checked name="Normal">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Relief">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
          {accessions.length > 1 && (
            <>
              <LayersControl.Overlay name="Aceesions" checked={true}>
                <TileLayer
                  eventHandlers={{
                    add: (e) => {
                      setOption1Checked(true);
                    },
                    remove: (e) => {
                      setOption1Checked(false);
                    },
                  }}
                  url=""
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Gap" checked={true}>
                <TileLayer
                  url=""
                  eventHandlers={{
                    add: (e) => {
                      setOption2Checked(true);
                    },
                    remove: (e) => {
                      setOption2Checked(false);
                    },
                  }}
                />
              </LayersControl.Overlay>
            </>
          )}

          {/*  <LayersControl.Overlay name="Aceesions" 
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Gap">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            eventHandlers={{
              add: (e) => {
                console.log("Added Layer:", e.target);
                setPruebita(true)
              },
              remove: (e) => {
                console.log("Removed layer:", e.target);
                setPruebita(false)
              }
            }} />

          </LayersControl.Overlay> */}
        </LayersControl>
        //{" "}
        {/* <ImageOverlay zIndex={1000} url={imageUrl} bounds={imageBounds} /> */}
        <Polyline color="lime" positions={polylineCoords} weight={5} />
      </MapContainer>
      <MapLegend
        option2Checked={option2Checked}
        carouselLandraceItems={carouselLandraceItems}
        carouselMajorItems={carouselMajorItems}
        colors={colors}
      />
      {selectedMarkers &&
      selectedMarkers.length === 0 &&
      accessions.length > 0 ? (
        
        <div
        className={
          showRoad
            ? "div-inferior-derecha-showRoad"
            : "div-inferior-derecha"
        }
      >
          <Button
            variant="primary"
            className="text-white accession"
            onClick={handleAllDownloadClick}
          >
            Download all accessions
            <FontAwesomeIcon
              className="search-icon"
              icon={faDownload}
            ></FontAwesomeIcon>
          </Button>
        </div>
      ) : (
        selectedMarkers &&
        selectedMarkers.length > 0 &&
        accessions.length > 0 && (
          <div
            className={
              showRoad
                ? "div-inferior-derecha-showRoad"
                : "div-inferior-derecha"
            }
          >
            <Button
              variant="primary"
              className="text-white accession"
              type="submit"
              onClick={handleSelectedDownloadClick}
              id="button-downloadAccesion"
            >
              Download selected accessions
              <FontAwesomeIcon
                className="search-icon"
                icon={faDownload}
              ></FontAwesomeIcon>
            </Button>
          </div>
        )
      )}
    </div>
  );
}

export default Map;
