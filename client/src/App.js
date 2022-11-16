
import "./App.css";

import React, { useEffect,useState } from "react";
import Routes from "./routes";
import Navbar from "./components/Navbar";
import axios from "axios";
import { Box } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import Cookies from "js-cookie";
import FromModal from "./components/Auth/FormModel";
import { connect, useDispatch, useSelector } from "react-redux";
import { ConstructionOutlined } from "@mui/icons-material";
import {actions} from "./store/auth/actions";

const token = Cookies.get('token')
export const setAuthToken =token=>{
  if(token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  else delete axios.defaults.headers.common["Authorization"]
}
const getProfile = actions.getProfile

function App(props){


    useEffect(()=>{
      setAuthToken(token)
    },[token])


    useEffect(()=>{
        if(!props.user && token){
          props.getProfile()
        }
    },[props.user])


    return (
      <Box sx={{ display: 'flex' }}>
        <Router>
          <Navbar/>
          <Routes/>
          <FromModal/>
        </Router>
      </Box> 
    );

}
const ConnectedApp = connect((state) => state.auth,{getProfile})(App);
export default ConnectedApp;
