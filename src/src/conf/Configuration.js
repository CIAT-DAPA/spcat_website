const GEOSERVER_URL = "https://geo.gapanalysistools.org/geoserver/";
const GEOSERVER_SERVICE = "wms";

const GAP_WORSPACE = "gap_analysis"
const GAP_API_BASE = "https://api.gapanalysistools.org/api/v1/"

class Configuration {
    get_geoserver_url() {
        return GEOSERVER_URL;
    }
    get_geoserver_service() {
      return GEOSERVER_SERVICE;
    }
    get_url_api_base(){
      return GAP_API_BASE;
    }
    get_gap_worspace(){
      return GAP_WORSPACE;
    }
   

}

export default new Configuration();
