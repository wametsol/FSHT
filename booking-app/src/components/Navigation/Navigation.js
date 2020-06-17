import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    makeStyles,
    Drawer,
    List,
    ListItem,
    Typography,
    Divider
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
        '&:hover': {
            fontWeight: 'bold',
            backgroundColor: '#4557ff'
        }
    },
    right: {
        marginLeft: 'auto'
    },
    list: {
        width: 250,
    },
    logoutButton: {
        '&:hover': {
            backgroundColor: '#ff0066',
            fontWeight: 'bold'
        }
    },
    navButton: {
        '&:hover': {
            backgroundColor: '#4557ff',
            border: 'solid 4px #999999'
        }
    },
    homeButton: {
        flexGrow: 0,
        fontSize: 25,
        '&:hover': {
            background: 'linear-gradient(#3f51b5 60%, #2e91bf 100%)',
            fontWeight: 'bold',
            //backgroundColor: '#4f64db',
            borderRadius: 5
        }
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

                <Button className={classes.homeButton} color="inherit" component={Link} to='/'>Varaaja</Button>

                <div className={classes.right}>
                    {!user
                        ? <em><Button className={classes.navButton} variant='outlined' color="inherit" component={Link} to='/register'>Rekisteröidy</Button>
                            <Button className={classes.navButton} variant='outlined' color="inherit" component={Link} to='/login'>Kirjaudu</Button></em>
                        : (<em>Hei {user.displayName}

                            <IconButton color="inherit" >
                                <NotificationsIcon />
                            </IconButton>
                            <IconButton onClick={() => setDrawerOpen(true)} className={classes.menuButton} color='inherit' aria-label='menu'>
                                <MenuIcon />
                            </IconButton>
                            <Button className={classes.logoutButton} variant='outlined' color="inherit" onClick={logout} >Logout</Button>
                            <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                                <List className={classes.list}>
                                    <ListItem style={{ placeContent: 'center' }}>
                                        <Typography >{user.displayName}</Typography>
                                    </ListItem>
                                    <Divider />
                                    <ListItem >
                                        <Typography >{user.email}</Typography>
                                    </ListItem>
                                    <ListItem >
                                        <Typography >{user.emailVerified ? 'Sähköposti varmennettu' : 'Sähköposti ei varmennettu'}</Typography>
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