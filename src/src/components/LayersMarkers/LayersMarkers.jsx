import {
   
    WMSTileLayer,
  
    Marker,
    
    Tooltip,

    useMap
   
  } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import './LayersMarkers'
import { useContext } from "react";
import { DataContext } from "../../context/context";
import Configuration from "../../conf/Configuration";
import config from './config.json';

const LayersMarkers=({option1Checked,option2Checked,accessions,
    clickedMarkerIndices,
    setIndexStep,
    customIcon,
    setClickedMarkerIndices,
    selectedMarkers,
    setSelectedMarkers,
    layerr})=>{
      const { accesionsInput } = useContext(DataContext);

        const handleClick = (index, tooltipInfo) => {

            const newSet = new Set(clickedMarkerIndices);
            if (newSet.has(index)) {
              newSet.delete(index);
              setSelectedMarkers(
                selectedMarkers.filter((marker) => marker.index !== index)
              );
            } else {
              newSet.add(index);
              setSelectedMarkers([...selectedMarkers, { index, tooltipInfo }]);
            }
            setClickedMarkerIndices(newSet);
          };

          const map = useMap();
          const { iso, project } = useContext(DataContext);
        
          useEffect(() => {
      
        
            if (accessions.length === 0 && layerr.length > 0 && project !== "lga") {
              
        
              if (iso && config.COUNTRY_BOUNDS[iso]) {
                const bounds = L.latLngBounds(config.COUNTRY_BOUNDS[iso]);
                
        
                if (map) {
                  map.flyToBounds(bounds, { padding: [50, 50] });
                }
              } else {
                console.warn("No bounds found for ISO:", iso);
              }
            }
          }, [accessions, layerr, project, iso, map]);
          
        return (
          <>
            {option1Checked == true &&
              option2Checked == false &&
              accessions &&
              accessions.length > 0 &&
              accessions.map((marker, index) =>
                marker.latitude && marker.longitude ? (
                  <Marker
                    eventHandlers={{
                      click: (e) => {
                        handleClick(index, {
                          id: marker.id,
                          species_name: marker.species_name,
                          ext_id: marker.ext_id,
                          crop: marker.crop,
                          landrace_group:marker.landrace_group,
                          country:marker.country,
                          institution_name: marker.institution_name,
                          source_database: marker.source_database,
                          latitude: marker.latitude,
                          longitude: marker.longitude,
                          accession_id: marker.accession_id,
                          other_attributes: marker.other_attributes,
                        });
                        const newSet = new Set(clickedMarkerIndices);
                        if (newSet.has(index)) {
                          newSet.delete(index);
                        } else {
                          newSet.add(index);
                        }
                        setClickedMarkerIndices(newSet);
                      },
                    }}
                    key={index}
                    position={[marker.latitude, marker.longitude]}
                    zIndex={15000 + index}
                    icon={
                      clickedMarkerIndices.has(index)
                        ? L.icon({
                            iconUrl:
                              "https://cdn-icons-png.flaticon.com/512/5610/5610944.png",
                            iconSize: [20, 20],
                          })
                        : customIcon(marker.crop, marker.landrace_group)
                    }
                    onMouseOver={(e) => {
                      e.target.openPopup();
                    }}
                    onMouseOut={(e) => {
                      e.target.closePopup();
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -30]}>
                      Species name: {marker.species_name} <br />
                      Institution: {marker.institution_name} <br />
                      Source: {marker.source_database} <br />
                      Id: {marker.accession_id} <br />
                      <br />
                      <strong>
                        click if you want to save this accession for export
                      </strong>{" "}
                    </Tooltip>
                  </Marker>
                ) : null
              )}
            {option1Checked == false &&
              option2Checked == true &&
              layerr.length > 0 &&
              layerr.map((layerr, index) => {
              const geoserverUrl = Configuration.get_geoserver_url() + Configuration.get_geoserver_service();
              const layerName = `${Configuration.get_gap_worspace()}:${layerr}`;

              //console.log("GeoServer URL:", geoserverUrl);
              //console.log("Loading Layer:", layerName);
              return (
                          <WMSTileLayer
                            key={layerr}
                            url={geoserverUrl}
                            layers={layerName}
                            format="image/png"
                            transparent={true}
                            zIndex={1000 + index}
                            styles={`Gap` + index}
                          />
                        );
                      })}

            {option1Checked == true && option2Checked == true && (
              <>
                {accessions &&
                  accessions.length > 0 &&
                  accessions.map((marker, index) =>
                    marker.latitude && marker.longitude ? (
                      <Marker
                        eventHandlers={{
                          click: (e) => {
                            handleClick(index, {
                              id: marker.id,
                              species_name: marker.species_name,
                              ext_id: marker.ext_id,
                              crop: marker.crop,
                              landrace_group:marker.landrace_group,
                              country:marker.country,
                              institution_name: marker.institution_name,
                              source_database: marker.source_database,
                              latitude: marker.latitude,
                              longitude: marker.longitude,
                              accession_id: marker.accession_id,
                              other_attributes: marker.other_attributes,
                            });
                            const newSet = new Set(clickedMarkerIndices);
                            if (newSet.has(index)) {
                              newSet.delete(index);
                            } else {
                              newSet.add(index);
                            }
                            setClickedMarkerIndices(newSet);
                            setTimeout(() => {
                              setIndexStep(6);
                            }, 200);
                          },
                        }}
                        key={index}
                        position={[marker.latitude, marker.longitude]}
                        zIndex={10000 + index}
                        icon={
                          clickedMarkerIndices.has(index)
                            ? L.icon({
                                iconUrl:
                                  "https://cdn-icons-png.flaticon.com/512/5610/5610944.png",
                                iconSize: [20, 20],
                              })
                            : customIcon(marker.crop, marker.landrace_group)
                        }
                        onMouseOver={(e) => {
                          e.target.openPopup();
                        }}
                        onMouseOut={(e) => {
                          e.target.closePopup();
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -30]}>
                          Species name: {marker.species_name} <br />
                          Institution: {marker.institution_name} <br />
                          Source: {marker.source_database} <br />
                          Id: {marker.accession_id} <br />
                          <br />
                          <strong>
                            click if you want to save this accession for export
                          </strong>{" "}
                        </Tooltip>
                      </Marker>
                    ) : null
                  )}
                {layerr.length > 0 &&
                layerr.map((layerr, index) => {
                const geoserverUrl = Configuration.get_geoserver_url() + Configuration.get_geoserver_service();
                const layerName = `${Configuration.get_gap_worspace()}:${layerr}`;

              //console.log("GeoServer URL:", geoserverUrl);
              //console.log("Loading Layer:", layerName);
              return (
                    <WMSTileLayer
                      key={layerr}
                      url={geoserverUrl}
                      layers={layerName}
                      format="image/png"
                      transparent={true}
                      zIndex={1000 + index}
                      styles={`Gap` + index}
                    /> );
                  })}
              </>
            )}
            {accesionsInput &&
              accesionsInput.length > 0 &&
              accesionsInput.map((accesion) => (
                <Marker
                  key={accesion.id}
                  position={[accesion.latitude, accesion.longitude]}
                >
                  <Tooltip direction="top" offset={[0, -30]}>
                  Species name: {accesion.species_name} <br />
                  Institution: {accesion.institution_name} <br />
                  Source: {accesion.source_database} <br />
                  Id: {accesion.accession_id} <br />
                  </Tooltip>
                </Marker>
              ))}
          </>
        );
        
      
       
    
}
export default LayersMarkers;