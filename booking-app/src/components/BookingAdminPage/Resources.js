import React, { useState } from 'react';
import firebase, { auth, firestore } from '../../firebase'
import {
    Typography, CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Chip, Divider, Switch, InputAdornment, FormControl, FormLabel, FormHelperText, MenuItem, InputLabel, Select,
    Grid, List, ListItem, ListItemIcon, ListItemText, Checkbox, Paper
} from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'



const Resources = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const pagematch = useRouteMatch('/:id')
    const user = auth.currentUser
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [newAdmin, setNewAdmin] = useState('')
    const classes = useStyles()
    const [addFormOpen, setAddFormOpen] = useState(false)
    const [isHuman, setIsHuman] = useState(false)
    const [serviceList, setServiceList] = useState(bookerObject.services)
    const [resourceServiceList, setResourceServiceList] = useState([])
    const [checked, setChecked] = useState([])



    const addNewAdmin = (e) => {
        e.preventDefault()
        try {
            setError(false)
            setLoading(true)
            firestore.collection('userCollection').doc(newAdmin).get()
                .then(response => {
                    if (response.empty || bookerObject.admins.filter(a => a.email === newAdmin).length > 0) {
                        setLoading(false)
                        setErrorMessage('Antamallasi osoitteella ei löytynyt käyttäjää')
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
                                setSuccessMessage(`Käyttäjä ${adminObject.name} lisätty adminksi`)
                            })
                    }
                })
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

    const addService = (index) => {
        setResourceServiceList(resourceServiceList.concat(serviceList[index]))
        var editedList = serviceList
        editedList.splice(index, 1)
        setServiceList(editedList)
    }
    const removeService = (index)  => {
        setServiceList(serviceList.concat(resourceServiceList[index]))
        var editedList = resourceServiceList
        editedList.splice(index, 1)
        setResourceServiceList(editedList)
    }

    const serviceLists = (services, isBase) => (
        <Paper className={classes.serviceListPaper}>
            <List>
                {isBase? <Typography>Palvelut</Typography>:<Typography>Resurssin palvelut</Typography>}
                <Divider />
                {services.map((service, index) => (
                    
                    <span>
                    {console.log(index)}
                        {isBase ? 
                        <ListItem>
                            <ListItemText primary={service.service} />
                            <ListItemIcon>
                                <Button style={{ color: 'green' }} onClick={() => addService(index)}>
                                    <AddIcon />
                                </Button>
                            </ListItemIcon>


                            </ListItem> : <ListItem>
                                
                                <ListItemIcon>
                                    <Button style={{ color: 'red' }} onClick={() => removeService(index)}>
                                        <RemoveIcon />
                                    </Button>
                                </ListItemIcon>
                                <ListItemText primary={service.service} />
                                </ListItem>}
                    </span>
                ))}
                
            </List>
            <div>
            {isBase? <Button style={{backgroundColor: 'lightgreen'}} variant='contained' size='small' onClick={() => {
                setResourceServiceList(resourceServiceList.concat(serviceList))
                setServiceList([])
                }}>Lisää kaikki</Button>:<Button style={{backgroundColor: 'pink'}}  variant='contained' size='small' onClick={() => {
                    setServiceList(resourceServiceList.concat(serviceList))
                    setResourceServiceList([])
                    }}>Poista kaikki</Button>}
            </div>
        </Paper>
    )

    return (
        <div>
            <Typography variant='h5'>Varausjärjestelmän resurssit</Typography>
            <Typography>Resursseilla tarkoitetaan varaukseen liittyvää tekijää/kohdetta, esim. työntekijä Milla Mallikas tai Rata 5 tms.</Typography>
            {!addFormOpen ? <Button onClick={() => setAddFormOpen(!addFormOpen)} variant='contained' style={{ backgroundColor: 'lightgreen', margin: '20px' }}>Lisää resurssi</Button>
                :

                <div className={classes.addServiceForm}>
                    <form>
                        <Typography>Resurssin tyyppi: <Switch
                            classes={{
                                switchBase: classes.switchBase,
                                checked: classes.checked,
                                track: classes.track

                            }}
                            checked={isHuman}
                            onChange={() => setIsHuman(!isHuman)}
                        ></Switch>
                            {isHuman ? <span style={{ backgroundColor: 'pink' }} className={classes.humanBox}>Henkilö</span> : <span style={{ backgroundColor: 'lightblue' }} className={classes.humanBox}>Laite</span>}</Typography>
                        <TextField
                            id="resource"
                            label="Resurssin nimi"
                            style={{ margin: 4 }}
                            helperText="Tämä tulee resurssin nimeksi. Esimerkiksi 'Rata 3' tai 'Teppo Työntekijä'"
                            margin="dense"
                            variant='outlined'
                            disabled={loading}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <TextField
                            id="info"
                            label="Lisätiedot"
                            style={{ margin: 4 }}
                            helperText="Voit määritellä tähän haluamasi lisätiedot"
                            margin="dense"
                            variant='outlined'
                            disabled={loading}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <br />
                        <Typography>Resurssin tarjoamat palvelut näkyvät oikealla</Typography>
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item>{serviceLists(serviceList, true)}</Grid>
                            <Grid item>

                            </Grid>
                            <Grid item>{serviceLists(resourceServiceList, false)}</Grid>
                        </Grid>




                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Lisää uusi palvelu'><Button className={classes.addServiceButton} ><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => {

                            setAddFormOpen(false)
                        }}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                </div>
            }
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

export default Resources