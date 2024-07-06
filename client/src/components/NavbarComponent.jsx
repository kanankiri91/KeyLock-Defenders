import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { navLinks } from "../data.js";
import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const NavbarComponent = () => {
    const [changeColor, setChangeColor] = useState(false);
    const [buttonColor, setButtonColor] = useState("btn btn-outline-light rounded-2");
    const navigateTo = useNavigate();

    const changeBackgroundColor = () => {
        if (window.scrollY > 10) {
            setChangeColor(true);
            setButtonColor("btn btn-outline-dark rounded-2");
        } else {
            setChangeColor(false);
            setButtonColor("btn btn-outline-light rounded-2");
        }
    };

    useEffect(() => {
        changeBackgroundColor();

        window.addEventListener('scroll', changeBackgroundColor);
        
        return () => {
            window.removeEventListener('scroll', changeBackgroundColor);
        };
    }, []);

    const Logout = async() =>{
        try {
            await axios.delete('http://localhost:5000/keluar')
            navigateTo('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Navbar expand="lg" className={changeColor ? "color-active" : ""} fixed="top">
                <Container>
                    <Navbar.Brand href="/beranda" className="fs-3 fw-bold">KeyLock </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto text-center">
                            {navLinks.map((link) => (
                                <div className="nav-link" key={link.id}>
                                    <NavLink to={link.path} className={({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "active" : ""} end>
                                        {link.text}
                                    </NavLink>
                                </div>
                            ))}
                        </Nav>
                        <div className="text-center">
                            <Dropdown alignRight>
                                <Dropdown.Toggle variant="link" id="dropdown-basic" className={buttonColor}>
                                    <FaUser style={{ color: 'black', fontSize: '2.3em' }} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="/profil">Profil</Dropdown.Item>
                                    <Dropdown.Item onClick={Logout}>Keluar</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavbarComponent;
