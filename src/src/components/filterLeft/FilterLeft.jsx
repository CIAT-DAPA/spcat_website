import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import './FilterLeft.css'
import Papa from 'papaparse';
import Configuration from "../../conf/Configuration";

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
import ModalFileError from "../modalfile/ModalFileError";
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
  const{accesionsInput,setAccesionsInput}=useContext(DataContext);
  const [shouldAddToMap, setShouldAddToMap] = useState(false);
  const [carouselMajorItemsNow, setCarouselMajorItemsNow] = useState([]); //items del carusel en el momento
  const [carouselLandraceItemsNow, setCarouselLandraceItemsNow] =
    useState(null); //items de grupos de cultivo en el carrousel
  const [countryIso, setCountryIso] = useState(""); //iso del pais seleccionado
  const [shouldReset, setShouldReset] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputRefA = useRef(null);
  const [filteredCrops, setFilteredCrops] = useState([]); //cultivos ssleciionados

  const [groupNames, setGroupNames] = useState([]);
  const [allgroupscrop, setAllGroupCrop] = useState([]);
  const [accessionData, setAccessionData] = useState([]);
  const [accesionDataByCrop, setAccesionDataByCrop] = useState([]);
  const [layer, setLayer] = useState([]);
  const { image, setImage } = useContext(DataContext);
  var filep=''
  const [showc, setShowc] = useState(false);
   // estado para controlar la visualización del Modal

  const [showF, setShowF] = useState(false);
  const handleCloseF = () => setShowF(false);
  const handleShowF = () => setShowF(true);

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
  const[titleModal,setTitlemodal]=useState('')
  const [textModal, setTextModal] = useState('');
  
  //console.log(countryIso)
  
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    filep=file

    // Leer el archivo TIFF
    const reader = new FileReader();
    reader.onload = () => {
      const tiffData = reader.result;

      parseGeoraster(tiffData).then((georaster) => {
//    
        var layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256,
        });
        setImage(layer);
       // console.log("layer:", layer);

        /* layer.addTo(map);

        map.fitBounds(layer.getBounds());
        document.getElementById("overlay").style.display = "none"; */
      });
    };
    reader.readAsArrayBuffer(file);
  };
  //console.log(filep.name)

  const clearInput=(e)=>{
    e.target.value=null;
  }

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
        .get(`${Configuration.get_url_api_base()}groups?id=${cropId}`)
        .then((response) => {
          setAllGroupCrop(response.data);
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



  const idsCropss = filteredCrops.map((obj) => obj.id).join(",");
  const handleRedirect = () => {
    window.open('https://github.com/CIAT-DAPA/spcat_website/raw/develop/src/src/data/example.csv', '_blank');
  };

const overlayInfo = "Info: your CSV file must have the following columns: 'id', 'species_name', 'ext_id', 'crop', 'landrace_group', 'country', 'institution_name', 'source_database', 'latitude', 'longitude', 'accession_id'. The order is not relevant, but the spelling is, as it will be used to display the accessions on the map. You can find an example by clicking in this info button"
//const overlayInfo= <p>Info: your CSV file must have the following columns: 'id', 'species_name', 'ext_id', 'crop', 'landrace_group', 'country', 'institution_name', 'source_database', 'latitude', 'longitude', 'accession_id'. The order is not relevant, but the spelling is, as it will be used to display the accessions on the map. you can find an example by clicking in this info button  </p>
  const handleAddToMap = () => {
    if (countryIso.length == 0) {
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
  const eraseAccesion = () => {
    setAccesionsInput(null);
    
  };
  
  const renderTooltip = (props) => <Tooltip>{props}</Tooltip>;
  const [data, setData] = useState(null);

  const handleFileInputChangee = (e) => {
    const file = e.target.files[0];
    if (!file.name.endsWith('.csv')) {
      setTitlemodal('you have not selected a file in CSV format')
      setTextModal('You must select a file in csv format')
      setShowF(true)
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: function(results) {
      const requiredHeaders = ['id', 'species_name', 'ext_id', 'crop', 'landrace_group', 'country', 'institution_name', 'source_database', 'latitude', 'longitude', 'accession_id'];
      const fileHeaders = Object.keys(results.data[0]);
      if (!requiredHeaders.every((header) => fileHeaders.includes(header))) {
        setTitlemodal('Invalid columns in csv file')
        setTextModal(`please check your file, the columns should be arranged like this: id', 'species_name', 'ext_id', 'crop', 'landrace_group', 'country', 'institution_name', 'source_database', 'latitude', 'longitude', 'accession_id `)
        setShowF(true)
        return;
      }

        setAccesionsInput(results.data);
      }
    });
  };
  return (
    <>
      <CountryModal showc={showc} handleClosec={handleClosec} />
      <ModalFileError show={showF} handleClose={handleCloseF} titleModal={titleModal} textModal={textModal}></ModalFileError>

      <Container className="mt-3">
        <Row className="align-items-center mb-3" id="select-country">
          <Col className="col-5 d-flex align-items-center">
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip("Step 1: Select your country")}
            >
              <span className="badge rounded-pill bg-primary me-1">Step 1</span>
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
            multiple
            type="file"
            accept=".tif"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            onClick={clearInput}
            ref={fileInputRef}
          />
           <input
            multiple
            type="file"
            accept=".csv"
            id="file-input"
            ref={fileInputRefA}
            style={{ display: "none" }}
            onChange={handleFileInputChangee}
            onClick={clearInput}
          />
          <div className="d-flex">
            {image ? (
              <>
                <Button
                  variant="danger"
                  className="text-white mb-3"
                  onClick={eraseLayer}
                >
                  <FontAwesomeIcon icon={faTrashCan} /> Delete your gap analysis
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                className="text-white mb-3"
                onClick={() => fileInputRef.current.click()}
              >
                <FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload your gap
                analysis
              </Button>
            )}
          </div>
          <div className="d-flex aling-items-center">
          {accesionsInput?.length>0 ? (
              <>
                <Button
                  variant="danger"
                  className="text-white mb-3"
                  onClick={eraseAccesion}
                >
                  <FontAwesomeIcon icon={faTrashCan} /> Delete your accesions
                </Button>
              </>
            ) : (
              <>
              
            <Button
              variant="primary"
              className="text-white "
              onClick={() => fileInputRefA.current.click()}
            >
              <FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload your accesions
            </Button>
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip(overlayInfo)}
            >
              <span onClick={handleRedirect} className="badge rounded-pill bg-primary me-1 h-100 info-t info ">i</span>
            </OverlayTrigger>
              </>
             
            )}
          </div>
          
        </div>
      </Container>
    </>
  );
}

export default FilterLeft;
