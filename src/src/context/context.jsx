import React,{useState,createContext} from "react";
export const DataContext = createContext();
export function DataContextProvider(props){
    const [context, setContext]= useState('');
    const [data, setData]= useState([]);
    const [layerc, setLayerc]= useState('');
    const [elevationsg, setElevationsg]= useState([]);
    const [distance, setDistance]= useState([]);
    const [time, setTime]= useState([]);
    const [travel, setTravel]= useState([]);
    const [elevationProm, setElevationProm]= useState([]);
    const [iso, setIso]= useState([]);
    const [pointDistance, setPointDistance]= useState([]);
    return(
        <DataContext.Provider value={{context,setContext,data,setData,layerc,setLayerc,elevationsg,setElevationsg,distance, setDistance,time, setTime,travel, setTravel,elevationProm, setElevationProm,iso, setIso,pointDistance, setPointDistance}} >
            {props.children}
            </DataContext.Provider>
    )
}
