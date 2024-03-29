import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Menu.css'
import { Link } from 'react-router-dom'
import React from "react";
import logo from '../../assets/img/logo.png'

function Menu() {
    return (
        <Navbar variant="dark" collapseOnSelect expand="lg" className='menu' >
            <Container className='py-1'>
    <div className="logo">
    <img src={logo} className="me-2" style={{width: "40px"}}></img>
    </div>
    <Link className="navbar-brand" to="/">Home</Link>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse className='justify-content-end' id="responsive-navbar-nav">
        <Nav className="justify-content-end">
            <Link className="nav-link" to="/maptools" >Viewer</Link>
            <a className="nav-link" href="https://api.gapanalysistools.org/" target="_blank">Api</a>
            <Link className="nav-link" to="/about" >About</Link>
        </Nav>
    </Navbar.Collapse>
</Container>

        </Navbar>
    );
}
export default Menu;