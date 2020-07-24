import React from 'react';

import {
    Drawer,
    Switch,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    FormControl,
    FormGroup,
    Button,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

import SelectRegion from './NavItem'

const drawerWidth = 240;


const styles = makeStyles((theme)=>({
    root: {
        display: 'flex',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      },
      drawerPaper: {
          width: drawerWidth,
      },
      drawerTitle: {
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '10px',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      },
      drawerBody: {
          padding: '0px 10px'
      },
      buttonGroup: {
          padding: '20px 0px', 
          display: 'flex', 
          alignContent: 'space-between',
          '& button' :{
              flexGrow: 1
          }
      },
      drawerToggle: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: 5,
        radius: '5px',
        backgroundColor: 'white',
        zIndex: 10,
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2)'
      },
      content: {
        flexGrow: 1,
        position: 'relative',
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
      },
      contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
      },
      tooltip: {
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          '& img': {
              height: 'auto',
              maxWidth: '300px'
          }
      }
}));

const Toolbar = (props) => {

    const classes = styles();
    
    return (             
    <Drawer
    className={classes.drawer}
    variant="persistent"
    anchor="right"
    open={props.open}
    classes={{
        paper: classes.drawerPaper,
    }}
   >
        <div className={classes.drawerTitle}>Toolbar</div>
        <div className={classes.drawerBody}>
            <FormControl margin={"normal"}>
                <FormLabel>Change Search Area</FormLabel>
                <FormControlLabel
                    label="Toggle Area Edit"
                    control={
                        <Switch
                        checked={props.editSwitch}
                        onChange={props.handleSwitch}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    }
                />
                <FormHelperText>Select two points to create new search rectangle</FormHelperText>    
                
                <FormGroup className={classes.buttonGroup} row>
                    <Button onClick={props.handleUpdate} variant="contained" color="primary">Update</Button>
                    <Button onClick={props.handleClear} variant="contained">Clear</Button>

                </FormGroup>                
                <FormGroup>
                    <Button variant="contained" color="secondary" onClick={props.downloadContent}>Export</Button>

                </FormGroup>
                <FormGroup style={{paddingTop: 20}}>
                    <SelectRegion handleRegionSelect={props.handleRegionSelect} regions={props.regionData} />
                </FormGroup>
            </FormControl>
        </div>
    </Drawer>
    )
}

export default Toolbar
