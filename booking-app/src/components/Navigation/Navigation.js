import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    makeStyles,
    Drawer,
    List,
    ListItem
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { Link, useHistory } from 'react-router-dom'
import { auth } from '../../firebase'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(0, 2),
    },
    title: {
        flexGrow: 0,
    },
    right: {
        marginLeft: 'auto'
    },
    list: {
        width: 250,
    }
}))

const Navigation = () => {
    const classes = useStyles()
    const [user, setUser] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const history = useHistory()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user)
            }
        })
    }, [])

    const logout = (e) => {
        e.preventDefault()
        return auth.signOut().then(() => {
            setUser(null)
            history.push('/login')
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <AppBar position='static'>
            <Toolbar>

                <Button color="inherit" component={Link} to='/'><Typography edge='start' variant="h6" className={classes.title}>Varaaja</Typography></Button>

                <div className={classes.right}>
                    {!user
                        ? <em><Button variant='outlined' color="inherit" component={Link} to='/register'>Rekisteröidy</Button>
                            <Button variant='outlined' color="inherit" component={Link} to='/login'>Kirjaudu</Button></em>
                        : (<em>Hei {user.displayName}

                            <IconButton color="inherit" >
                                <NotificationsIcon />
                            </IconButton>
                            <IconButton onClick={() => setDrawerOpen(true)} className={classes.menuButton} color='inherit' aria-label='menu'>
                                <MenuIcon />
                            </IconButton>
                            <Button variant='outlined' color="inherit" onClick={logout} >Logout</Button>
                            <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                                <List className={classes.list}>
                                    <ListItem>
                                        <Button>Profiili</Button>
                                    </ListItem>
                                </List>
                            </Drawer>
                        </em>

                        )
                    }
                </div>
            </Toolbar>
        </AppBar>
    )

}


export default Navigation