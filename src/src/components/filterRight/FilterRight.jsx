import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
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

function FilterRight() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { context, setContext } = useContext(DataContext);
  const [isVisible, setIsVisible] = useState(false);
  const { travel } = useContext(DataContext);


  const [destinations, setDestinations] = useState([""]);
  const [places, setPlaces] = useState("");

  function handleChange(event, index) {
    const newDestinations = [...destinations];
    newDestinations[index] = event.target.value;
    setDestinations(newDestinations);
    console.log(newDestinations);
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
    setContext(destinations);
    setPlaces(destinations);
    console.log(destinations);
  }

  function handleAddToList(index) {
    const newContext = [...context, destinations[index]];
    setContext(newContext);
    console.log(newContext);
  }

  let key = "AIzaSyARbwF61yXA-0aEOfeDYanC-IpgfxMQL-w";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: key,
    libraries: ["places"],
  });
  if (!isLoaded) {
    return <div>no carga</div>;
  }

  return (
    <>
      <div className="right-container">
        <Button
          className="arrow-button"
          onClick={() => setIsVisible(!isVisible)}
          aria-controls="example-collapse-text"
          aria-expanded={isVisible}
          style={{borderRadius:"50%"}}
        >
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`text-light ${isVisible ? "rotate-270" : "rotate-90"}`}
          />
        </Button>
      </div>

      <div style={{ minHeight: "150px", height: "100%", backgroundColor:'white' }}>
        <Collapse in={isVisible} dimension="width">
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
                <Row key={index} className="row-destino">
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
                    onClick={handleAdd}
                    icon={faCirclePlus}
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
                >
                  Get route
                  <FontAwesomeIcon
                    className="search-icon"
                    icon={faMagnifyingGlass}
                  ></FontAwesomeIcon>
                </Button>

                
              </div>
              <div className="text-center mt-3">
  {travel.length>0 &&
    <Button 
      variant="primary"
      className="text-white"
      type="submit"
      href={travel}
      target='_blank'
    >
      Navegar a Destino
      <FontAwesomeIcon
        className="search-icon"
        icon={faCar}
      ></FontAwesomeIcon>
    </Button>
  }
 
</div>
            </form>
          </div>
        </Collapse>
      </div>
    </>
  );
}

export default FilterRight;
