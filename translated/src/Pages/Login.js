import React, { Component } from 'react';
import "../Styles/Login.css";

export default class Login extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      pass: ""
    }
    this.onChange = this.onChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    //anche qui bisognerebbe validare il token lato server
    if(localStorage.usertoken){
      this.props.history.push("/search");
    }
  }

  onChange(e){
    this.setState({
      error_active: false,
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    this.submitLogin();
  }

  submitLogin(){
    fetch("https://hr.translated.com/auth", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:this.state.email, password:this.state.pass }) 
    }).then(res =>{
      if(!res.ok){
        this.setState({
          error_active: true
        });
      }else{
        res.json().then(result => {
          localStorage.setItem("usertoken", result);
          localStorage.setItem("email", this.state.email);
          this.props.history.push("/search");
        })
      }
    })
  }

  render() {
    return (
      <div className="container_login">
        <div className="general_card card_login">
          <div className="title">Login</div>
          {this.state.error_active ? 

          <div className="container_box_errore">
            <div className="msg_errore">Email o password errati!</div>
          </div> 

          : ""}
          <form onSubmit={this.handleSubmit}  className="input_group">
            <div className="form_input_container">
              <input className="form_input" 
              type="email"
              name="email"
              onChange={this.onChange}
              value={this.state.email}
              placeholder="Email"
              />
            </div>  
            <div className="form_input_container">
              <input className="form_input" 
              type="password"
              name="pass"
              onChange={this.onChange}
              value={this.state.pass}
              placeholder="Password"
              />
            </div> 
            <div className="btn_container btn_container_login">
              <button className="general_btn green_btn" type="submit" onClick={this.submitLogin}>Accedi</button>
            </div> 
          </form>  
        </div>
      </div>
    )
  }
}
