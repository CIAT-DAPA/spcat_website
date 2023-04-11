import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
}) {
  const [majorCrops, setMajorCrops] = useState([]);
  useEffect(() => {
    if (crops && crops.length > 0) {
      const majorCropst = crops.map((crp) => crp.app_name);
      setMajorCrops([...majorCropst]);
    }
  }, [crops]);

  const { data, setData } = useContext(DataContext);
  const { layerc, setLayerc } = useContext(DataContext);
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
  };

  //console.log(countryIso)
  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    // acciones con el archivo subido, por ejemplo, leer la imagen y convertirla en una URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageURL = e.target.result;
      // actualizar el estado o realizar otras acciones con la URL de la imagen
      console.log(imageURL);
    };
    reader.readAsDataURL(selectedFile);
  };

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

  // console.log(groupNames)

  const gruposencarrousell = allgroupscrop.filter((grupo) =>
    carouselLandraceItemsNow.includes(grupo.group_name)
  ); //filre los grupos que estan em el crrousell

  const handleAddToMap = () => {
    if (countryIso.length == 0) {
      console.log("aun no hay nada");
      setShowc(true);
      // alert('Por favor seleccione un país');
      return;
    }
    setShouldReset(!shouldReset);
    setShouldAddToMap(true);
    setData(accessionData);
    setLayerc(layer);
  };

  const renderTooltip = (props) => <Tooltip>{props}</Tooltip>;

  return (
    <>
      <CountryModal showc={showc} handleClosec={handleClosec} />

      <Container className="mt-3">
        <Row className="align-items-center mb-3" id="select-country">
          <Col className="col-5 d-flex align-items-center" >
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
              <option  value="">Select country</option>
              {response.map((country) => (
                <>
                   <option key={country.id} value={country.name} >
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
            
          ></CheckFilter>
        )}

        {carouselMajorItemsNow && carouselMajorItemsNow.length == 1 && (
          <CheckFilter
            title="Landrace Crops"
            toolTipTitle="Step 3"
            toolTipDescription="Step 3: Select your landrace crops"
            onDataChange={handleDataLandraceCropChange}
            onChange={shouldReset}
            crop={groupNames}
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
          >
            Add to map
          </Button>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
          <Button
            variant="primary"
            className="text-white mb-3"
            onClick={() => fileInputRef.current.click()}
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload your gap
            analysis
          </Button>
        </div>
      </Container>
    </>
  );
}

export default FilterLeft;
