import React, { Fragment } from 'react'
import {render} from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  Redirect 
} from 'react-router-dom'
// page
import App from './components/home/App'
import PageAdd from './components/add/PageAdd'
import PageEdit from './components/edit_properties/edit'
import Detail from './components/detail/Detail'
import Myaccount from "./components/account/Myaccount";
import massage from './components/chats/massage'
import chat from './components/chats/chat'
import contract from './components/contract/contract'
import Check from './components/check/check'
import Notfound from './components/pages/notfound'
import Footer from './components/pages/footer' 
import up from './components/upload/up'
// end page
import './static/css/login.css'
import "./static/css/response.css";
import  { Component } from 'react'
import { getContract } from './components/utils/contractservice'
import registerServiceWorker from './components/registerServiceWorker'
import Logo from './static/logo.png'
import './static/css/index.css'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import ipfs from './components/utils/ipfs'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    window.location.reload();
  });
}
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("login") === ((window.ethereum && window.ethereum.selectedAddress) ? (window.ethereum.selectedAddress):'') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contracts: '',
            web3: '',
            account: '',
            login:true,
            firstname:'',
            lastname:'',
            error: false,
            pictures: ''
        };
    }
    componentDidMount() {

        const data = async (contracts, web3) => {
            this.setState({
                contracts, web3
            })
            let that = this;
            await web3.eth.getCoinbase(function (err, result) {
                that.setState({ account: result })
            })
            axios.get('http://localhost:4000/persons')
            .then(response => {
                // console.log(response.data);
            })
            .catch(function (error) {
                // console.log(error);
            })
        }
        getContract(data);
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", function (accounts) {
          localStorage.removeItem("login");
          window.location.reload();
        });
      }
      window.scrollTo(0, 0); 
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handlelogin =()=>{
        this.setState({
                login:true
        }) 
    }
    handleregister =()=>{
        this.setState({
                login:false
        }) 
    }
    loginbt = async ({ history }) => {
        let { account,contracts} = this.state
        const obj = {
          address: account
        };
        let check = await contracts.methods.register(account).call({ from: `${account}` });
        console.log(check)
        if (check == false) {
          console.log("not register");
          toast.warn("Account Not register !", {
              position: toast.POSITION.TOP_LEFT
            });
          return false;
        }
        axios.post('http://localhost:4000/persons/login', obj)
          .then(res =>{
            console.log(res.data);
            localStorage.setItem("login", res.data.person);
            if (localStorage && localStorage.getItem("login") === res.data.person) {
               toast.success("Success login !", {
                 position: toast.POSITION.TOP_LEFT
               });
              this.props.history.push("/");
              window.location.reload();
            } else if (localStorage.getItem("login") === "false") {
              toast.error("No login !", {
                position: toast.POSITION.TOP_LEFT
              });
            }
          });
    } 
  registerbt = ({ history }) => {
    let {firstname, lastname, account} = this.state
    const obj = {
            name: firstname +" "+ lastname,
            address: account
        };
    axios.post('http://localhost:4000/persons/register', obj)
        .then(res => {toast("Wow so easy !")});
  } 
    render() {
      
        return (
          <div className="cont_principal cont_principall ">
            <div className="cont_centrar">
             <ToastContainer />
              <div className="cont_login">
                <div className="cont_tabs_login">
                  <ul className="ul_tabs">
                    <li className="active">
                      <a href="#">SIGN IN</a>
                      <span className="linea_bajo_nom" />
                    </li>
                  </ul>
                </div>
                <div className="cont_text_inputs ">
                  <input
                    type="text"
                    className="input_form_sign d_block active_inp"
                    placeholder="address"
                    value={this.state.account}
                  />
                </div>

                <div className="cont_btn">
                  <button
                    className="btn_sign"
                    type="submit"
                    onClick={this.loginbt}
                  >
                    SIGN IN
                  </button>
                </div>
                <div
                  className="cont_text_inputs "
                  style={{ padding: " 0px 30px 20px" }}
                >
                  <Link to="/register">Or Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: "",
      web3: "",
      account: "",
      login: true,
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      gender: 0,
      address: "",
      ipfshash: "",
      idcard: "",
      error: false,
      GAS: 700000,
      GAS_PRICE: 2000000000
    };
  }
  componentDidMount() {
    const data = async (contracts, web3) => {
      this.setState({
        contracts,
        web3
      });
      let that = this;
      await web3.eth.getCoinbase(function(err, result) {
        that.setState({ account: result });
      });
       await contracts.events
         .AddUser(
           {
             fromBlock: 0,
             toBlock: "latest"
           },
           function(error, event) {
           console.log(event)
           }
         )
         .on("data", function(event) {
         
         })
         .on("changed", function(event) {
           // remove event from local database
         })
         .on("error", console.error);
      axios
        .get("http://localhost:4000/persons")
        .then(response => {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    };
    getContract(data);
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        localStorage.removeItem("login");
        window.location.reload();
      });
    }
    window.scrollTo(0, 0);
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  registerbt = async ({ history }) => {
    let {
      firstname,
      lastname,
      account,
      email,
      phone,
      address,
      gender,
      idcard,
      ipfshash,
      contracts,
      GAS,
      GAS_PRICE
    } = this.state;
    const obj = {
      name: firstname + " " + lastname,
      address: account
    };
    let check = await this.state.contracts.methods.register(this.state.account).call({ from: `${this.state.account}` });
    console.log(check)
    if (check == true) {
      console.log("exist");
      toast.warn("Account exist !", {
          position: toast.POSITION.TOP_LEFT
        });
      return false;
    }
    axios.post("http://localhost:4000/persons/register", obj).then(res => {
     
    });
     contracts.methods
       .addUser(
         account,
         idcard,
         firstname + " " + lastname,
         email,
         gender,
         phone,
         address,
         ipfshash
       )
       .send(
         { from: `${account}`, gas: GAS, gasPrice: `${GAS_PRICE}` },
         function(err, result) {
           console.log(result);
         }
       )
       .once("receipt", receipt => {
        toast.success("Success !", {
          position: toast.POSITION.TOP_LEFT
        });
       });  
  };
  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    console.log(file)
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };
  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    await ipfs.add(buffer, (err, ipfsHash) => {
      console.log(ipfsHash)
      this.setState({ ipfshash: 'https://gateway.ipfs.io/ipfs/' + ipfsHash[0].hash });
    })

  };
  render() {
    let { ipfshash} = this.state
    return (
      <div className="cont_principal">
        <ToastContainer />
        <div className="cont_centrar">
          <div className="cont_login">
            <div className="cont_tabs_login">
              <ul className="ul_tabs">
                <li className="active">
                  <a href="#">SIGN UP</a>
                  <span className="linea_bajo_nom" />
                </li>
              </ul>
            </div>
            <div className="cont_text_inputs">
              <input
                type="text"
                className="input_form_sign d_block active_inp"
                placeholder="First name"
                name="firstname"
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input_form_sign d_block active_inp"
                placeholder="Last name"
                name="lastname"
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input_form_sign d_block active_inp"
                placeholder="Email"
                name="email"
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input_form_sign d_block active_inp"
                placeholder="Id card"
                name="idcard"
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input_form_sign d_block active_inp"
                placeholder="Address"
                name="address"
                onChange={this.handleChange}
              />
              <input
                type="text"
                className="input_form_sign d_block active_inp"
                placeholder="Phone"
                name="phone"
                onChange={this.handleChange}
              />
              <input
                type="file"
                className="input_form_sign d_block active_inp file-ipfs"
                placeholder="ipfshash"
                name="ipfshash"
                onChange={this.captureFile}
              />
             
            </div>
            <div className="cont_btn">
              <button className="btn_sign" onClick={this.registerbt}>
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
render(
  <Router>
    <div>
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top mb">
          <NavLink
            className="navbar-brand"
            to="/"
            style={{ padding: "0px 40px 0px 30px" }}
          >
            {" "}
            <img src={Logo} style={{ width: "40px" }} alt="Blockchain" />{" "}
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#TopNavbar"
            aria-controls="navbarsExampleDefault"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="TopNavbar">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item space">
                <NavLink className="nav-link" to="/add-apartment">
                  Add
                </NavLink>
              </li>
              <li className="nav-item space">
                <NavLink className="nav-link" to="/check">
                  Check signature
                </NavLink>
              </li>
              <li className="nav-item space">
                <NavLink className="nav-link" to="/chats">
                  Chat
                </NavLink>
              </li>
              {localStorage.getItem("login") ===
              (window.ethereum && window.ethereum.selectedAddress
                ? window.ethereum.selectedAddress
                : "") ? (
                <Fragment>
                <li className="nav-item space">
                  <NavLink className="nav-link" to="/my">
                    My account
                  </NavLink>
                </li>
                <li className="nav-item space">
                    <NavLink className="nav-link" to="/upload">
                      Upload
                  </NavLink>
                  </li>
                    </Fragment>
              ) : null}
            </ul>
            <div className="form-inline my-2 my-lg-0">
              {localStorage.getItem("login") !==
              (window.ethereum && window.ethereum.selectedAddress
                ? window.ethereum.selectedAddress
                : "") ? (
                <Button variant="outlined" color="secondary" className="">
                  <NavLink
                    className="nav-link"
                    to="/login"
                    style={{ color: "white" }}
                  >
                    Login
                  </NavLink>
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  className="style-space"
                  onClick={() => {
                    localStorage.removeItem("login");
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </nav>
        <Switch>
          <Route exact path="/" component={App} />
          <PrivateRoute path="/add-apartment" component={PageAdd} />
          <Route path="/detail/:id" component={Detail} />
          <PrivateRoute path="/chat/:address1/:address2" component={chat} />
          <Route path="/check" component={Check} />
          <Route path="/contract/:id" component={contract} />
          <PrivateRoute path="/my" component={Myaccount} />
          <PrivateRoute path="/chats" component={massage} />
          <PrivateRoute path="/edits/:address/:id" component={PageEdit} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/upload" component={up} />
          <Route path="/register" component={Register} />
          <Route path="*" exact={true} component={Notfound} />
          <Redirect from="*" to="/404" />
        </Switch>
      </div>
      <Footer />
    </div>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker()
