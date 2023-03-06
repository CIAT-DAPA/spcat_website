import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Card, Collapse } from "react-bootstrap";
import './FilterRight.css'

import icon from '../../assets/icons/remove.png'

function FilterRight() {
  const [isVisible, setIsVisible] = useState(false);
  
  const [destinations, setDestinations] = useState([""]);

  function handleChange(event, index) {
    const newDestinations = [...destinations];
    newDestinations[index] = event.target.value;
    setDestinations(newDestinations);
  }

  function handleAdd() {
    setDestinations([...destinations, ""]);
  }

  function handleDelete(index) {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Aquí podrías enviar la información a un servidor o manejarla de alguna otra forma
    console.log(destinations);
  }
  


  return (
    <>
      <Button
        onClick={() => setIsVisible(!isVisible)}
        aria-controls="example-collapse-text"
        aria-expanded={isVisible}
      >
        <FontAwesomeIcon icon={faCaretDown} className={`text-light ${isVisible ? 'rotate-270' : 'rotate-90'}`} />
      </Button>
      <div style={{ minHeight: '150px' }}>
        <Collapse in={isVisible} dimension="width">
          <div id="example-collapse-text">
          <form onSubmit={handleSubmit}>
      {destinations.map((destination, index) => (
        <div key={index}>
          <input className="input"
            type="text"
            value={destination}
            onChange={(event) => handleChange(event, index)}
            placeholder={`Destino #${index + 1}`}
          />
          {destinations.length > 1 && ( 
            <>
            <FontAwesomeIcon className="text-danger icons" onClick={() => handleDelete(index)} icon={faCircleXmark} />
            </>
             
             
          )}
        </div>
      ))}
          <FontAwesomeIcon className="text-success icons" onClick={handleAdd} icon={faCirclePlus}/>
      <button type="submit">Buscar ruta</button>
    </form>
          </div>
        </Collapse>
      </div>
    </>
  );
}

export default FilterRight;
