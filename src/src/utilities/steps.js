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
    content: "Great! Now, choose the crops you want to explore in the selected country",
    target: "#select-majorCrop",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: true,
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
    hideFooter: true,
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
    hideFooter: true,
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
    title: "Create a route",
    content: "Want to plan your trip? Click this button to start exploring destinations!",
    target: "#button-route",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: true,
    hideCloseButton: true
  },
  {
    title: "Create a route",
    content: "Let's start with your first destination! Write a city to add it to your route.",
    target: "#textare-city1",
    placement: "bottom",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true
  },
  {
    title: "Create a route",
    content: "Ready to add more destinations? Click the plus button to keep building your route.",
    target: "#button-addDestination",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: true,
    hideCloseButton: true
  },
  {
    title: "Create a route",
    content: "Let's keep exploring! Write another city to add to your route.",
    target: "#textare-city2",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true
  },
  {
    title: "Create a route",
    content: "You're all set! Click the 'Get Route' button to see your customized route.",
    target: "#button-getRoute",
    placement: "auto",
    spotlightClicks: true,
    disableBeacon: true,
    disableOverlayClose: true,
    hideFooter: true,
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
    hideFooter: true,
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
    hideFooter: true,
    hideCloseButton: true
  },
];

export const style = {
  options: {
    primaryColor: "#f56038",
    zIndex: 1000,
  },
};
