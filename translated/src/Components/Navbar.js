import React, { Component } from 'react';
import "../Styles/Navbar.css";

export default class Navbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: this.props.dati.email
    }
    this.logoutSession = this.logoutSession.bind(this);
  }
  

  logoutSession(){
    window.location.href = "/auth";
    localStorage.removeItem("usertoken");
    localStorage.removeItem("email");
  }

  render() {
    return (
      <div className="navbar_container">
        <div className="logo_navbar">PT</div>
        <div className="user_navbar">{this.state.email}</div>
        <div className="general_btn red_btn" onClick={this.logoutSession}>Logout</div>
      </div>
    )
  }
}
