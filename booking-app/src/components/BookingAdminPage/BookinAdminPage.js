import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Typography, Paper, CircularProgress, TextField, Button } from '@material-ui/core';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
    singleService: {
        marginTop: 20,

        '&:hover': {
            fontWeight: 'bold'
        }

    },
    addButton: {
        color: green[500],
        '&:hover': {
            color: green[600],
        }
    }
}))


const BookingAdminPage = () => {
    const pagematch = useRouteMatch('/:id')
    const [value, setValue] = useState(0)
    const user = auth.currentUser
    const [bookerObject, setBookerObject] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const classes = useStyles()
    const baseAddress = pagematch.params.id
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
                        setBookerObject(doc.data())
                        setLoading(false)
                    })
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false)
                    setError(true)
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }, [])


    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return <div>Varaukset</div>
            case 1:
                return servicesTab()
            case 2:
                return <div>Muutokset</div>
            case 3:
                return <div>Tilastot</div>
            case 3:
                return <div>Käyttäjähallinta</div>
            default:
                return 'Unknown step';
        }
    }

    const servicesTab = () => {

        return (
            <div>
                <Typography>Hallinnoi sivustosi palveluita </Typography>
                {!bookerObject.services.length === 0 ? <div>Et ole vielä lisännyt palveluita sivustollesi.</div>
                    : <div>
                        <Typography>Lisää palvelu</Typography>
                        <form>
                            <TextField
                                id="service"
                                label="Palvelusi nimi"
                                style={{ margin: 4 }}
                                helperText="Tämä tulee palvelusi nimeksi. Esimerkiksi 'Hieronta'"
                                margin="dense"
                                variant='outlined'
                            />
                            <TextField
                                id="description"
                                label="Palvelusi kuvaus"
                                style={{ margin: 4 }}
                                helperText="Tämä tulee kuvaukseksi palvelulle. Esimerkiksi 'Normaali tunnin hieronta'"
                                margin="dense"
                                variant='outlined'
                            /><TextField
                                id="price"
                                label="Palvelusi hinta"
                                style={{ margin: 4 }}
                                helperText="Määrittele palvelullesi hinta"
                                margin="dense"
                                variant='outlined'
                            /><TextField
                                id="timelength"
                                label="Varauksen kesto"
                                style={{ margin: 4 }}
                                helperText="Esimerkiksi 00.55.00"
                                margin="dense"
                                variant='outlined'
                            />
                            <Button><AddCircleIcon className={classes.addButton} /></Button>

                        </form>
                        {bookerObject.services.map(service => (
                            <Paper variant='outlined' className={classes.singleService} key={service.service}>
                                <Typography variant='h5'>Palvelun nimi: {service.service}</Typography>
                                <Typography>Kuvaus: {service.description}</Typography>
                                <Typography>Hinta: {service.price}€</Typography>
                                <Typography>Varauksen kesto: {service.timelength}</Typography>
                            </Paper>
                        ))}</div>
                }
            </div>
        )
    }

    return (
        <div>
            {!bookerObject ? <div>
                {loading ? <CircularProgress size={25} /> : <em />}
                {error ? <div>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <div>Sivustoja ei löydy</div>}
            </div>
                : (<Paper>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor='primary'
                        textColor='primary'
                        centered
                    >
                        <Tab label='Varaukset' />
                        <Tab label='Palvelut' />
                        <Tab label='Muutokset' />
                        <Tab label='Tilastot' />
                        <Tab label='Käyttäjähallinta' />
                    </Tabs>
                    <div>{getTabContent(value)}</div>

                </Paper>)
            }
        </div>
    )


}


export default BookingAdminPage