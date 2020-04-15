import React from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import { auth } from '../../firebase'

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
}))

const handleLogin = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value
    try {
        auth.signInWithEmailAndPassword(email, password)
        console.log(auth.currentUser)
        const user = auth.currentUser

        console.log(user)
    } catch (exception) {
        console.log(exception)
    }
}

const Login = () => {
    const  classes = useStyles()

    return (
        <main className={classes.main}>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Kirjaudu
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        className={classes.submit}
                        component={Link}
                        to='/register'>
                        Rekisteröintiin->
                    </Button>
                </form>
            </Paper>
        </main>
    )
}

export default Login