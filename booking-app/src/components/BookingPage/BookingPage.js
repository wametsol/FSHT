import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../../firebase'
import { FormHelperText, FormControl, InputLabel, MenuItem, Select, Typography, Paper, CircularProgress, AppBar, Toolbar, Card, CardMedia, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouteMatch } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import CallIcon from '@material-ui/icons/Call'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        margin: 'auto',
        flex: 1,
        marginBottom: 'auto',
        minHeight: '85vh',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    bookingTopbar: {
        margin: 'auto'
    },
    media: {
        height: 140,
        margin: 'auto'
    },
    footer: {
        margin: 'auto',
        backgroundColor: '#03a5fc',
        minHeight: '15vh',
        maxWidth: '50%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,

    },
    footerObject: {
        marginLeft: '5%',
        marginTop: 'auto'
    },
    footerContent: {
        display: 'flex',
        textAlign: 'left!important'
    },
    selector: {
        display: 'inline',
    },
    selectEmpty: {

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
      },
}));

const BookingPage = () => {
    const pagematch = useRouteMatch('/:id')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookerObject, setBookerObject] = useState(null)
    const [chosenService, setChosenService] = useState('')
    const classes = useStyles()

    useEffect(() => {
        try {
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).get()
                .then((response) => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    response.forEach(doc => {
                        console.log(doc.data())
                        setBookerObject(doc.data())
                        setLoading(false)
                    })
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false)
                    setError(true)
                })
            console.log(bookerObject)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }, [])


    const handleSelectChange = (e) => {
        setChosenService(e.target.value)
    }


    if (bookerObject) {
        document.title = `${bookerObject.bookerName} ajanvaraus`
        return (
            <div >
                <div className={classes.root}>
                    <div >
                        <AppBar className={classes.bookingTopbar} position="static">
                            <Toolbar variant="dense">
                                <Typography variant="h6" color="inherit">
                                    {bookerObject.bookerName}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </div>
                    <Card>
                        <CardMedia className={classes.media} image="https://i1.pickpik.com/photos/80/669/198/hill-lane-forest-motorcycle-preview.jpg" />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {bookerObject.bookerName} ajanvaraus
                        </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Varaa aikasi täältä
                        </Typography>
                        </CardContent>
                    </Card>
                    <Paper>
                        <div >
                            <Typography className={classes.selector}>Aloita valitsemalla palvelu </Typography>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="">
                                    Palvelu
                                </InputLabel>
                                <Select
                                    value={chosenService}
                                    label='Palvelu'
                                    onChange={handleSelectChange}
                                    className={classes.selectEmpty}
                                    fullWidth
                                >
                                    {bookerObject.services.map(object => (
                                        <MenuItem key={object.service} value={object}>{object.service}</MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </div>

                        {!chosenService.service ? <em/> : <div>
                            <div key={chosenService.service}>
                                <Typography>Valittuna</Typography>
                                <Paper variant='outlined' className={classes.singleService} key={chosenService.service}>
                                <Typography variant='h5'>Palvelun nimi: {chosenService.service}</Typography>
                                <Typography>Kuvaus: {chosenService.description}</Typography>
                                <Typography>Hinta: {chosenService.price}€</Typography>
                                <Typography>Varauksen kesto: {chosenService.timelength}</Typography>
                            </Paper>
                            </div>
                            </div>}
                    </Paper>
                </div>
                <div className={classes.footer}>
                    <Typography >Yhteystiedot </Typography>
                    <div className={classes.footerContent}>

                        <div className={classes.footerObject}>

                            <Typography color="textSecondary">{bookerObject.publicInformation.name}</Typography>
                            <Typography color="textSecondary"><AlternateEmailIcon /> {bookerObject.publicInformation.email}</Typography>
                            <Typography color="textSecondary"><CallIcon /> {bookerObject.publicInformation.phone}</Typography>

                        </div>
                        <div className={classes.footerObject}>
                            <Typography color="textSecondary">{bookerObject.publicInformation.company}</Typography>
                            <Typography color="textSecondary">JokuRandomOsoite 123</Typography>
                            <Typography color="textSecondary">02250, Espoo</Typography>
                        </div>
                    </div>
                </div>

            </div>
        )
    }


    return (
        <div>
            {loading ? <CircularProgress size={25} /> : <em />}
            {error ? <div>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <em />}
        </div>
    )


}


export default BookingPage