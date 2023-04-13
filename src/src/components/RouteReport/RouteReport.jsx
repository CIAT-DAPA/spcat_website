import React, { useState,useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../context/context";
import './RouteReport.css'
import { saveAs } from 'file-saver'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import {Papa} from 'papaparse'
const RouteReport = ({show,handleClose}) => {
  /* const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 */
  const { elevationsg } = useContext(DataContext);
  const { distance } = useContext(DataContext);
  const { pointDistance } = useContext(DataContext);
  const { time } = useContext(DataContext);
  const { dataRoutestoExport } = useContext(DataContext);
  const {elevationProm} = useContext(DataContext);

 //console.log(dataRoutestoExport)


 const convertirA_CSV = (dataRoutestoExport) => {
  const cabecera = Object.keys(dataRoutestoExport[0]);
  const filas = dataRoutestoExport.map(obj => cabecera.map(key => obj[key]));
  filas.unshift(cabecera);
  return filas.map(fila => fila.join(',')).join('\n');
}

const descargarCSV = () => {
  const contenidoCSV = convertirA_CSV(dataRoutestoExport);
  const nombreArchivo = 'routereport.csv';
  const archivo = new File([contenidoCSV], nombreArchivo, { type: 'text/csv;charset=utf-8' });
  saveAs(archivo); // Utilizar la función saveAs de FileSaver.js para descargar el archivo
}
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
    },
    title: {
      text: "Elevation graph",
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238"
      },
    },
  }
 





  const seriest = [
    {
      name: "Elevation (mts)",
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
    },
    title: {
      text: "Distance graph",
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238"
      },
    },
  }
 
//console.log(elevationsg.length)
  return (
    
      <div className="container-fluid">

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
    
    {/* <button onClick={descargarCSV}>exportar</button> */}
    <Button 
    onClick={descargarCSV}
      variant="primary"
      className="text-white"
      type="submit"
      
    >
      Export
      <FontAwesomeIcon
        className="search-icon"
        icon={faDownload}
      ></FontAwesomeIcon>
    </Button>
  
</Modal.Body>

        <Modal.Footer>
         
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      </div>

      
    
  );
};

export default RouteReport;