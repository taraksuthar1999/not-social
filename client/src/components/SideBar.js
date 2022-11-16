import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavbarButtons from './NavbarButtons';
import NavbarProfile from './NavbarProfile';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';


const drawerWidth = 240;


export default function SideBar(props){

    const { window,mobileOpen,handleDrawerToggle,token} = props;
    const drawer = (
        <div>
            <Toolbar/>
            <Box sx={{display:{sm:"none"}}}>
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                    {token?<NavbarProfile/>:<NavbarButtons/>}
                </ListItemButton>
              </ListItem>
            </List>
            </Box>
            <Divider />
          <List>
                {['Tech', 'Sports', 'Finance', 'Properties'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </div>
      );

      const container = window !== undefined ? () => window().document.body : undefined;

    return(
    <Box
        component="nav"
        sx={{ marginTop:"65px",width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    )
}