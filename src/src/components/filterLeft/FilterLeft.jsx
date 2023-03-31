import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Form, Container, Col, Button } from "react-bootstrap";
import CheckFilter from "../checkFilter/CheckFilter";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect, useContext } from "react";
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
  };

  //console.log(countryIso)
  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    // acciones con el archivo subido
    //console.log(selectedFile);
  };

  if (shouldAddToMap) {
    setCarouselMajorItems(carouselMajorItemsNow);
    setCarouselLandraceItems(carouselLandraceItemsNow);
    setShouldAddToMap(false);
  }
  console.log(carouselLandraceItemsNow);

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
        .get(`http://localhost:5000/api/v1/groupsbyids?id=${cropId}`)
        .then((response) => {
          setAllGroupCrop(response.data);
          setLayer(countryIso + "_" + filteredCrops[0].name);
          const groupNames = response.data.map((group) => group.group_name);
          setGroupNames(groupNames);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setGroupNames([]);
    }
  }, [filteredCrops]);

  //console.log(layer)

  const gruposencarrousell = allgroupscrop.filter((grupo) =>
    carouselLandraceItemsNow.includes(grupo.group_name)
  ); //filre los grupos que estan em el crrousell
  const idss = gruposencarrousell.map((obj) => obj.id).join(",");
  // ['Spring', 'Winter']   los grupos
console.log(idss)
  useEffect(() => {
    if (idss.length > 0) {
      setLayer([])
      const nuevoEstado = carouselLandraceItemsNow.map(elemento => `${layer}_${elemento}`);
      setLayer(nuevoEstado)
      console.log(layer)
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
  }, [idss]);

  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");

  useEffect(() => {
    if (idsCropss.length > 1) {
      setAccessionData([]);
      setData([]);
      const endopointAccesionsByCrop = `http://localhost:5000/api/v1/accessionsbyidcrop?id=${idsCropss}`;
      axios.get(endopointAccesionsByCrop).then((response) => {
        // 4. Manejar la respuesta de la solicitud HTTP
        //setAccesionDataByCrop(response.data)
        if (response.data[0]?.accessions) {

          setAccessionData(response.data.flatMap((crop) => crop.accessions));
        } else {
          setAccessionData(response.data);
        }
      });
    }
  }, [idsCropss]);

  console.log(layer)
  const handleAddToMap = () => {
    setShouldReset(!shouldReset);
    setShouldAddToMap(true);
    setData(accessionData);
    setLayerc(layer);
  };



  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col className="col-3">Country</Col>
        <Col>
          <Form.Select
            aria-label="Default select example"
            onChange={handleCountryChange}
          >
            {response.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {majorCrops && majorCrops.length > 0 && (
        <CheckFilter
          title="Major Crops"
          onDataChange={handleDataMajorCropChange}
          onChange={shouldReset}
          crop={majorCrops}
        ></CheckFilter>
      )}
      {carouselMajorItemsNow && carouselMajorItemsNow.length == 1 && (
        <CheckFilter
          title="Landrace Crops"
          onDataChange={handleDataLandraceCropChange}
          onChange={shouldReset}
          crop={groupNames}
        ></CheckFilter>
      )}
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
  );
}

export default FilterLeft;
