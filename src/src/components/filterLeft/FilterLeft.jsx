import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./FilterLeft.css";

import Papa from "papaparse";
import axios from "axios";
import Configuration from "../../conf/Configuration";
import config from "./config.json";

import GeoRasterLayer from "georaster-layer-for-leaflet";
import parseGeoraster from "georaster";

import {
  Row,
  Form,
  Container,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { useRef, useState, useEffect, useContext } from "react";

import CheckFilter from "../checkFilter/CheckFilter";
import CountryModal from "../modalcountry/modalc";
import ModalFileError from "../modalfile/ModalFileError";
import { DataContext } from "../../context/context";

function FilterLeft({
  setCarouselMajorItems,
  setCarouselLandraceItems,
  response,     
  crops,        
  projects,     
  toggleImageVisibility, 
  imageVisible,         
  indexStep,
  setIndexStep,
}) {
  // UI state
  const [showLandraceGroups, setShowLandraceGroups] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(response);
  const [compProject, setCompProject] = useState("");
  const [majorCrops, setMajorCrops] = useState([]);

  // Context
  const { project, setProject } = useContext(DataContext);
  const { iso, setIso } = useContext(DataContext);
  const { accesionsInput, setAccesionsInput } = useContext(DataContext);
  const { image, setImage } = useContext(DataContext);

  // Workflow state
  const [shouldAddToMap, setShouldAddToMap] = useState(false);
  const [carouselMajorItemsNow, setCarouselMajorItemsNow] = useState([]); // selected major crops
  const [carouselLandraceItemsNow, setCarouselLandraceItemsNow] = useState(null);
  const [countryIso, setCountryIso] = useState(""); // selected country iso_2
  const [shouldReset, setShouldReset] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState([]); // selected crops objects (by app_name)

  // Landrace groups state
  const [groupNames, setGroupNames] = useState([]);
  const [allgroupscrop, setAllGroupCrop] = useState([]); 

  // File inputs refs
  const fileInputRef = useRef(null);  // tiff
  const fileInputRefA = useRef(null); // csv

  // Modal states
  const [showc, setShowc] = useState(false); // country modal
  const [showF, setShowF] = useState(false); // file error modal
  const [titleModal, setTitlemodal] = useState("");
  const [textModal, setTextModal] = useState("");

  // ---------- Helpers: project-scoped filtering ----------

  const getProjectCountries = (projKey, allCountries) => {
    const list = config.PROJECT_COUNTRIES?.[projKey];
    if (!Array.isArray(list) || list.length === 0) return allCountries;
    return allCountries.filter((c) => list.includes(c.name));
  };

  const getProjectWideCrops = (projKey, allCrops) => {
    const allowed = config.PROJECT_CROPS?.[projKey];
    if (!Array.isArray(allowed) || allowed.length === 0) {
      return allCrops.map((c) => c.app_name);
    }
    return allCrops
      .filter((c) => allowed.includes(c.app_name))
      .map((c) => c.app_name);
  };

  const getCountryOverrideCrops = (projKey, countryName) => {
    const m = config.COUNTRY_CROPS_BY_PROJECT?.[projKey];
    if (!m) return null;
    const arr = m[countryName];
    return Array.isArray(arr) && arr.length ? arr : null;
  };

  // ---------- Handlers ----------

  const handleProjectChange = (event) => {
    const projectKey = event.target.value;
    setCompProject(projectKey);
    setProject(projectKey);

    // Country restriction per project (empty/missing = all countries)
    setFilteredCountries(getProjectCountries(projectKey, response));

    // Only LGA shows landrace groups
    setShowLandraceGroups(projectKey === "lga");

    // Set project-wide crops (country may override after country selection)
    if (projectKey) {
      setMajorCrops(getProjectWideCrops(projectKey, crops));
    } else {
      setMajorCrops([]);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = response.find((c) => c.name === e.target.value);
    const iso2 = selectedCountry?.iso_2 || "";
    setCountryIso(iso2);
    setIso(iso2);

    // Apply country-specific crop overrides if defined; else fall back to project-wide
    if (compProject && selectedCountry?.name) {
      const override = getCountryOverrideCrops(compProject, selectedCountry.name);
      if (override && override.length) {
        setMajorCrops(override);
      } else {
        setMajorCrops(getProjectWideCrops(compProject, crops));
      }
    }

    // advance onboarding step
    setTimeout(() => {
      setIndexStep(1);
    }, 200);
  };

  const handleDataMajorCropChange = (newData) => {
    setCarouselMajorItemsNow(newData);
  };

  const handleDataLandraceCropChange = (newData) => {
    setCarouselLandraceItemsNow(newData);
  };

  const clearInput = (e) => {
    e.target.value = null;
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const GAP_COLOR = "#e31a1c";

    // Read TIFF/GeoTIFF
    const reader = new FileReader();
    reader.onload = () => {
      const tiffData = reader.result;
      parseGeoraster(tiffData).then((georaster) => {
        const nodata =georaster.noDataValue ?? georaster.nodataValue ?? georaster.nodata ?? null;
        const EPS = 1e-6;

      const pixelValuesToColorFn = (values) => {
        const v = values?.[0];
        if (v == null || Number.isNaN(v)) return null;               // transparent
        if (nodata != null && v === nodata) return null;              // transparent
        if (Math.abs(v - 3) <= EPS) return GAP_COLOR;                 // color only class 1
        return null;                                                  // everything else hidden
      };
        const layer = new GeoRasterLayer({
          georaster,
          opacity: 0.7,
          resolution: 256,
          resampleMethod: "nearest",
          pixelValuesToColorFn,
        });
        setImage(layer);
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const eraseLayer = () => {
    setImage(null);
  };

  const eraseAccesion = () => {
    setAccesionsInput(null);
  };

  const overlayInfo =
    "Info: your CSV file must have the following columns: 'species_name','latitude', 'longitude'. The order is not relevant, but the spelling is, as it will be used to display the accessions on the map. You can find an example by clicking in this info button";

  const renderTooltip = (props) => <Tooltip>{props}</Tooltip>;

  const handleRedirect = () => {
    window.open(
      "https://github.com/CIAT-DAPA/spcat_website/raw/develop/src/src/data/example.csv",
      "_blank"
    );
  };

  const handleAddToMap = () => {
    if (!countryIso) {
      setShowc(true);
      setIndexStep(3);
      return;
    }
    setIndexStep(4);
    setShouldReset(!shouldReset);
    setShouldAddToMap(true);
  };

  const handleFileInputChangee = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setTitlemodal("You have not selected a file in CSV format");
      setTextModal("You must select a file in CSV format.");
      setShowF(true);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const fileHeaders =
          results?.meta?.fields ||
          (results.data?.[0] ? Object.keys(results.data[0]) : []);

        if (!fileHeaders.length) {
          setTitlemodal("Empty/invalid CSV");
          setTextModal("No header row found in the CSV.");
          setShowF(true);
          return;
        }

        const requiredHeaders = [
          "species_name",
          //"ext_id",
          //"crop",
          //"landrace_group",
          //"country",
          //"institution_name",
          //"source_database",
          "latitude",
          "longitude",
          //"accession_id",
        ];

        const ok = requiredHeaders.every((h) => fileHeaders.includes(h));
        if (!ok) {
          setTitlemodal("Invalid columns in CSV file");
          setTextModal(
            "Please check your file. Required columns: 'id', 'species_name', 'ext_id', 'crop', 'landrace_group', 'country', 'institution_name', 'source_database', 'latitude', 'longitude', 'accession_id'."
          );
          setShowF(true);
          return;
        }

        const cleaned = results.data
        .map((r) => {
          const lat = parseFloat(String(r.latitude).trim());
          const lon = parseFloat(String(r.longitude).trim());
          return { ...r, latitude: lat, longitude: lon };
        })
        .filter((r) =>
          Number.isFinite(r.latitude) &&
          Number.isFinite(r.longitude) &&
          r.latitude >= -90 && r.latitude <= 90 &&
          r.longitude >= -180 && r.longitude <= 180
        );

      if (cleaned.length === 0) {
        setTitlemodal("No valid rows");
        setTextModal("No rows with valid latitude/longitude were found.");
        setShowF(true);
        return;
      }

     setAccesionsInput(cleaned);
      },
      error: function () {
        setTitlemodal("CSV parsing error");
        setTextModal("There was an error parsing the CSV file.");
        setShowF(true);
      },
    });
  };

  // ---------- Effects ----------

  // When user clicks "Add to map", propagate current selections upward
  useEffect(() => {
    if (shouldAddToMap) {
      setCarouselMajorItems(carouselMajorItemsNow);
      setCarouselLandraceItems(carouselLandraceItemsNow);
      setShouldAddToMap(false);
    }
  }, [shouldAddToMap, carouselMajorItemsNow, carouselLandraceItemsNow, setCarouselMajorItems, setCarouselLandraceItems]);

  // Keep a filtered list of crop objects matching selected app_names
  useEffect(() => {
    const filteredData = crops.filter((item) =>
      carouselMajorItemsNow.includes(item.app_name)
    );
    setFilteredCrops(filteredData);
  }, [crops, carouselMajorItemsNow]);

  // Fetch landrace groups only for LGA and only when exactly one crop is selected
  useEffect(() => {
    if (showLandraceGroups && filteredCrops.length === 1) {
      const cropId = filteredCrops[0].id;
      axios
        .get(`${Configuration.get_url_api_base()}groups?id=${cropId}`)
        .then((resp) => {
          setAllGroupCrop(resp.data);
          const groupsArray = resp.data?.[0]?.groups?.map((g) => g.group_name) || [];
          setGroupNames(groupsArray);
        })
        .catch((error) => {
          console.log(error);
          setGroupNames([]);
        });
    } else {
      setGroupNames([]);
    }
  }, [filteredCrops, showLandraceGroups, countryIso]);

  // Fallback: when project changes but no country selected yet, set project-wide crops
  useEffect(() => {
    if (compProject) setMajorCrops(getProjectWideCrops(compProject, crops));
    else setMajorCrops([]);
  }, [compProject, crops]);

  // ---------- Render ----------

  return (
    <>
      <CountryModal showc={showc} handleClosec={() => setShowc(false)} />
      <ModalFileError
        show={showF}
        handleClose={() => setShowF(false)}
        titleModal={titleModal}
        textModal={textModal}
      />

      <Container className="mt-3">
        {/* Step 1: Project */}
        <Row className="align-items-center mb-3" id="select-project">
          <Col className="col-5 d-flex align-items-center">
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip("Step 1: Select your project")}
            >
              <span className="badge rounded-pill bg-primary me-1">Step 1</span>
            </OverlayTrigger>
            Project
          </Col>
          <Col>
            <Form.Select aria-label="Select Project" onChange={handleProjectChange}>
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.ext_id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Step 2: Country */}
        <Row className="align-items-center mb-3" id="select-country">
          <Col className="col-5 d-flex align-items-center">
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip("Step 2: Select your country")}
            >
              <span className="badge rounded-pill bg-primary me-1">Step 2</span>
            </OverlayTrigger>
            Country
          </Col>
          <Col>
            <Form.Select aria-label="Select Country" onChange={handleCountryChange}>
              <option value="">Select Country</option>
              {filteredCountries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Step 3: Major Crops */}
        {majorCrops.length > 0 ? (
          <CheckFilter
            title="Major Crops"
            toolTipTitle="Step 3"
            toolTipDescription="Step 3: Select your crops"
            onDataChange={handleDataMajorCropChange}
            onChange={shouldReset}
            crop={majorCrops}
            idOnboarding="select-majorCrop"
            indexStep={indexStep}
            setIndexStep={setIndexStep}
          />
        ) : (
          <CheckFilter
            title="Major Crops"
            toolTipTitle="Step 3"
            toolTipDescription="No crops available"
            onDataChange={handleDataMajorCropChange}
            onChange={shouldReset}
            crop={[]}
            idOnboarding="select-majorCrop"
            indexStep={indexStep}
            setIndexStep={setIndexStep}
          />
        )}

        {/* Step 4: Landrace Groups (only for LGA, only when exactly one crop is selected) */}
        {showLandraceGroups && carouselMajorItemsNow && carouselMajorItemsNow.length === 1 && (
          <CheckFilter
            title="Landrace Groups"
            toolTipTitle="Step 4"
            toolTipDescription="Step 4: Select your landrace groups"
            onDataChange={handleDataLandraceCropChange}
            itemm={carouselMajorItemsNow}
            onChange={shouldReset}
            crop={groupNames}
            idOnboarding="select-landraceCrop"
            indexStep={indexStep}
            setIndexStep={setIndexStep}
          />
        )}
        {showLandraceGroups && carouselMajorItemsNow && (carouselMajorItemsNow.length !== 1) && (
          <CheckFilter
            title="Landrace Groups"
            toolTipTitle="Step 4"
            toolTipDescription="Step 4: Select your landrace groups"
            onDataChange={handleDataLandraceCropChange}
            onChange={shouldReset}
            crop={[]}
            idOnboarding="select-landraceCrop"
          />
        )}

        {/* Action buttons & uploads */}
        <div className="d-flex flex-column align-items-center gap-2 mt-3">
          <Button
            variant="primary"
            className="w-50 text-white"
            onClick={handleAddToMap}
            id="button-addToMap"
          >
            Add to map
          </Button>

          {/* GeoTIFF uploader */}
          <input
            type="file"
            accept=".tif,.tiff"
            id="file-input-tif"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            onClick={clearInput}
            ref={fileInputRef}
          />

          {/* CSV uploader */}
          <input
            type="file"
            accept=".csv"
            id="file-input-csv"
            ref={fileInputRefA}
            style={{ display: "none" }}
            onChange={handleFileInputChangee}
            onClick={clearInput}
          />

          <div className="d-flex">
            {image ? (
              <Button variant="danger" className="text-white mb-3" onClick={eraseLayer}>
                <FontAwesomeIcon icon={faTrashCan} /> Delete your gap analysis
              </Button>
            ) : (
              <Button
                variant="primary"
                className="text-white mb-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload your gap analysis
              </Button>
            )}
          </div>

          <div className="d-flex align-items-center">
            {accesionsInput?.length > 0 ? (
              <Button variant="danger" className="text-white mb-3" onClick={eraseAccesion}>
                <FontAwesomeIcon icon={faTrashCan} /> Delete your accessions
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  className="text-white"
                  onClick={() => fileInputRefA.current?.click()}
                >
                  <FontAwesomeIcon icon={faArrowUpFromBracket} /> Upload your accessions
                </Button>
                <OverlayTrigger placement="top" overlay={renderTooltip(overlayInfo)}>
                  <span
                    onClick={handleRedirect}
                    className="badge rounded-pill bg-primary ms-2 h-100 info-t info"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    title="Download CSV example"
                  >
                    i
                  </span>
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
