import React,{useState,createContext} from "react";
export const DataContext = createContext();
export function DataContextProvider(props){
    const [places, setPlaces]= useState('');
    const [elevationsPoints, setElevationsPoints]= useState([]);
    const [averageDistance, setAverageDistance]= useState([]);
    const [travelTime, setTravelTime]= useState([]);
    const [travel, setTravel]= useState([]);
    const [elevationProm, setElevationProm]= useState([]);
    const [iso, setIso]= useState([]);
    const [pointDistance, setPointDistance]= useState([]);
    const [dataRoutestoExport, setDataRoutestoExport]= useState([]);
    const [metrics, setMerics]= useState([]);
    const [image, setImage] = useState(null);

    return(
        <DataContext.Provider value={{places,setPlaces,elevationsPoints, setElevationsPoints,averageDistance, setAverageDistance,travelTime, setTravelTime,travel, setTravel,elevationProm, setElevationProm,iso, setIso,pointDistance, setPointDistance,dataRoutestoExport, setDataRoutestoExport,image, setImage,metrics, setMerics}} >
            {props.children}
            </DataContext.Provider>
    )
}
