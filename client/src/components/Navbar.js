import * as React from "react"; 
import { useEffect,useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import NavbarButtons from "./NavbarButtons";
import NavbarProfile from "./NavbarProfile";
import SideBar from "./SideBar";
import logo from "../images/NOT SOCIAL.png"



export default function Navbar(){ 
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const token = useSelector(state=>state.auth.token) ?? document?.cookie
    ?.split("; ")
    ?.find((row) => row.startsWith("token="))
    ?.split("=")[1]

    const min600 = useMediaQuery("(min-width:600px)")

    return (
      <>
        <AppBar position="fixed" sx={{height:"calc(100vh-70px)", backgroundColor:"white",color:"black",boxShadow:0,borderBottom:"1px solid rgba(0, 0, 0, 0.12)",zIndex: (theme) => theme.zIndex.drawer + 1}}>
          <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1,marginTop:'10px' }}>
              <img src={logo} className="logo"/>
            </Typography>
           {min600&&(token?<NavbarProfile/>:<NavbarButtons/>)  }
          </Toolbar>
        </AppBar>
      <SideBar token={token} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
    </>
    );  

  
}
