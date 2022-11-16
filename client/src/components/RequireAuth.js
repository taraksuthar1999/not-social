import Cookies from "js-cookie";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { selectCurrentToken } from "../store/auth/actions";
import Loading from "../utils/Loading";
import Home from "./Home";
import Welcome from "./Welcome";
const RequireAuth = () => {
  let token = '';
  function hasJWT(){
    return Cookies.get('token');
  }
  return hasJWT()||false ? <Outlet /> : <Navigate to={"/"} />;
};
export default RequireAuth;
