import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

/* import {tiff} from 'tiff.js'; */
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from "geotiff";

import GeoRasterLayer from "georaster-layer-for-leaflet";
import parseGeoraster from "georaster";

import L from "leaflet";
//import * as GeoTIFF from 'geotiff/src/main';

import {
  Row,
  Form,
  Container,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import CheckFilter from "../checkFilter/CheckFilter";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect, useContext } from "react";
import CountryModal from "../modalcountry/modalc";
import axios from "axios";
import { DataContext } from "../../context/context";
import { layerGroup } from "leaflet";
function FilterLeft({
  setCarouselMajorItems,
  setCarouselLandraceItems,
  response,
  crops,
  toggleImageVisibility,
  imageVisible,
  indexStep,
  setIndexStep,
}) {
  const [majorCrops, setMajorCrops] = useState([]);
  useEffect(() => {
    if (crops && crops.length > 0) {
      const majorCropst = crops.map((crp) => crp.app_name);
      setMajorCrops([...majorCropst]);
    }
  }, [crops]);

  const { iso, setIso } = useContext(DataContext);
  const [shouldAddToMap, setShouldAddToMap] = useState(false);
  const [carouselMajorItemsNow, setCarouselMajorItemsNow] = useState([]); //items del carusel en el momento
  const [carouselLandraceItemsNow, setCarouselLandraceItemsNow] =
    useState(null); //items de grupos de cultivo en el carrousel
  const [countryIso, setCountryIso] = useState(""); //iso del pais seleccionado
  const [shouldReset, setShouldReset] = useState(false);
  const fileInputRef = useRef(null);
  const [filteredCrops, setFilteredCrops] = useState([]); //cultivos ssleciionados

  const [groupNames, setGroupNames] = useState([]);
  const [allgroupscrop, setAllGroupCrop] = useState([]);
  const [accessionData, setAccessionData] = useState([]);
  const [accesionDataByCrop, setAccesionDataByCrop] = useState([]);
  const [layer, setLayer] = useState([]);
  const { image, setImage } = useContext(DataContext);

  const [showc, setShowc] = useState(false); // estado para controlar la visualización del Modal

  const handleClosec = () => {
    setShowc(false);
  }; // función para ocultar el Modal

  const handleDataMajorCropChange = (newData) => {
    setCarouselMajorItemsNow(newData);
  };

  const handleDataLandraceCropChange = (newData) => {
    setCarouselLandraceItemsNow(newData);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = response.find(
      (country) => country.name === e.target.value
    );
    setCountryIso(selectedCountry.iso_2);
    setIso(selectedCountry.iso_2);
    setTimeout(() => {
      setIndexStep(1);
    }, 200);
  };
 

  const [imageCoords, setImageCoords] = useState(null);
  const [dataaa, setDataa] = useState([]);
  //console.log(countryIso)
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    // Leer el archivo TIFF
    const reader = new FileReader();
    reader.onload = () => {
      const tiffData = reader.result;

      parseGeoraster(tiffData).then((georaster) => {
        console.log("georaster:", georaster);
        /*
            GeoRasterLayer is an extension of GridLayer,
            which means can use GridLayer options like opacity.
            Just make sure to include the georaster option!
            http://leafletjs.com/reference-1.2.0.html#gridlayer
        */
        var layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256,
        });
        setImage(layer);
        console.log("layer:", layer);

        /* layer.addTo(map);

        map.fitBounds(layer.getBounds());
        document.getElementById("overlay").style.display = "none"; */
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // console.log(image)

  if (shouldAddToMap) {
    setCarouselMajorItems(carouselMajorItemsNow);
    setCarouselLandraceItems(carouselLandraceItemsNow);
    setShouldAddToMap(false);
  }
  //console.log(carouselLandraceItemsNow);
  //console.log(countryIso)
  useEffect(() => {
    const filteredData = crops.filter((item) =>
      carouselMajorItemsNow.includes(item.app_name)
    );
    setFilteredCrops(filteredData);
  }, [crops, carouselMajorItemsNow]);

  //console.log(filteredCrops)
  useEffect(() => {
    if (filteredCrops.length === 1) {
      const cropId = filteredCrops[0].id;
      axios
        .get(`http://localhost:5000/api/v1/groups?id=${cropId}`)
        .then((response) => {
          setAllGroupCrop(response.data);
          console.log(allgroupscrop);
          setLayer(countryIso + "_" + filteredCrops[0].name);
          const groupsArray = response.data[0].groups.map(
            (group) => group.group_name
          );
          setGroupNames(groupsArray);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setGroupNames([]);
    }
  }, [filteredCrops]);

 

  const gruposencarrousell = allgroupscrop.filter((grupo) =>
    carouselLandraceItemsNow.includes(grupo.group_name)
  ); //filre los grupos que estan em el crrousell
 // const idss = gruposencarrousell.map((obj) => obj.id).join(",");
  // ['Spring', 'Winter']   los grupos
  //console.log(idss)
 /*  useEffect(() => {
    if (idss.length > 0) {
      setLayer([]);
      const nuevoEstado = carouselLandraceItemsNow.map(
        (elemento) => `${layer}_${elemento}`
      );
      setLayer(nuevoEstado);
      console.log(layer);
      const endpointaccesions = `http://localhost:5000/api/v1/accessionsbyidgroup?id=${idss}`;
      axios
        .get(endpointaccesions)
        .then((response) => {
          // 4. Manejar la respuesta de la solicitud HTTP
          setAccessionData(response.data);
        })
        .catch((error) => {
          console.log("Error en la solicitud HTTP:", error);
        });
    }
  }, [idss]); */

  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");



  //console.log(layer);
  const handleAddToMap = () => {
    if (countryIso.length == 0) {
      console.log("aun no hay nada");
      setShowc(true);
      setIndexStep(3);
      // alert('Por favor seleccione un país');
      return;
    }
    setIndexStep(4);
    setShouldReset(!shouldReset);
    setShouldAddToMap(true);
  };
  const eraseLayer = () => {
    setImage(null);
  };

  const renderTooltip = (props) => <Tooltip>{props}</Tooltip>;

  return (
    <>
      <CountryModal showc={showc} handleClosec={handleClosec} />

      <Container className="mt-3">
        <Row className="align-items-center mb-3" id="select-country">
          <Col className="col-5 d-flex align-items-center">
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip("Step 1: Select your country")}
            >
              <span class="badge rounded-pill bg-primary me-1">Step 1</span>
            </OverlayTrigger>
            Country
          </Col>
          <Col>
            <Form.Select
              aria-label="Default select example"
              onChange={handleCountryChange}
            >
              <option value="">Select country</option>
              {response.map((country) => (
                <>
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                </>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {majorCrops && (
          <CheckFilter
            title="Major Crops"
            toolTipTitle="Step 2"
            toolTipDescription="Step 2: Select your crops"
            onDataChange={handleDataMajorCropChange}
            onChange={shouldReset}
            crop={majorCrops}
            idOnboarding="select-majorCrop"
            indexStep={indexStep}
            setIndexStep={setIndexStep}
          ></CheckFilter>
        )}

        {carouselMajorItemsNow && carouselMajorItemsNow.length == 1 && (
          <CheckFilter
            title="Landrace Crops"
            toolTipTitle="Step 3"
            toolTipDescription="Step 3: Select your landrace crops"
            onDataChange={handleDataLandraceCropChange}
            itemm={carouselMajorItemsNow}
            onChange={shouldReset}
            crop={groupNames}
            idOnboarding="select-landraceCrop"
            indexStep={indexStep}
            setIndexStep={setIndexStep}
          ></CheckFilter>
        )}
        {carouselMajorItemsNow &&
          (carouselMajorItemsNow.length > 1 ||
            carouselMajorItemsNow.length < 1) && (
            <CheckFilter
              title="Landrace Crops"
              toolTipTitle="Step 3"
              toolTipDescription="Step 3: Select your landrace crops"
              onDataChange={handleDataLandraceCropChange}
              onChange={shouldReset}
              crop={[]}
              idOnboarding="select-landraceCrop"
            ></CheckFilter>
          )}
        {/*  {carouselMajorItemsNow && carouselMajorItemsNow.length ==0 && (
        <CheckFilter
          title="Landrace Crops"
          onDataChange={handleDataLandraceCropChange}
          onChange={shouldReset}
          crop={[]}
        ></CheckFilter>
      )} */}
        <div className="d-flex flex-column align-items-center gap-2 mt-3">
          <Button
            variant="primary"
            className="w-50 text-white"
            onClick={handleAddToMap}
            id="button-addToMap"
          >
            Add to map
          </Button>
          <input
            type="file"
            accept=".tif"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
          <div className="d-flex">
            <Button
              variant="primary"
              className="text-white mb-3 "
              onClick={() => fileInputRef.current.click()}
            >
              <FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload your gap
              analysis
            </Button>
            {image && (
              <FontAwesomeIcon
                className="icons mt-2 ml-2 text-primary"
                onClick={eraseLayer}
                icon={faCircleXmark}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export default FilterLeft;
