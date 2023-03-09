import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home/Home';
import Menu from './components/menu/Menu';
import MapTools from './pages/mapTools/MapTools';
import About from './components/about/about';
import RouteReport from './components/RouteReport/RouteReport';



function App() {
  return (
    <Router>
      <Menu />
      <RouteReport/>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/maptools" element={<MapTools />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
