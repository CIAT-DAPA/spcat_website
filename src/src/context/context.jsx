import React,{useState,createContext} from "react";
export const DataContext = createContext();
export function DataContextProvider(props){
    const [context, setContext]= useState('');
    return(
        <DataContext.Provider value={{context,setContext}} >
            {props.children}
            </DataContext.Provider>
    )
}
