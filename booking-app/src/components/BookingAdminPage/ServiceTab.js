import React, { useState } from 'react';
import firebase, { firestore } from '../../firebase'
import { Typography,  CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const ServiceTab = ({setSuccessMessage, setErrorMessage, bookerObject, fetchData}) => {
    const pagematch = useRouteMatch('/:id')
    const classes = useStyles()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [serviceName, setServiceName] = useState('')
    const [serviceDescription, setServiceDescription] = useState('')
    const [servicePrice, setServicePrice] = useState('')
    const [serviceTimeLength, setServiceTimeLength] = useState('')



    const addNewService = (e) => {
        e.preventDefault()
        try {
            if(serviceName.length === 0 || servicePrice.length === 0 || serviceDescription.length === 0 || serviceTimeLength.length === 0){
                setErrorMessage('Antamassasi syötteessä oli vikaa, tarkista antamasi tiedot')
            } else {
            setLoading(true)
            const serviceObject = {
                service: serviceName,
                description: serviceDescription,
                price: servicePrice,
                timelength: serviceTimeLength
            }
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayUnion(serviceObject) })
                .then((res) => {
                    setServiceName('')
                    setServiceDescription('')
                    setServicePrice('')
                    setServiceTimeLength('')
                    fetchData()
                    setLoading(false)
                    setSuccessMessage(`Palvelun '${serviceObject.service}' lisääminen onnistui`)
                })}
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErrorMessage('Tapahtui odottamaton virhe')
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
                            {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
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


export default ServiceTab