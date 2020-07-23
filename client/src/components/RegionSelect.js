import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  regionButton: {
      paddingLeft: 20
  }
}));

export default function RegionSelect(props) {
  const [open, toggleOpen] = React.useState(false)
  
    const classes = useStyles();
  const wrapper = React.createRef;

  const handleClickRegion = (e) => {
    console.log(e)
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select">Select Region</InputLabel>
        <Select defaultValue="" id="grouped-select">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <div>
          {props.regionData && 
          
          props.regionData.countries.map((country,i)=> {
              return( 
              <div key={`countryList-${i}`}>
              <ListSubheader style={{backgroundColor: 'white'}}>{country.name}</ListSubheader>
                {country.states.map((state,i)=>{
                    return (
                    <div key={`stateList-${i}`} style={{paddingLeft: '5px'}}>
                        <ListSubheader style={{backgroundColor: 'white', fontWeight: 'bold'}}>{state.name}</ListSubheader>
                        {state.regions.map((region,i)=>
                            <MenuItem key={i} ref={wrapper} value={'here'} className={classes.regionButton} key={region.RegionId} onClick={handleClickRegion}>{region.name}</MenuItem>
                        )}
                    </div>
                    );
                })

                }
                
                {/* <MenuItem value={2}>Option 2</MenuItem> */}
                </div>
            )}
          )

          }
          </div>

        </Select>
      </FormControl>
    </div>
  );
}
