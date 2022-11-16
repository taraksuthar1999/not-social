import * as React from "react";
import { ModalContext,ModalProvider } from "../contexts/context";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


export default function NavbarButtons(props){
    const {setIsShown,setLogin,setRegister,isShown} = React.useContext(ModalContext)
    const loginHandler=()=>{
        setIsShown(true)
        setLogin(true)
        setRegister(false)
      }
      const registerHandler=()=>{
        setIsShown(true)
        setRegister(true)
        setLogin(false)
      }

    return (
        <Box sx={{height:"30px",width:"150px"}} display="flex" justifyContent="space-between"> 
            <Button sx={{backgroundColor:"black",boxShadow:0,color:"white",fontWeight:"bold",borderRadius:0,":hover":{backgroundColor:'black'}}} onClick={loginHandler}>LOG IN</Button>
            <Button sx={{backgroundColor:"red",boxShadow:0,color:"white",fontWeight:"bold",borderRadius:0,":hover":{backgroundColor:'red'}}} onClick={registerHandler}>SIGN UP</Button>
        </Box>
    )
}