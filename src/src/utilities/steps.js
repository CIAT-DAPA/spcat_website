export const steps = [
  {
    title: "Select country",
    content: "Here you can select the desire country",
    target: "#select-country",
    placement: "auto",
    spotlightClicks: false,
    disableCloseOnEsc: false,
    disableOverlay: false,
    disableOverlayClose: false,

  },
  {
    title: "Select the major crop",
    content: "Here you can select the desire crops",
    target: "#select-majorCrop",
    placement: "auto",
    spotlightClicks: true
  },
  {
    title: "Select the landrace crop",
    content: "Here you can select the desire landrace crops",
    target: "#select-landraceCrop",
    placement: "auto",
    spotlightClicks: true
  },
  {
    title: "Add to map",
    content: "Click the button to add to map",
    target: "#button-addToMap",
    placement: "auto",
    spotlightClicks: false
  },
  {
    title: "Map",
    content: "Now you can see the layers on the map",
    target: "#mapLayer",
    placement: "left",
    spotlightClicks: true
  },
  {
    title: "Create a route",
    content: "Click this button to open the route section",
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
    content: "Write a city",
    target: "#textare-city1",
    placement: "auto",
    spotlightClicks: true
  },
  {
    title: "Create a route",
    content: "Add another destination",
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
    content: "Write another city",
    target: "#textare-city2",
    placement: "auto",
    spotlightClicks: true
  },
  {
    title: "Create a route",
    content: "Now get the route!",
    target: "#button-getRoute",
    placement: "auto",
    spotlightClicks: true
  },
  {
    title: "Download accesion",
    content: "Select this accesion",
    target: ".leaflet-marker-icon",
    placement: "auto",
    spotlightClicks: true
  },
  {
    title: "Download accesion",
    content: "Now download the accesion that you select",
    target: "#button-downloadAccesion",
    placement: "auto",
    spotlightClicks: true
  },
];

export const style = {
  options: {
    primaryColor: "#f56038",
    zIndex: 1000,
  },
};
