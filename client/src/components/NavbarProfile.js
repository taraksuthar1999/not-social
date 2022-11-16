import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { sliderClasses } from '@mui/material';
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { fontSize } from '@mui/system';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {actions} from '../store/auth/actions';
import { connect, useDispatch, useSelector } from "react-redux";


function NavbarProfile(props){
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl )
    const navigate = useNavigate()
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      const onLogoutSuccess = () =>{
        navigate(0)
        navigate('/')
      }
      const logoutHandler = async()=>{
        props.logout({onLogoutSuccess})       
      }
    return (
        <>
        <IconButton 
        id="profile-menu" 
        aria-controls={open?'profile-menu':undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        >
            <PersonOutlineIcon/>
        </IconButton>
        <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
      </Menu>   
      </>     
    )
}

const logout = actions.logout
const ConnectedNavbarProfile = connect((state) => state, { logout})(NavbarProfile);
export default ConnectedNavbarProfile;