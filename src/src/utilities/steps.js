export const steps = [
  {
    title: "Select country",
    content: "Welcome! Select the country where you want to explore crops and accessions",
    target: "#select-country",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: false,
    showSkipButton:true,
    continuous :false,
    hideCloseButton: true
  },
  {
    title: "Select the major crop",
    content: "Great! Now, choose the crops that you want to explore in the selected country",
    target: "#select-majorCrop",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: false,
    showSkipButton:true,
    continuous :false,
    hideCloseButton: true
  },
  {
    title: "Select the landrace crop",
    content: "Looking for a specific type of crop? Choose from our selection of traditional landraces.",
    target: "#select-landraceCrop",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: false,
    showSkipButton:true,
    continuous :false,
    hideCloseButton: true
  },
  {
    title: "Add to map",
    content: "Ready to map your selection? Simply click the 'Add to Map' button.",
    target: "#button-addToMap",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: false,
    showSkipButton:true,
    continuous :false,
    hideCloseButton: true
  },
  {
    title: "Map",
    content: "Voilà! The selected crop accessions and varieties are now displayed on the map.",
    target: "#mapLayer",
    placement: "left",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true
  },
  {
    title: "Download accesion",
    content: "Select this accession to save it and download it later when you're ready.",
    target: ".leaflet-marker-icon",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: false,
    showSkipButton:true,
    continuous :false,
    hideCloseButton: true
  },
  {
    title: "Download accesion",
    content: "You're all set! Click the download button to get the selected accession.",
    target: "#button-downloadAccesion",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: false,
    showSkipButton:true,
    continuous :false,
    hideCloseButton: true
  },
];

export const style = {
  options: {
    primaryColor: "#f56038",
    zIndex: 1000,
  },
};
