import React, { Component } from 'react';
import "../Styles/Search.css";
import Navbar from '../Components/Navbar';
import moment from "moment";

export default class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      ricerca:"",
      results_find: [],
      history:{},
      interval_results: 0,
      page_risultati: 1,
      error_active: false,
      result: {}
    }
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cambiaPagina = this.cambiaPagina.bind(this);
    this.eliminaHistory = this.eliminaHistory.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  componentDidMount(){
    //faccio il controllo in questo modo perchè non ho modo di validare il token lato server
    let token = localStorage.usertoken;
    let email = localStorage.email;
    let history =  localStorage.history ? JSON.parse(localStorage.history) : {};
    if(!token){
      this.props.history.push("/auth");
    }else{
      this.setState({
        token,
        email,
        loading: false,
        history
      })
    }
  }

  handleSubmit(e){
    e.preventDefault();
    this.sendRequest()
  }

  sendRequest(){
    fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${this.state.ricerca}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res =>{
      if(!res.ok){
        this.setState({
          error_active: true
        });
      }else{
        res.json().then(result => {
          if(!result.length){
            this.setState({
              error_active: true
            });
          }else{
            let history_results = this.state.history && this.state.history[this.state.email] ? this.state.history[this.state.email] : [];
            let data = result[0].address;
            data["data_ricerca"] = moment().format('DD/MM/YYYY HH:mm');
            //data["keyword_ricerca"] = this.state.ricerca;
            history_results.unshift(data);
            this.setState({
              result: result[0],
              history: {
                ...this.state.history,
                [this.state.email]:[...history_results]
              }
            }, ()=>{
              localStorage.setItem("history", JSON.stringify(this.state.history))
            }) 
          }
        })
      }
    })
  }

  cambiaPagina(direzione){
    var valore = 0;
    if(direzione === "avanti"){
      if(this.state.page_risultati < Math.ceil(this.state.history[this.state.email].length / 5)){
        valore = 1
      }
    }
    if(direzione === "indietro"){
      if(this.state.page_risultati > 1){
        valore = -1
      }
    }
    if(valore !== 0){
      this.setState({
        page_risultati: this.state.page_risultati + (1 * valore),
        interval_results: this.state.interval_results + (5 * valore)
      })
    }
    
  }

  eliminaHistory(){
    let history = this.state.history;
    if(history[this.state.email]){
      delete history[this.state.email]
    }
    this.setState({
      history,
      page_risultati: 1
    }, ()=>{
      localStorage.setItem("history", JSON.stringify(this.state.history))
    });
  }

  onChange(e){
    this.setState({
      error_active: false,
      [e.target.name]: e.target.value
    });
  }

  render() {
    let accepted_keys = ["city","country", "postcode", "data_ricerca",];
    return (
      <div>
        {this.state.loading ? <div>Loading...</div> : 
        <>
          <Navbar dati={{email: this.state.email}}/>
          <div className="container_cards">
            <div className="general_card card_search">
            <div className="title">Search</div>
              {this.state.error_active ? 
              <div className="container_box_errore">
                <div className="msg_errore">Nessun dato trovato!</div>
              </div> 
              : ""}
              <form onSubmit={this.handleSubmit} className="form_dati">  
                <div className="form_input_container">
                  <input className="form_input input_search" 
                  type="text"
                  name="ricerca"
                  onChange={this.onChange}
                  value={this.state.ricerca}
                  placeholder="Ricerca"
                  autocomplete="off"
                  />
                  <div type="submit" onClick={this.sendRequest} className="general_btn blue_btn">Cerca</div>
                </div>
              </form> 
              {this.state.result.address ? 
              <div className="container_risultato">
                {Object.keys(this.state.result.address).map(elem =>{
                  let formatted_key = elem.split("_").join(" ");
                  return(
                    <div className="row_risultato">{formatted_key}: <b>{this.state.result.address[elem]}</b></div>
                  )
                })}
              </div>  : ""}
            </div> 

            <div className="general_card card_search">
              <div className="title">Cronologia</div>
              <div className="container_history">
                {this.state.history && this.state.history[this.state.email] ? 
                  this.state.history[this.state.email].map((elem, index) =>{
                    if(index >= this.state.interval_results && index <= this.state.interval_results+4){
                      return(
                        <div className="container_history_row">
                        {Object.keys(elem).map(key =>{
                          let formatted_key = key.split("_").join(" ");
                          if(accepted_keys.includes(key)){
                            return (
                              <div className="history_row">{formatted_key}: <b>{elem[key]}</b></div>
                            )
                          }
                        })}
                        </div>
                      )
                    }
                  })
                : "Nessun elemento presente" }
              </div>

              {this.state.history[this.state.email] ? 
              <>
              <div className="btn_container btn_container_search">
                <div className="general_btn red_btn" onClick={this.eliminaHistory}>Elimina la cronologia</div>
              </div> 

              <div className="controllers_risultati">
                <div className="controller"onClick={()=>{this.cambiaPagina("indietro")}}>Indietro</div>
                <div>Pagina {this.state.page_risultati} di {Math.ceil(this.state.history[this.state.email] ? this.state.history[this.state.email].length / 5 : 1)}</div>                  
                <div className="controller" onClick={()=>{this.cambiaPagina("avanti")}}>Avanti</div>    
              </div>
              </> : ""}
            </div>
            
          </div>
        </>
        }      
      </div>
    )
  }
}
