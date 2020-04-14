import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(0,2),
    },
    title: {
        flexGrow: 0,
    },
    right:{
        marginLeft: 'auto'
    }
}))


const Navigation = () => {
    const classes = useStyles()
    return (
        <AppBar position='static'>
            <Toolbar>
                
                    <Button color="inherit" component={Link} to='/'><Typography edge='start' variant="h6" className={classes.title}>Varaaja</Typography></Button>
                
                <div className={classes.right}>
                <Button variant='outlined' color="inherit" component={Link} to='/register'>Rekisteröidy</Button>
                <Button variant='outlined' color="inherit" component={Link} to='/login'>Kirjaudu</Button>
                <IconButton className={classes.menuButton} color='inherit' aria-label='menu'>
                    <MenuIcon />
                </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    )

}


export default Navigation