import React, {useRef, useState, useEffect} from 'react'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {CSSTransition} from 'react-transition-group'

const SelectRegion =(props) => {

    const handleRegionSelect = (region) => {
        props.handleRegionSelect(region)
    }

    return (
        <NavItem>
            <DropdownMenu handleRegionSelect={handleRegionSelect} regions={props.regions} ></DropdownMenu>

        </NavItem>

    )
}


const NavItem = (props) => {
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    return (
        <div ref={wrapperRef} className="nav-item">
            <span  className="nav-label" onClick={(e)=>{console.log(e); setOpen(!open)}}>SELECT REGION</span>
            {open && props.children}
        </div>
    )
}


function DropdownMenu(props) {

    const [activeMenu, setActiveMenu] = useState('main')
    const [stateMenu, setStateMenu] =useState(undefined)
    const [regionMenu, setRegionMenu] = useState(undefined)
    const [menuHeight, setMenuHeight] = useState(null)
    const [direction, setDirection] = useState('normal')
    const [countryLabel, setCountryLabel] = useState('')
    const [stateLabel, setStateLabel] = useState('')


    const calcHeight = (el) => {
        const height = el.offsetHeight;
        setMenuHeight(height)
    }


    const handleCountryClick = (props) => {
        console.log("click ",  props)

        if (activeMenu === 'main') {
            setDirection('normal')
        }
        else if (activeMenu === 'states' && props.goToMenu === 'main') {
            setDirection('reverse')
        } else if (activeMenu === 'states' && props.goToMenu === 'regions') {
            setDirection('normal')
        } else {
            setDirection('reverse')
        }
        
        if (props.stateList) {
            setStateMenu(props.stateList)
        }

        if (props.regionList) {
            setRegionMenu(props.regionList)
        }

        if (props.countryLabel) {
            setCountryLabel(props.countryLabel)
        }
        if (props.stateLabel) {
            setStateLabel(props.stateLabel)
        }

        setActiveMenu(props.goToMenu)

    }

    const handleRegionData =(region) => {
        console.log("REGIONS")
        props.handleRegionSelect(region)
    }

    function DropdownItem(props) {
      return (
        <div 
            className={`menu-item ${props.sticky && 'menu-fixed'}`} 
            // style={{position: props.sticky && 'fixed'}}
            onClick={()=>{
            if (props.goToMenu) {
                handleCountryClick(props)
            } else if (props.regionData) {
                handleRegionData(props.regionData)
            }
            }} 
        >
          {props.children}
        </div>
      );
    }
  
    return (
      <div className="dropdown" style={{height: menuHeight}}>
          <CSSTransition 
            in={activeMenu === 'main'} 
            unmountOnExit timeout={500} 
            classNames="menu-primary"
            onEnter={calcHeight}
          >
            <div className="menu">
                {props.regions ? props.regions.countries.map((country, i) => {
                    return <DropdownItem goToMenu={'states'} countryLabel={country.name} stateList={country.states}>{country.name}</DropdownItem>
                }) 
                    :<DropdownItem >LOADING REGIONS...</DropdownItem>
                }
            </div>
          </CSSTransition>
          <CSSTransition 
            in={activeMenu === 'states'} 
            unmountOnExit timeout={500} 
            classNames={{
                enter: direction === 'normal' ? 'menu-secondary-enter' : 'menu-primary-enter',
                enterActive: direction === 'normal' ? 'menu-secondary-enter-active' : 'menu-primary-enter-active',
                exit: direction === 'normal' ? 'menu-primary-exit': 'menu-secondary-exit',
                exitActive: direction === 'normal' ? 'menu-primary-exit-active': 'menu-secondary-exit-active'

            }}
            onEnter={calcHeight}

          >
            <div className="menu">
               {stateMenu ?
                <>
                    <DropdownItem sticky goToMenu="main"><ChevronLeftIcon />{countryLabel}</DropdownItem>
                    {stateMenu.map(state=><DropdownItem goToMenu="regions" stateLabel={state.name} regionList={state.regions}>{state.name}</DropdownItem>)
                    }
                </>
                :
                <>
                    <DropdownItem goToMenu="main"><ChevronLeftIcon />{countryLabel}</DropdownItem>
                    <DropdownItem goToMenu="regions">Loading States</DropdownItem>
                </>
                }
            </div>
          </CSSTransition>
          <CSSTransition 
            in={activeMenu === 'regions'} 
            unmountOnExit timeout={500} 
            classNames={"menu-tertiary"}
            onEnter={calcHeight}

          >
            <div className="menu">
               {regionMenu ?
                <>
                    <DropdownItem sticky goToMenu="states"><ChevronLeftIcon />{stateLabel}</DropdownItem>
                    {regionMenu.map(region=><DropdownItem regionData={region}>{region.name}</DropdownItem>)
                    }
                </>
                :
                <>
                    <DropdownItem sticky goToMenu="states"><ChevronLeftIcon />{stateLabel}</DropdownItem>
                    <DropdownItem>Loading Regions</DropdownItem>
                </>
                }
            </div>
          </CSSTransition>
      </div>
    )
  }

export default SelectRegion