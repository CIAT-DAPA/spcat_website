import React, { useState,useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { DataContext } from "../../context/context";
import './RouteReport.css'
import { saveAs } from 'file-saver'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import JSZip from 'jszip';


import {Papa} from 'papaparse'
const RouteReport = ({show,handleClose}) => {
  /* const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 */
  const { elevationsPoints } = useContext(DataContext);
  const { averageDistance } = useContext(DataContext);
  const { pointDistance } = useContext(DataContext);
  const { travelTime } = useContext(DataContext);
  const { places } = useContext(DataContext);
  const { distanBetween } = useContext(DataContext);
  const { dataRoutestoExport } = useContext(DataContext);
  const {elevationProm} = useContext(DataContext);
const {metrics}=useContext(DataContext)


const convertirA_CSV = (metrics) => {
  const cabecera = Object.keys(metrics[0]);
  const filas = metrics.map(obj => cabecera.map(key => obj[key]));
  filas.unshift(cabecera);
  return filas.map(fila => fila.join(',')).join('\n');
}


const descargarCSV = () => {
  const contenidoCSV = convertirA_CSV(metrics);
  const nombreArchivoCSV = 'routereport.csv';
  const archivoCSV = new File([contenidoCSV], nombreArchivoCSV, { type: 'text/csv;charset=utf-8' });
  
  // Crear el objeto GeoJSON
  var geojson = {
    "type": "FeatureCollection",
    "features": []
  };
  dataRoutestoExport.forEach(function(punto) {
    var feature = {
      "type": "Feature",
      "properties": {"distance": punto.Distance, "elevation": punto.Elevation},
      "geometry": {
        "type": "Point",
        "coordinates": [punto.Longitude, punto.Latitude]
      }
    };
    geojson.features.push(feature);
  });
  var geojson_str = JSON.stringify(geojson);
  const nombreArchivoGeoJSON = 'points.geojson';
  const archivoGeoJSON = new File([geojson_str], nombreArchivoGeoJSON, { type: 'application/json' });
  
  // Crear el archivo zip
  var zip = new JSZip();
  zip.file(nombreArchivoCSV, archivoCSV);
  zip.file(nombreArchivoGeoJSON, archivoGeoJSON);
  
  // Descargar el archivo zip
  zip.generateAsync({type:"blob"}).then(function(content) {
    saveAs(content, "files.zip");
  });
}


/* console.log(elevationsPoints)
console.log(places) */



  const series = [
    {
      name: "Elevación (metros)",
      data: elevationsPoints,
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
      categories: places,
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
      name: `Distance Kms `,
      data: [0, ...distanBetween.map(distancia => distancia / 1000)],
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
      categories: places,
      
      
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
 
      <p>Average distance {averageDistance} kms</p>
      <p>Estimated travel time {travelTime[0]} hours and {travelTime[1]} minutes</p>
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
         
          <Button variant="primary" className="text-white" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      </div>

      
    
  );
};

export default RouteReport;