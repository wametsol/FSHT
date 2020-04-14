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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))


const Navigation = () => {
    const classes = useStyles()
    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
                    <MenuIcon />
                </IconButton>
                <Typography>
                    Ajanvarausjärjestelmä
          </Typography>
                <Button color="inherit">Kirjaudu</Button>
            </Toolbar>
        </AppBar>
    )

}


export default Navigation