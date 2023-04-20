import './maplegend.css'

const MapLegend = ({ colors, carouselLandraceItems, carouselMajorItems }) => {
  return (
    <div className='test'>
      {/* Map legend for carouselLandraceItems */}
      {carouselLandraceItems && carouselLandraceItems.length >0? (
        <div className="my-legend ">
          <div className="legend-title ms-2">Landrace Layers</div>
          <div className="legend-scale">
            <ul className="legend-labels ms-2">
              {carouselLandraceItems &&
                carouselLandraceItems.length > 0 &&
                carouselLandraceItems.map((item, index) => {
                  return (
                    <li key={index}>
                      <span
                        style={{ background: colors[index % colors.length] }}
                      ></span>
                      {item}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="legend-source">
            Source: <a href="#link to source">Name of source</a>
          </div>
        </div>
      ) : null}

      {/* Map legend for carouselMajorItems */}
      {carouselMajorItems && carouselMajorItems.length > 0 && carouselLandraceItems.length === 0 ?(
        <div className="my-legend ms-2">
          <div className="legend-title ms-2">Major Layers</div>
          <div className="legend-scale">
            <ul className="legend-labels ms-2">
              {carouselMajorItems &&
                carouselMajorItems.length > 0 &&
                carouselMajorItems.map((item, index) => {
                  return (
                    <li key={index}>
                      <span
                        style={{ background: colors[index % colors.length] }}
                      ></span>
                      {item}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="legend-source">
            Source: <a href="#link to source">Name of source</a>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MapLegend;

  