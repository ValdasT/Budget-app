import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { GiHamburgerMenu, GiPiggyBank } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const mainNavigation = () => (
    <AuthContext.Consumer>
        {context => {
            return (
                <Fragment>
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand as={Link} to="/">
                            <GiPiggyBank size={40} className="main-navigation__logo" />
                            {'Budget planner'}
                        </Navbar.Brand>
                        <Nav className="main-navigation__items">
                            {!context.token && (
                                <li>
                                    <Nav.Link as={Link} to="/auth">Sign in</Nav.Link>
                                </li>
                            )}

                            {context.token && (
                                <NavDropdown alignRight title={
                                    <span><FaUser size={25} /></span>
                                } id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={context.logout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {context.token && (
                                <NavDropdown alignRight title={
                                    <span><GiHamburgerMenu size={25} /></span>
                                } id="collasible-nav-dropdown">
                                    {/* <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/bookings">Bookings</NavDropdown.Item> */}
                                    <NavDropdown.Item as={Link} to="/expenses">Expenses</NavDropdown.Item>
                                    {/* <NavDropdown.Item as={Link} to="/incomes">Incomes</NavDropdown.Item> */}
                                    <NavDropdown.Item as={Link} to="/statistics">Statistics</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar>
                </Fragment>
            );
        }}
    </AuthContext.Consumer>
);

export default mainNavigation;
