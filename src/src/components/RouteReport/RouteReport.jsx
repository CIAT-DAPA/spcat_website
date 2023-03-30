import React, { useState,useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../context/context";

const RouteReport = ({show,handleClose}) => {
  /* const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 */
  const { elevationsg } = useContext(DataContext);
  const { distance } = useContext(DataContext);

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
 

  return (
    <>
      

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Reporte de rutas</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '400px' }}>
          <p>
           {distance} kms
          </p>
          <ReactApexChart
            options={options}
            series={series}
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
    </>
  );
};

export default RouteReport;