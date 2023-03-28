import React,{useState,createContext} from "react";
export const DataContext = createContext();
export function DataContextProvider(props){
    const [context, setContext]= useState('');
    const [data, setData]= useState([]);
    return(
        <DataContext.Provider value={{context,setContext,data,setData}} >
            {props.children}
            </DataContext.Provider>
    )
}
