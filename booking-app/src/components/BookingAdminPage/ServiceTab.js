import React, { useState } from 'react';
import firebase, { firestore } from '../../firebase'
import { Tabs, Tab, Typography, CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, InputAdornment, Select, MenuItem, InputBase, InputLabel, FormHelperText, FormLabel, Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, FormControl } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EuroIcon from '@material-ui/icons/Euro'

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getNumberArray } from './TimeTableServices'
import { getMinutes } from 'date-fns';
const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);


const ServiceTab = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const pagematch = useRouteMatch('/:id')
    const classes = useStyles()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [serviceName, setServiceName] = useState('')
    const [serviceDescription, setServiceDescription] = useState('')
    const [servicePrice, setServicePrice] = useState('')
    const [serviceTimeHours, setServiceTimeHours] = useState(0)
    const [serviceTimeMins, setServiceTimeMins] = useState(0)
    const [serviceCancelHours, setServiceCancelHours] = useState(24)
    const [addFormOpen, setAddFormOpen] = useState(false)
    const [openEditForm, setOpenEditForm] = useState(false)
    const [selectedService, setSelectedService] = useState(null)
    const [initialService, setInitialService] = useState(null)
    const [serviceType, setServiceType] = useState('')
    const [tabValue, setTabValue] = useState(0)


    
    const addNewService = (e) => {
        e.preventDefault()
        try {

            if (serviceType.length === 0 || serviceName.length === 0 || servicePrice.length === 0 || serviceDescription.length === 0 || (serviceTimeHours === 0 && serviceTimeMins === 0)) {
                setErrorMessage('Antamassasi syötteessä oli vikaa, tarkista antamasi tiedot')
            } else {
                setLoading(true)
                const serviceObject = {
                    service: serviceName,
                    description: serviceDescription,
                    price: servicePrice,
                    timelength: {
                        hours: serviceTimeHours,
                        minutes: serviceTimeMins
                    },
                    cancelTime: serviceCancelHours,
                    type: serviceType
                }
                firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayUnion(serviceObject) })
                    .then((res) => {
                        resetForm()
                        fetchData()
                        setLoading(false)
                        setSuccessMessage(`Palvelun '${serviceObject.service}' lisääminen onnistui`)
                    })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErrorMessage('Tapahtui odottamaton virhe')
        }

    }

    const updateService = (e) => {
        e.preventDefault()
        try {

            if (selectedService.length === 0 || selectedService.length === 0 || selectedService.length === 0 || (selectedService === 0 && selectedService === 0)) {
                setErrorMessage('Antamassasi syötteessä oli vikaa, tarkista antamasi tiedot')
            } else {
                setLoading(true)

                console.log(selectedService)

                console.log(initialService)

                
                firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayRemove(initialService) }).then(res => {
                })
                firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayUnion(selectedService) })
                    .then((res) => {
                        setSuccessMessage(`Palvelun '${selectedService.service}' päivitys onnistui`)
                        handleEditFormClose()
                        fetchData()
                        setLoading(false)
                        
                    })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErrorMessage('Tapahtui odottamaton virhe')
        }

    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const resetForm = () => {
        setServiceName('')
        setServiceDescription('')
        setServicePrice('')
        setServiceTimeHours(0)
        setServiceTimeMins(0)
        setServiceCancelHours(24)
        setServiceType('')
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

    const editService = (service) => {
        setInitialService({...service})
        setSelectedService(service)
        setOpenEditForm(true)
    }

    const handleEditFormClose = () => {
        setOpenEditForm(false)
        setSelectedService(null)
        setInitialService(null)
    }

    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return serviceTab(bookerObject.services.filter(a => a.type === 'human'))
            case 1:
                return serviceTab(bookerObject.services.filter(a => a.type === 'device'))
            default:
                return 'Unknown step';
        }
    }

    const serviceTab = (services) => (   
        <div>
        {services.map(service => (
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
                        <div className={classes.column}>
                            <Typography className={classes.secondaryHeading}>Perumisaika: {service.cancelTime}h</Typography>
                        </div>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        <div className={classes.column} />
                        <div className={classes.column}>
                            <Typography>Hinta: {service.price}€</Typography>
                        </div>
                        <div className={clsx(classes.column, classes.helper)}>
                            <Typography variant="caption">
                                Varauksen kesto: {service.timelength.hours}h {service.timelength.minutes}m.
                                    <br />
                            </Typography>
                        </div>
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                        <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' onClick={() => editService(service)} >Muokkaa</Button></Tooltip>
                        <Button size="small" color="secondary" onClick={() => removeService(service)}>
                            Poista
                        </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </div>
        ))}</div>
    )

    return (
        <div>
            <Typography>Hallinnoi sivustosi palveluita </Typography>

            {!addFormOpen ? <Button onClick={() => setAddFormOpen(!addFormOpen)} variant='contained' style={{ backgroundColor: 'lightgreen', margin: '20px' }}>Lisää palvelu</Button>
                :

                <div className={classes.addServiceForm}>
                    <form>
                    <Typography variant='h6'>Uuden palvelun lisääminen</Typography>
                        <Typography>Palvelun käyttökohde</Typography>
                        <RadioGroup  row style={{justifyContent: 'center'}} value={serviceType} onChange={({target}) => setServiceType(target.value)}>
                            <FormControlLabel value='human' control={<Radio/>} label='Henkilö'/>
                            <FormControlLabel value='device' control={<Radio/>} label='Laite'/>
                        </RadioGroup>
                        <Divider/>
                        <br/>
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
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
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
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <br />
                        <FormControl className={classes.formControl}>
                            <FormLabel>Hinta</FormLabel>
                            <span>
                                <TextField
                                    id="price"
                                    //label="Hinta"
                                    //style={{ margin: 4, width: '120px', height: '42px', marginTop: '17px' }}
                                    //helperText="Palvelusi hinta"
                                    margin="dense"
                                    className={classes.priceInput}
                                    variant='outlined'
                                    disabled={loading}
                                    value={servicePrice}
                                    onChange={({ target }) => setServicePrice(target.value)}
                                    InputProps={{
                                        style: { paddingRight: '0px', backgroundColor: 'white' },
                                        endAdornment: (
                                            <InputAdornment position='end' >
                                                <span style={{ padding: '6px', backgroundColor: 'lightgrey' }}>
                                                    <EuroIcon style={{ paddingTop: 3 }} />
                                                </span>

                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </span>

                            <FormHelperText>Palvelusi hinta</FormHelperText>

                        </FormControl>
                        <FormControl style={{ marginLeft: 20 }} >
                            <FormLabel>Kesto</FormLabel>
                            <div style={{ display: 'inline-flex', border: 'solid 1px lightgrey', borderRadius: '5px', maxHeight: '45px', backgroundColor: 'white' }}>
                                <FormControl style={{ minWidth: 100 }}>
                                    <InputLabel id="tunnit">Tunnit</InputLabel>
                                    <span >

                                        <Select
                                            style={{ minWidth: 100 }}
                                            id='tunnit'
                                            value={serviceTimeHours}
                                            onChange={({ target }) => setServiceTimeHours(target.value)}
                                            input={<BootstrapInput />}
                                            InputProps={{
                                                id: 'tunnit'
                                            }}
                                            MenuProps={{ style: { maxHeight: '500px' } }}

                                        >
                                            {getNumberArray(23, 1).map(number => (
                                                <MenuItem key={number+'h'} value={number}>{number}h</MenuItem>
                                            ))}

                                        </Select>
                                    </span>
                                </FormControl>
                                <FormControl style={{ minWidth: 100 }}>
                                    <InputLabel id="minutes">Minuutit</InputLabel>
                                    <span>
                                        <Select
                                            style={{ minWidth: 100 }}
                                            InputProps={{
                                                id: 'minutes'
                                            }}
                                            value={serviceTimeMins}
                                            onChange={({ target }) => setServiceTimeMins(target.value)}
                                            input={<BootstrapInput />}
                                        >
                                            {getNumberArray(59, 5).map(number => (
                                                <MenuItem key={number+'min'} value={number}>{number} min</MenuItem>
                                            ))}
                                        </Select>
                                    </span>
                                </FormControl>

                            </div>
                            <FormHelperText>Tunnit/minuutit</FormHelperText>
                        </FormControl>


                        <FormControl style={{ marginLeft: 20, minWidth: 100 }}>
                            <FormLabel>Peruutusaika</FormLabel>
                            <span>
                                <Select
                                    style={{ minWidth: 100 }}
                                    InputProps={{
                                        id: 'cancelhours',
                                        style: { width: 200 }
                                    }}
                                    value={serviceCancelHours}
                                    onChange={({ target }) => setServiceCancelHours(target.value)}
                                    input={<BootstrapInput />}
                                >
                                    {getNumberArray(72, 6).map(number => (
                                        <MenuItem key={number+'ch'} value={number}>{number}h</MenuItem>
                                    ))}
                                </Select>
                            </span>

                            <FormHelperText>Peruutusaika tunneissa</FormHelperText>
                        </FormControl>


                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Lisää uusi palvelu'><Button className={classes.addServiceButton} onClick={addNewService}><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => {
                            resetForm()
                            setAddFormOpen(false)
                        }}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                </div>
            }
            {bookerObject.services.length > 0 ?  <div>

                    <Typography variant='h5'>Palvelusi</Typography>
                    <Divider />
                    <Tabs
            centered
            variant='fullWidth'
            value={tabValue}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { background: `pink`} }}
            >
                <Tab label='Henkilöt'/>
                <Tab label='Laitteet'/>
            </Tabs>
                    {getTabContent(tabValue)}
                    </div> : <div>Et ole vielä lisännyt palveluita sivustollesi.</div>
            }

