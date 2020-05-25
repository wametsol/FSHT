import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { Link, useHistory } from 'react-router-dom'
import CheckIcon from '@material-ui/icons/Check';
import { green } from '@material-ui/core/colors'
import { useRouteMatch } from 'react-router-dom'


import { auth, firestore } from '../../firebase'

const useStyles = makeStyles((theme) => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    success: {
        color: green[500]
    },
    btnSuccess: {
        backgroundColor: green[500]
    },
}))



const LoginTab = ({setSuccessMessage, setErrorMessage, fetchUserData}) => {
    const classes = useStyles()
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const timer = React.useRef();
    const [loginTab, setLoginTab] = useState(0)
    const pagematch = useRouteMatch('/:id')

    const handleLogin = (e) => {
        e.preventDefault()

        const email = e.target.email.value
        const password = e.target.password.value
        try {
            if (!loading) {
                setSuccess(false)
                setLoading(true)
            }
            return auth.signInWithEmailAndPassword(email, password).then(() => {
                setSuccess(true)
                fetchUserData()
                    setLoading(false)
                    setSuccessMessage(`Kirjautuminen onnistui, tervetuloa.`)
                    history.push(`/${pagematch.params.id}`)
            }).catch(error => {
                var errorMsg = 'Tapahtui virhe, yritä uudelleen'
                if(error.code === 'auth/user-not-found'){
                    errorMsg = 'Virheellinen sähköposti tai salasana'
                }
                setLoading(false)
                setErrorMessage(errorMsg)
                console.log(error.code)
            })
        } catch (exception) {
            console.log(exception)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        try {
            auth.createUserWithEmailAndPassword(email, password).then((registeredUser) => {
                firestore.collection('userCollection').doc(email)
                .set({
                    uid: registeredUser.user.uid,
                    name: name,
                    email: email,
                    bookers: [],
                    bookings: [],
                    contactPreferences:{
                        email:true,
                        phone:false
                    }
                })
                var user = auth.currentUser
                user.updateProfile({
                    displayName: name
                }).then(() => {
                    console.log('Added name')
                    //window.localStorage.setItem('loggedBookerUser', JSON.stringify(user))
                    history.push('/')
                    return auth.currentUser
                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                console.log(error)
            })


        } catch (exception) {
            console.log(exception)
        }
    }

    const getContent = (tab) => {
        switch (tab) {
            case 0:
                return loginScreen()
            case 1:
                return registerScreen()
        }

    }

    const registerScreen = () => (
        <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Luo käyttäjätili
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Nimi</InputLabel>
                        <Input id="name" name="name" autoComplete="off" autoFocus />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Sähköposti</InputLabel>
                        <Input id="email" name="email" autoComplete="off" />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Salasana</InputLabel>
                        <Input name="password" type="password" id="password" autoComplete="off" />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Rekisteröidy
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={() => setLoginTab(0)}>
                        Kirjautumisikkunaan->
                    </Button>
                </form>
            </Paper>
    )

    const loginScreen = () => (
        <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Kirjaudu sisään
                </Typography>
                <form className={classes.form} onSubmit={handleLogin}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Sähköposti</InputLabel>
                        <Input id="email" name="email" autoComplete="off" autoFocus />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Salasana</InputLabel>
                        <Input name="password" type="password" id="password" autoComplete="off" />
                    </FormControl>
                    {success ? <CheckIcon size={25} className={classes.success} /> :
                        <div className={classes.wrapper}>
                            {loading ? <CircularProgress size={25} className={classes.success} /> :
                                <div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}>
                                        Kirjaudu
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        className={classes.submit}
                                        onClick={() => setLoginTab(1)}
                                        disabled={loading}>
                                        Rekisteröintiin->
                                    </Button>
                                </div>}
                        </div>}

                </form>
            </Paper>
    )

    return (
        <div className={classes.main}>
            {getContent(loginTab)}
        </div>
        
    )
}

export default LoginTab