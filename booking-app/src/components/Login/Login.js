import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel, CircularProgress } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { Link, useHistory } from 'react-router-dom'
import CheckIcon from '@material-ui/icons/Check';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { green } from '@material-ui/core/colors'


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



const Login = ({setSuccessMessage}) => {
    const classes = useStyles()
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const timer = React.useRef();

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

                timer.current = setTimeout(() => {
                    setLoading(false)
                    setSuccessMessage(`Kirjautuminen onnistui, tervetuloa.`)
                    setTimeout(() => {
                        setSuccessMessage(null)
                      }, 5000);
                    history.push('/')
                }, 1000)
            }).catch(error => {
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
                                        component={Link}
                                        to='/register'
                                        disabled={loading}>
                                        Rekisteröintiin->
                                    </Button>)
                                </div>}
                        </div>}

                </form>
            </Paper>
        </main>
    )
}

export default Login