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
    return(
        <DataContext.Provider value={{context,setContext,data,setData,layerc,setLayerc,elevationsg,setElevationsg,distance, setDistance,time, setTime,travel, setTravel,elevationProm, setElevationProm}} >
            {props.children}
            </DataContext.Provider>
    )
}
