  import './maplegend.css'

  const MapLegend = ({ colors, carouselLandraceItems, carouselMajorItems }) => {
    return (
      <div className='test ms-2'>
        {/* Map legend for carouselLandraceItems */}
        {carouselLandraceItems && carouselLandraceItems.length >0? (
          <div className="my-legend p-2">
            <div className="legend-title">Landrace Crops</div>
            <div className="legend-scale">
              <ul className="legend-labels ms-2">
                {carouselLandraceItems &&
                  carouselLandraceItems.length > 0 &&
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
              </ul>
            </div>
            <div className="legend-source">
            </div>
          </div>
        ) : null}

        {/* Map legend for carouselMajorItems */}
        {carouselMajorItems && carouselMajorItems.length > 0 && carouselLandraceItems.length === 0 ?(
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

    