{!!selectedService? 
        <Dialog open={openEditForm} onClose={handleEditFormClose} >
            
        <DialogTitle>Muokkaat palvelun {selectedService.service} tietoja</DialogTitle>
                         <DialogContent>
                         <div className={classes.addServiceForm}>
                    <form>
                    <Typography>Palvelun käyttökohde</Typography>
                        <RadioGroup  row style={{justifyContent: 'center'}} value={selectedService.type} onChange={({ target }) => setSelectedService({
                                ...selectedService,
                                type: target.value
                            })}>
                            <FormControlLabel value='human' control={<Radio/>} label='Henkilö'/>
                            <FormControlLabel value='device' control={<Radio/>} label='Laite'/>
                        </RadioGroup>
                        <TextField
                            id="service"
                            label="Palvelusi nimi"
                            style={{ margin: 4 }}
                            helperText="Tämä tulee palvelusi nimeksi. Esimerkiksi 'Hieronta'"
                            margin="dense"
                            variant='outlined'
                            disabled
                            value={selectedService.service}
                            onChange={({ target }) => setSelectedService({
                                ...selectedService,
                                service: target.value
                            })}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <TextField
                            id="description"
                            label="Palvelusi kuvaus"
                            style={{ margin: 4 }}
                            helperText="Tämä tulee kuvaukseksi palvelulle. Esimerkiksi 'Normaali tunnin hieronta'"
                            margin="dense"
                            variant='outlined'
                            disabled={loading}
                            value={selectedService.description}
                            onChange={({ target }) => setSelectedService({
                                ...selectedService,
                                description: target.value
                            })}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <br />
                        <FormControl className={classes.formControl}>
                            <FormLabel>Hinta</FormLabel>
                            <span>
                                <TextField
                                    id="price"
                                    //label="Hinta"
                                    //style={{ margin: 4, width: '120px', height: '42px', marginTop: '17px' }}
                                    //helperText="Palvelusi hinta"
                                    margin="dense"
                                    className={classes.priceInput}
                                    variant='outlined'
                                    disabled={loading}
                                    value={selectedService.price}
                                    onChange={({ target }) => setSelectedService({
                                        ...selectedService,
                                        price: target.value
                                    })}
                                    InputProps={{
                                        style: { paddingRight: '0px', backgroundColor: 'white' },
                                        endAdornment: (
                                            <InputAdornment position='end' >
                                                <span style={{ padding: '6px', backgroundColor: 'lightgrey' }}>
                                                    <EuroIcon style={{ paddingTop: 3 }} />
                                                </span>

                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </span>

                            <FormHelperText>Palvelusi hinta</FormHelperText>

                        </FormControl>
                        <FormControl style={{ marginLeft: 20 }} >
                            <FormLabel>Kesto</FormLabel>
                            <div style={{ display: 'inline-flex', border: 'solid 1px lightgrey', borderRadius: '5px', maxHeight: '45px', backgroundColor: 'white' }}>
                                <FormControl style={{ minWidth: 100 }}>
                                    <InputLabel id="tunnit">Tunnit</InputLabel>
                                    <span >

                                        <Select
                                            style={{ minWidth: 100 }}
                                            id='tunnit'
                                            value={selectedService.timelength.hours}
                                            onChange={({ target }) => setSelectedService({
                                                ...selectedService,
                                                timelength: {
                                                    ...selectedService.timelength,
                                                    hours: target.value
                                                }
                                            })}
                                            input={<BootstrapInput />}
                                            InputProps={{
                                                id: 'tunnit'
                                            }}
                                            MenuProps={{ style: { maxHeight: '500px' } }}

                                        >
                                            {getNumberArray(23, 1).map(number => (
                                                <MenuItem value={number}>{number}h</MenuItem>
                                            ))}

                                        </Select>
                                    </span>
                                </FormControl>
                                <FormControl style={{ minWidth: 100 }}>
                                    <InputLabel id="minutes">Minuutit</InputLabel>
                                    <span>
                                        <Select
                                            style={{ minWidth: 100 }}
                                            InputProps={{
                                                id: 'minutes'
                                            }}
                                            value={selectedService.timelength.minutes}
                                            onChange={({ target }) => setSelectedService({
                                                ...selectedService,
                                                timelength: {
                                                    ...selectedService.timelength,
                                                    minutes: target.value
                                                }
                                            })}
                                            input={<BootstrapInput />}
                                        >
                                            {getNumberArray(59, 5).map(number => (
                                                <MenuItem value={number}>{number} min</MenuItem>
                                            ))}
                                        </Select>
                                    </span>
                                </FormControl>

                            </div>
                            <FormHelperText>Tunnit/minuutit</FormHelperText>
                        </FormControl>


                        <FormControl style={{ marginLeft: 20, minWidth: 100 }}>
                            <FormLabel>Peruutusaika</FormLabel>
                            <span>
                                <Select
                                    style={{ minWidth: 100 }}
                                    InputProps={{
                                        id: 'cancelhours',
                                        style: { width: 200 }
                                    }}
                                    value={selectedService.cancelTime}
                                    onChange={({ target }) => setSelectedService({
                                        ...selectedService,
                                        cancelTime: target.value
                                    })}
                                    input={<BootstrapInput />}
                                >
                                    {getNumberArray(72, 6).map(number => (
                                        <MenuItem value={number}>{number}h</MenuItem>
                                    ))}
                                </Select>
                            </span>

                            <FormHelperText>Peruutusaika tunneissa</FormHelperText>
                        </FormControl>


                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Lisää uusi palvelu'><Button className={classes.addServiceButton} onClick={updateService}><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => handleEditFormClose()}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                    </div>
                         </DialogContent>

        </Dialog>: <em/>}
        </div>
    )
}


export default ServiceTab