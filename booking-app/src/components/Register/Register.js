import React from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom'

import { auth, firestore } from '../../firebase'

const useStyles = makeStyles((theme) => ({
    main: {
        width: 'auto',
        display: 'block',
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
        width: '100%',
        marginTop: theme.spacing(),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
}))


const Register = () => {
    const classes = useStyles()
    const history = useHistory()



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
                        email: true,
                        phone: false
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

    return (
        <main className={classes.main}>
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
                        component={Link}
                        to='/login'>
                        Kirjautumisikkunaan->
                    </Button>
                </form>
            </Paper>
        </main>
    )
}

export default Register