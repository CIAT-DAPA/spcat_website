import {
   
    WMSTileLayer,
  
    Marker,
    
    Tooltip,
   
  } from "react-leaflet";
import L from "leaflet";
import './LayersMarkers'

const LayersMarkers=({option1Checked,option2Checked,accessions,
    clickedMarkerIndices,
    setIndexStep,
    customIcon,
    setClickedMarkerIndices,
    selectedMarkers,
    setSelectedMarkers,
    layerr})=>{
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
            console.log("marker clicked", index);
          };
        return(
            
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
                        Id: marker.id,
                        AccecionID: marker.accession_id,
  
                        SpeciesName: marker.species_name,
                        Ext_id: marker.ext_id,
                        Crop: marker.crop,
                        Latitude: marker.latitude,
                        Longitude: marker.longitude,
                        Institution: marker.institution_name,
                        Source: marker.source_database,
                      });
                      const newSet = new Set(clickedMarkerIndices);
                      if (newSet.has(index)) {
                        newSet.delete(index);
                      } else {
                        newSet.add(index);
                      }
                      setClickedMarkerIndices(newSet);
                      console.log("marker clicked", e);
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
                      : customIcon
                  }
                  onMouseOver={(e) => {
                    e.target.openPopup();
                  }}
                  onMouseOut={(e) => {
                    e.target.closePopup();
                  }}
                >
                  <Tooltip direction="top" offset={[0, -30]}>
                    Institution: {marker.institution_name} <br /> Source:
                    {marker.source_database} id: {marker.ext_id}
                    <p>
                      {" "}
                      <strong>
                        click if you want to save this accession for export
                      </strong>{" "}
                    </p>
                  </Tooltip>
                </Marker>
              ) : null
            )}
          {option1Checked == false &&
            option2Checked == true &&
            layerr.length > 0 &&
            layerr.map((layerr, index) => (
              <WMSTileLayer
                key={layerr}
                url="https://isa.ciat.cgiar.org/geoserver2/wms"
                layers={`gap_analysis:${layerr}`}
                format="image/png"
                transparent={true}
                zIndex={1000 + index}
                styles={`Gap` + index}
              />
            ))}
            
            
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
                            Id: marker.id,
                            AccecionID: marker.accession_id,
  
                            SpeciesName: marker.species_name,
                            Ext_id: marker.ext_id,
                            Crop: marker.crop,
                            Latitude: marker.latitude,
                            Longitude: marker.longitude,
                            Institution: marker.institution_name,
                            Source: marker.source_database,
                          });
                          const newSet = new Set(clickedMarkerIndices);
                          if (newSet.has(index)) {
                            newSet.delete(index);
                          } else {
                            newSet.add(index);
                          }
                          setClickedMarkerIndices(newSet);
                          console.log("markerr clicked", e);
                          setTimeout(() => {
                            console.log("tIME");
                            setIndexStep(11);
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
                          : customIcon
                      }
                      onMouseOver={(e) => {
                        e.target.openPopup();
                      }}
                      onMouseOut={(e) => {
                        e.target.closePopup();
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -30]}>
                        Institution: {marker.institution_name} <br /> Source:
                        {marker.source_database} id: {marker.ext_id}
                        <p>
                          {" "}
                          <strong>
                            click if you want to save this accession for export
                          </strong>{" "}
                        </p>
                      </Tooltip>
                    </Marker>
                  ) : null
                )}
              {layerr.length > 0 &&
                layerr.map((layerr, index) => (
                  <WMSTileLayer
                    key={layerr}
                    url="https://isa.ciat.cgiar.org/geoserver2/wms"
                    layers={`gap_analysis:${layerr}`}
                    format="image/png"
                    transparent={true}
                    zIndex={1000 + index}
                    styles={`Gap` + index}
                  />
                ))}
            </>
          )}
            </>
        )
        
      
       
    
}
export default LayersMarkers;