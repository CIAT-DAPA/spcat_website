import './maplegend.css'
import { DataContext } from "../../context/context";
import { useContext } from 'react';

const MapLegend = ({ colors, carouselLandraceItems, carouselMajorItems, option2Checked }) => {
  const { image } = useContext(DataContext);
  return (
    <div className={option2Checked ? 'test ms-2' : 'test ms-2 hide'}>
      {/* Map legend for carouselLandraceItems */}
      {carouselLandraceItems && carouselLandraceItems?.length >0? (
        <div className="my-legend p-2">
          <div className="legend-title">Landrace Crops</div>
          <div className="legend-scale">
            <ul className="legend-labels ms-2">
              {carouselLandraceItems &&
                carouselLandraceItems?.length > 0 &&
                carouselLandraceItems.map((item, index) => {
                  return (
                    <li key={index}>
                      <span
                        style={{ background: colors[index % colors.length],opacity:'0.7' }}
                      ></span>
                     
                        {item}
                     
                    </li>
                  );
                })}
              {image && (
                <li>
                  <span style={{ background: "black", opacity: "0.7" }}></span>
                  Custom Gap
                </li>
              )}
            </ul>
          </div>
          <div className="legend-source">
          </div>
        </div>
      ) : null}

      {/* Map legend for carouselMajorItems */}
      {carouselMajorItems && carouselMajorItems.length > 0 && (carouselLandraceItems === null ||carouselLandraceItems?.length === 0) ?(
        <div className="my-legend ms-2 p-2">
          <div className="legend-title ">Major Crops</div>
          <div className="legend-scale">
            <ul className="legend-labels ms-2">
              {carouselMajorItems &&
                carouselMajorItems.length > 0 &&
                carouselMajorItems.map((item, index) => {
                  return (
                    <li key={index}>
                      <span
                        style={{ background: colors[index % colors.length],opacity:'0.7' }}
                      ></span>
                      {item}
                    </li>
                  );
                })}
              {image && (
                <li>
                  <span style={{ background: "black", opacity: "0.7" }}></span>
                  Custom Gap
                </li>
              )}
            </ul>
          </div>
          <div className="legend-source">
           
          </div>
        </div>
      ) : null}


{image && carouselMajorItems ==null ?(
        <div className="my-legend ms-2 p-2">
          <div className="legend-title ">Custom Gaps</div>
          <div className="legend-scale">
            <ul className="legend-labels ms-2">
              
              {image && (
                <li>
                  <span style={{ background: "black", opacity: "0.7" }}></span>
                  Custom Gap 
                </li>
              )}
            </ul>
          </div>
          <div className="legend-source">
           
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MapLegend;
