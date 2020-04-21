import React, { useState, useEffect } from 'react';
import firebase, { auth, firestore } from '../../firebase'
import { Tabs, Tab, Typography, Paper, CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Chip, Divider } from '@material-ui/core';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';

import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
    },
    adminListObject: {
        display: 'inline',
        margin: 8
    },
    removeAdmin: {
        color: 'red',
    },
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    errorMessage: {
        color: 'red'
    }
}))


const BookingAdminPage = () => {
    const pagematch = useRouteMatch('/:id')
    const [value, setValue] = useState(0)
    const user = auth.currentUser
    const [bookerObject, setBookerObject] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [serviceName, setServiceName] = useState('')
    const [serviceDescription, setServiceDescription] = useState('')
    const [servicePrice, setServicePrice] = useState('')
    const [serviceTimeLength, setServiceTimeLength] = useState('')
    const [newAdmin, setNewAdmin] = useState('')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const classes = useStyles()
    const baseAddress = pagematch.params.id

    const fetchData = () => {

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
    }
    useEffect(() => {
        try {
            setLoading(true)
            fetchData()
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }, [])


    const addNewService = (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const serviceObject = {
                service: serviceName,
                description: serviceDescription,
                price: servicePrice,
                timelength: serviceTimeLength
            }
            console.log(serviceName)
            console.log(serviceDescription)
            console.log(servicePrice)
            console.log(serviceTimeLength)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayUnion(serviceObject) })
                .then((res) => {
                    console.log(res)
                    setServiceName('')
                    setServiceDescription('')
                    setServicePrice('')
                    setServiceTimeLength('')
                    fetchData()
                    setLoading(false)
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }

    }

    const addNewAdmin = (e) => {
        e.preventDefault()
        try {
            setError(false)
            setLoading(true)
            firestore.collection('userCollection').doc(newAdmin).get()
                .then(response => {
                    if (response.empty || bookerObject.admins.filter(a => a.email === newAdmin).length > 0) {
                        setLoading(false)
                        setError(true)
                    } else {


                        const adminObject = {
                            email: response.data().email,
                            name: response.data().name
                        }
                        firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ admins: firebase.firestore.FieldValue.arrayUnion(adminObject) })
                            .then(res => {
                                console.log(res)
                                setNewAdmin('')
                                fetchData()
                                setLoading(false)
                            })
                    }
                })



            /*
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayUnion(serviceObject) })
                .then((res) => {
                    console.log(res)
                    setServiceName('')
                    setServiceDescription('')
                    setServicePrice('')
                    setServiceTimeLength('')
                    fetchData()
                })
                */
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    const removeAdmin = (admin) => {
        console.log(admin)

        try {
            setError(false)
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ admins: firebase.firestore.FieldValue.arrayRemove(admin) })
                .then(res => {
                    console.log(res)
                    fetchData()
                    setLoading(false)
                })

        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    const removeService = (service) => {
        console.log(service)

        try {
            setError(false)
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayRemove(service) })
                .then(res => {
                    console.log(res)
                    fetchData()
                    setLoading(false)
                })

        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }

    }


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
            case 4:
                return userControlTab()
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
                                disabled={loading}
                                value={serviceName}
                                onChange={({ target }) => setServiceName(target.value)}
                            />
                            <TextField
                                id="description"
                                label="Palvelusi kuvaus"
                                style={{ margin: 4 }}
                                helperText="Tämä tulee kuvaukseksi palvelulle. Esimerkiksi 'Normaali tunnin hieronta'"
                                margin="dense"
                                variant='outlined'
                                disabled={loading}
                                value={serviceDescription}
                                onChange={({ target }) => setServiceDescription(target.value)}
                            /><TextField
                                id="price"
                                label="Palvelusi hinta"
                                style={{ margin: 4 }}
                                helperText="Määrittele palvelullesi hinta"
                                margin="dense"
                                variant='outlined'
                                disabled={loading}
                                value={servicePrice}
                                onChange={({ target }) => setServicePrice(target.value)}
                            /><TextField
                                id="timelength"
                                label="Varauksen kesto"
                                style={{ margin: 4 }}
                                helperText="Esimerkiksi 00.55.00"
                                margin="dense"
                                variant='outlined'
                                disabled={loading}
                                value={serviceTimeLength}
                                onChange={({ target }) => setServiceTimeLength(target.value)}
                            />
                            {loading ? <CircularProgress className={classes.addButton} size={25} /> : <Button onClick={addNewService}><AddCircleIcon className={classes.addButton} /></Button>}

                        </form>
                        {bookerObject.services.map(service => (
                            <div className={classes.root} key={service.service}>
                                <ExpansionPanel >
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1c-content"
                                        id="panel1c-header"
                                    >
                                        <div className={classes.column}>
                                            <Typography className={classes.heading}>{service.service}</Typography>
                                        </div>
                                        <div className={classes.column}>
                                            <Typography className={classes.secondaryHeading}>{service.description}</Typography>
                                        </div>

                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails className={classes.details}>
                                        <div className={classes.column} />
                                        <div className={classes.column}>
                                            <Typography>Hinta: {service.price}€</Typography>
                                        </div>
                                        <div className={clsx(classes.column, classes.helper)}>
                                            <Typography variant="caption">
                                                Varauksen kesto: {service.timelength}
                                                <br />
                                            </Typography>
                                        </div>
                                    </ExpansionPanelDetails>
                                    <Divider />
                                    <ExpansionPanelActions>
                                        <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                                        <Button size="small" color="secondary" onClick={() => removeService(service)}>
                                            Poista
                                    </Button>
                                    </ExpansionPanelActions>
                                </ExpansionPanel>
                            </div>
                        ))}</div>
                }
            </div>
        )
    }

    const userControlTab = () => {

        return (
            <div>
                <Typography variant='h5'>Sivuston ylläpitäjä</Typography>
                <Typography>{bookerObject.bookerCreator}</Typography>
                -----------------------------------------------------
                <Typography>Lisää ja poista admin käyttäjiä sivulta</Typography>
                <div>
                    <TextField
                        id="newadmin"
                        label="Email"
                        style={{ margin: 4 }}
                        helperText="Lisää admin emaililla"
                        margin="dense"
                        variant='outlined'
                        disabled={loading}
                        value={newAdmin}
                        onChange={({ target }) => setNewAdmin(target.value)}
                    />
                    {loading ? <CircularProgress className={classes.addButton} size={25} /> : <Button onClick={addNewAdmin}><AddCircleIcon className={classes.addButton} /></Button>}
                    {error ? <div className={classes.errorMessage}>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <em />}
                </div>
                {bookerObject.admins.map(admin => (
                    <div key={admin.email} >
                        <div className={classes.root}>
                            <ExpansionPanel >
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1c-content"
                                    id="panel1c-header"
                                >
                                    <div className={classes.column}>
                                        <Typography className={classes.heading}>{admin.name}</Typography>
                                    </div>
                                    <div className={classes.column}>
                                        <Typography className={classes.secondaryHeading}>{admin.email}</Typography>
                                    </div>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className={classes.details}>
                                    <div className={classes.column} />
                                    <div className={classes.column}>
                                        {admin.email === bookerObject.bookerCreator ? <div><Chip label="Owner" onDelete={() => { }} /></div> : <em />}
                                        <Chip label="Admin" onDelete={() => { }} />
                                        <Chip label="Booker" onDelete={() => { }} />
                                    </div>
                                    <div className={clsx(classes.column, classes.helper)}>
                                        <Typography variant="caption">
                                            Lisää tietoa
                                       <br />
                                        </Typography>
                                    </div>
                                </ExpansionPanelDetails>
                                <Divider />
                                <ExpansionPanelActions>
                                    <Tooltip title={`Poista henkilön ${admin.name} adminoikeudet `} arrow><span><Button disabled={admin.email === bookerObject.bookerCreator} size='small' className={classes.removeAdmin} onClick={() => removeAdmin(admin)}><CancelIcon /></Button></span></Tooltip>
                                    <Button size="small" color="primary">
                                        Save
                                    </Button>
                                </ExpansionPanelActions>
                            </ExpansionPanel>
                        </div>
                    </div>
                ))}
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