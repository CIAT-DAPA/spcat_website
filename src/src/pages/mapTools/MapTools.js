import FilterLeft from "../../components/filterLeft/FilterLeft";
import Map from "../../components/map/Map";
import "./MapTools.css";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import FilterRight from "../../components/filterRight/FilterRight.jsx";
import axios from "axios";
import { steps, style } from "../../utilities/steps";
import Joyride from "react-joyride";

function MapTools() {
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

  // const handleJoyrideCallback = (data) => {
  //   const { action, index, status, type } = data;
  //   if (index == 5) {
  //   }

  //   console.log(
  //     `Action: ${action} - Index: ${index} - Status: ${status} - Type: ${type}`
  //   );
  // };

  return (
    <Row className="m-0 ">
      <Col
        className="col-5 col-xxl-3 col-xl-4 overflow-auto"
        style={{ height: "91vh" }}
      >
        <FilterLeft
          response={response}
          crops={crops}
          setCarouselMajorItems={setCarouselMajorItems}
          setCarouselLandraceItems={setCarouselLandraceItems}
        ></FilterLeft>
      </Col>
      <Col className="mx-0 px-0 " id="mapLayer">
        <Map
          carouselMajorItems={carouselMajorItems}
          setCarouselMajorItems={setCarouselMajorItems}
          carouselLandraceItems={carouselLandraceItems}
          setCarouselLandraceItems={setCarouselLandraceItems}
        ></Map>
      </Col>
      <Col className="col-auto" style={{ zIndex: "1000" }}>
        <FilterRight
          showRoad={showRoad}
          setShowRoad={setShowRoad}
          indexStep={indexStep}
          setIndexStep={setIndexStep}
        ></FilterRight>
      </Col>
      <Joyride
        continuous
        showProgress
        showSkipButton
        callback={(data) => {
          const { action, index, status, type, lifecycle } = data;
          let currentIndex = indexStep;
          if (
            action === "next" &&
            lifecycle === "complete" &&
            indexStep !== 6
          ) {
            currentIndex++;
            setIndexStep(currentIndex);
          } else if (type === "error:target_not_found") {
            currentIndex++;
            setIndexStep(currentIndex);
          } else if (
            index === 6 &&
            lifecycle === "complete" &&
            action === "next" &&
            type === "step:after"
          ) {
            currentIndex++;
            setIndexStep(currentIndex);
          }
          console.log(data);
        }}
        stepIndex={indexStep}
        steps={steps}
        styles={style}
      />
    </Row>
  );
}

export default MapTools;
