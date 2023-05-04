import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faEraser } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faCircle,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";
import RouteReport from "../RouteReport/RouteReport";
import { DataContext } from "../../context/context";

import { Button, Card, Col, Collapse, Row } from "react-bootstrap";
import "./FilterRight.css";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
} from "@react-google-maps/api";
//import icon from '../../assets/icons/remove.png'

function FilterRight({showRoad, setShowRoad, indexStep, setIndexStepMap}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { places, setPlaces } = useContext(DataContext);
  const { travel } = useContext(DataContext);

  const [destinations, setDestinations] = useState([""]);

  function handleChange(event, index) {
    const newDestinations = [...destinations];
    newDestinations[index] = event.target.value;
    setDestinations(newDestinations);
  }
  //h
  function handleAdd() {
    setDestinations([...destinations, ""]);
  }

  function handleDelete(index) {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  }

  const handleAutocompleteChange = (event, value, index) => {
    const newDestinations = [...destinations];
    newDestinations[index] = value;
    setDestinations(newDestinations);
  };

  function handleSubmit(event) {
    event.preventDefault();
    // Aquí podrías enviar la información a un servidor o manejarla de alguna otra forma
    setPlaces(destinations);
    setIndexStepMap(4);
  }

  function handleAddToList(index) {
    const newContext = [...places, destinations[index]];
    setPlaces(newContext);
  }
const cleanRoute=()=>{
  setDestinations([""])
  setPlaces([])
}


  return (
    <>
      <div className="right-container">
        <Button
          className="arrow-button"
          onClick={() => {
            setShowRoad(!showRoad);
          }}
          aria-controls="example-collapse-text"
          aria-expanded={showRoad}
          style={{ borderRadius: "50%", right: showRoad ?'-18px' :'0px'}}
          id="button-route"
        >
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`text-light ${showRoad ? "rotate-270" : "rotate-90"}`}
          />
        </Button>
      </div>

      <div
        style={{ minHeight: "150px", height: "100%", backgroundColor: "white" }}
      >
        <Collapse in={showRoad} dimension="width">
          <div id="example-collapse-text" className="pe-3">
            <div className="title-icon-container">
              <h5 className="route-title">Route</h5>
              <RouteReport show={show} handleClose={handleClose} />
              <FontAwesomeIcon
                onClick={handleShow}
                className="icon-info text-primary"
                icon={faCircleInfo}
              />
            </div>
            <form onSubmit={handleSubmit}>
              {destinations.map((destination, index) => (
                <Row
                  key={index}
                  className="row-destino"
                  id={`textare-city${index + 1}`}
                >
                  <Col className="d-flex flex-column justify-content-end me-0 px-0 ms-4">
                    <FontAwesomeIcon
                      onClick={handleAddToList}
                      className="text-success icons mb-1"
                      icon={faCircle}
                    />
                    <FontAwesomeIcon
                      onClick={handleAddToList}
                      className="text-success icons"
                      style={{ position: "relative", bottom: "-7%" }}
                      icon={faGripLinesVertical}
                    />
                  </Col>
                  <Col className="mx-0 px-0">
                    <input
                      className="input"
                      type="text"
                      value={destination}
                      onChange={(event) => handleChange(event, index)}
                      placeholder={`Destination #${index + 1}`}
                    />
                  </Col>

                  {destinations.length > 1 && (
                    <Col className="mx-0 px-0 d-flex align-items-center">
                      <FontAwesomeIcon
                        className="text-danger icons"
                        onClick={() => handleDelete(index)}
                        icon={faCircleXmark}
                      />
                    </Col>
                  )}
                </Row>
              ))}
              <Row className="d-flex w-100">
                <Col className="icons me-0  ms-4 col-1 align-self-center">
                  <FontAwesomeIcon
                    className="text-success "
                    onClick={() => {
                      handleAdd();
                      setTimeout(() => {
                        setIndexStepMap(2);
                      }, 200);
                    }}
                    icon={faCirclePlus}
                    id="button-addDestination"
                  />
                </Col>
                <Col className="p-destino ms-0 pt-2">
                  <p className="">Add destination</p>
                </Col>
              </Row>

              <div className="text-center">
                <Button
                  variant="primary"
                  className="text-white"
                  type="submit"
                  id="button-getRoute"
                >
                  Get route
                  <FontAwesomeIcon
                    className="search-icon"
                    icon={faMagnifyingGlass}
                  ></FontAwesomeIcon>
                </Button>
               
              </div>
              <div className="text-center mt-3">
                {places?.length>0&&(
                  <Button
                  variant="primary"
                  className="text-white"
                  
                  id="button-getRoute"
                  onClick={cleanRoute}
                >
                  Clean Route
                  <FontAwesomeIcon
                    className="search-icon"
                    icon={faEraser}
                  ></FontAwesomeIcon>
                </Button>
                )}
              
              </div>
             
              <div className="text-center mt-3">
                {travel.length > 0 && (
                  <Button
                    variant="primary"
                    className="text-white"
                    type="submit"
                    href={travel}
                    target="_blank"
                  >
                    Navigate to destination
                    <FontAwesomeIcon
                      className="search-icon"
                      icon={faCar}
                    ></FontAwesomeIcon>
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    </>
  );
}

export default FilterRight;
