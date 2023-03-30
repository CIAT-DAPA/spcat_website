import React,{useState,createContext} from "react";
export const DataContext = createContext();
export function DataContextProvider(props){
    const [context, setContext]= useState('');
    const [data, setData]= useState([]);
    const [layerc, setLayerc]= useState('');
    return(
        <DataContext.Provider value={{context,setContext,data,setData,layerc,setLayerc}} >
            {props.children}
            </DataContext.Provider>
    )
}
