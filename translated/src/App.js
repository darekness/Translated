import './App.css';
import "./Styles/GeneralStyling.css";
import Login from "./Pages/Login";
import Search from "./Pages/Search";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
      <>
        <Switch>
          <Route exact path="/search" component={Search}/>
          <Route path="/" component={Login}/>
        </Switch>
      </>
    </Router>
    </div>
  );
}

export default App;
