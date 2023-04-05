import React, { useState,useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../context/context";
import './RouteReport.css'
const RouteReport = ({show,handleClose}) => {
  /* const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 */
  const { elevationsg } = useContext(DataContext);
  const { distance } = useContext(DataContext);
  const { pointDistance } = useContext(DataContext);
  const { time } = useContext(DataContext);
  const {elevationProm} = useContext(DataContext);

  const series = [
    {
      name: "Elevación (metros)",
      data: elevationsg,
    },
    
  ];
  const options = {
    /* theme:{
          mode:'dark'
        }, */
    chart: {
      height: 300,
      type: "line",
    },
    xaxis: {
      categories: [],
      tickAmount: 6,
      
    },
    yaxis: {
      decimalsInFloat: 2,
    }
  }
 





  const seriest = [
    {
      name: "Elevación (metros)",
      data: pointDistance,
    },
    
  ];
  const optionst = {
    /* theme:{
          mode:'dark'
        }, */
    chart: {
      height: 300,
      type: "line",
    },
    xaxis: {
      categories: pointDistance.map((_, index) => `Ubicación ${index + 1}`),
      tickAmount: 6,
      
    },
    yaxis: {
      decimalsInFloat: 2,
    }
  }
 
console.log(elevationsg.length)
  return (
    
      

      <Modal dialogClassName="modal-height" scrollable={true} show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Route Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
 
      <p>Average distance {distance} kms</p>
      <p>Estimated travel time {time[0]} hours and {time[1]} minutes</p>
      <p>Average travel altitude {elevationProm} mts</p>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
      <ReactApexChart
        options={optionst}
        series={seriest}
        type="line"
        height={350}
      />
    
    
  
</Modal.Body>

        <Modal.Footer>
         
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    
  );
};

export default RouteReport;