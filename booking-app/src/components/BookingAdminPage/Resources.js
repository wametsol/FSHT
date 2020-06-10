import React, { useState } from 'react';
import firebase, { auth, firestore } from '../../firebase'
import {
    Typography, CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Chip, Divider, Switch, InputAdornment, FormControl, FormLabel, FormHelperText, MenuItem, InputLabel, Select,
    Grid, List, ListItem, ListItemIcon, ListItemText, Checkbox, Paper, Tab, Tabs, RadioGroup, FormControlLabel, Radio, Dialog, DialogTitle, DialogContent
} from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import { getNumberArray } from './TimeTableServices'


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
    const [resName, setResName] = useState('')
    const [resDesc, setResDesc] = useState('')
    const [humanGender, setHumanGender] = useState(null)
    const [identicalResources, setIdenticalResources] = useState(1)
    const [tabValue, setTabValue] = useState(0)
    const [openEditForm, setOpenEditForm] = useState(false)
    const [selectedPerson, setSelectedPerson] = useState(null)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
    const handleGenderChange = (event) => {
        setHumanGender(event.target.value)
        console.log(event.target.value)
    }

    const addNewResource = (e) => {
        e.preventDefault()
        try {
            setError(false)
            setLoading(true)

            let resourceObject
            
            if(isHuman){
                resourceObject = {
                    human : isHuman,
                    name: resName,
                    description: resDesc,
                    services: resourceServiceList.map(s => s.service),
                    gender: humanGender,
                    timeTables: bookerObject.timeTables 
                }
            } else {
                resourceObject = {
                    human : isHuman,
                    name: resName,
                    description: resDesc,
                    services: resourceServiceList.map(s => s.service),
                    amountOfResources: identicalResources 
                }
            }
            
            firestore.collection(`booker${bookerObject.bookerAddress}`).doc('baseInformation').update({ [`resources.${resourceObject.name}`]: resourceObject })
                .then(response => {
                                resetForm()
                                fetchData()
                                setLoading(false)
                                setSuccessMessage(`Resurssi ${resourceObject.name} lisätty`)
                            })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    const updateResource = (e) => {
        e.preventDefault()
        
        try {
            setError(false)
            setLoading(true)

            let resourceObject
            
            if(selectedPerson.human){
                const {amountOfResources, ...humanResource} = selectedPerson
                resourceObject = humanResource
            } else {
                const {gender, ...nonHumanResource} = selectedPerson
                resourceObject = nonHumanResource
            }
            
            firestore.collection(`booker${bookerObject.bookerAddress}`).doc('baseInformation').update({ [`resources.${resourceObject.name}`]: resourceObject })
                .then(response => {
                                handleEditFormClose()
                                fetchData()
                                setLoading(false)
                                setSuccessMessage(`Resurssi ${resourceObject.name} päivitetty`)
                            })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    const removeResource = (resource) => {
        console.log(resource)

        try {
            setError(false)
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ [`resources.${resource.name}`]: firebase.firestore.FieldValue.delete() })
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

    const resetForm = () => {
        setIsHuman(false)
        setServiceList(bookerObject.services)
        setResourceServiceList([])
        setResName('')
        setResDesc('')
        setHumanGender(null)
        setIdenticalResources(1)
        setAddFormOpen(false)
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

    const editFormAddService = (index) => {
        setSelectedPerson({
            ...selectedPerson,
            services: selectedPerson.services.concat(serviceList.filter(s => !selectedPerson.services.includes(s.service))[index].service)
        })
    }
    const editFormRemoveService = (index) => {
        var editedList = selectedPerson.services
        editedList.splice(index, 1)
        setSelectedPerson({
            ...selectedPerson,
            services: editedList
        })
    }

    const serviceLists = (services, isBase, isEditForm) => (
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
                                {isEditForm? <Button style={{ color: 'green' }} onClick={() => editFormAddService(index)}>
                                    <AddIcon />
                                </Button>: 
                                <Button style={{ color: 'green' }} onClick={() => addService(index)}>
                                    <AddIcon />
                                </Button>}
                            </ListItemIcon>


                            </ListItem> : <ListItem>
                                
                                <ListItemIcon>
                                {isEditForm?
                                    <Button style={{ color: 'red' }} onClick={() => editFormRemoveService(index)}>
                                        <RemoveIcon />
                                    </Button> : 
                                    <Button style={{ color: 'red' }} onClick={() => removeService(index)}>
                                        <RemoveIcon />
                                    </Button>
                                }
                                </ListItemIcon>
                                <ListItemText primary={service.service} />
                                </ListItem>}
                    </span>
                ))}
                
            </List>
            <div>
            {isBase? <Button style={{backgroundColor: 'lightgreen'}} variant='contained' size='small' onClick={() => {
                isEditForm? setSelectedPerson({
                    ...selectedPerson,
                    services: bookerObject.services.map(s => s.service)
                }) : setResourceServiceList(resourceServiceList.concat(serviceList))
                isEditForm? console.log('Adding all') : setServiceList([])
                }}>Lisää kaikki</Button>:<Button style={{backgroundColor: 'pink'}}  variant='contained' size='small' onClick={() => {
                    isEditForm? setSelectedPerson({
                        ...selectedPerson,
                        services: []
                    }) : setServiceList(resourceServiceList.concat(serviceList))
                    isEditForm? console.log('Removing all') : setResourceServiceList([])
                    }}>Poista kaikki</Button>}
            </div>
        </Paper>
    )

    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return humanTab()
            case 1:
                return nonHumanTab()
            default:
                return 'Unknown step';
        }
    }

    const getGenderInfo = (gender) => {
        if (gender === 'male') return 'Mies'
        if (gender === 'female') return 'Nainen'
        if (gender === 'other') return 'Muu / ei ilmoitettu'
    }

    const editPerson = (person) => {
        setSelectedPerson(person)
        setOpenEditForm(true)
    }

    const handleEditFormClose = () => {
        setOpenEditForm(false)
        setSelectedPerson(null)
    }

    const humanTab = () => {

        var humanResources = []
        Object.keys(bookerObject.resources).map(key => {
            if (bookerObject.resources[key].human){
                humanResources.push(bookerObject.resources[key])
            }
        })

        return(
        <div>
        {humanResources.map(resource => (
            <div key={resource.name} >
                <div className={classes.root}>
                    <ExpansionPanel >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{resource.name}</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{resource.description}</Typography>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                            <div className={classes.column} />
                            <div className={classes.column}>
                                Sukupuoli: {getGenderInfo(resource.gender)}
                                
                            </div>
                            <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Henkilön tarjoamat palvelut
                               <br />
                               {resource.services.map(singleService => (
                                    <Chip key={singleService} label={singleService} onDelete={() => { }} />
                                ))}
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />
                        <ExpansionPanelActions>
                            <Tooltip title={`Poista resurssi ${resource.name} `} arrow><span><Button size='small' className={classes.removeAdmin} onClick={() => removeResource(resource)}><CancelIcon /></Button></span></Tooltip>
                            <Button variant='contained' size="small" color="primary" onClick={() => editPerson(resource)}>
                                Muokkaa
                            </Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                </div>
            </div>
        ))}
        {!!selectedPerson? 
        <Dialog open={openEditForm} onClose={handleEditFormClose} >
            
        <DialogTitle>Muokkaa henkilön {selectedPerson.name} tietoja</DialogTitle>
                         <DialogContent>
                         <form>
                        <Typography style={{display:'inline'}}>Resurssin tyyppi: <Switch
                            classes={{
                                switchBase: classes.switchBase,
                                checked: classes.checked,
                                track: classes.track

                            }}
                            checked={selectedPerson.human}
                            onChange={() => {
                                    setSelectedPerson({
                                        ...selectedPerson,
                                        human: !selectedPerson.human
                                    })
                                
                                
                                }}
                        ></Switch> </Typography>
                            {selectedPerson.human ? <span><span style={{ backgroundColor: 'pink' }} className={classes.humanBox}>Henkilö</span>
                            <br/>
                            Sukupuoli 
                            <span >
                            <RadioGroup row style={{justifyContent: 'center'}} value={selectedPerson.gender} onChange={({target}) => setSelectedPerson({
                                    ...selectedPerson,
                                    gender: target.value,
                            })}>
                                <FormControlLabel value='male' control={<Radio/>} label='Mies'/>
                                <FormControlLabel value='female' control={<Radio/>} label='Nainen'/>
                                <FormControlLabel value='other' control={<Radio/>} label='Muu/ei ilmoitettu' />
                            </RadioGroup>
                            </span>
                            </span> : <span><span style={{ backgroundColor: 'lightblue' }} className={classes.humanBox}>Laite</span>
                            <br/>
                            <FormControl>
                            <div style={{display:'inline'}}>Identtisten resurssien määrä <Select
                            MenuProps={{ style: { maxHeight: '300px' } }}
                            onChange={({target}) => setSelectedPerson({
                                ...selectedPerson,
                                amountOfResources: target.value
                            })}
                            value={selectedPerson.amountOfResources || 1}>
                            {getNumberArray(25, 1).filter(number => number != 0).map(number => (
                                                <MenuItem value={number}>{number}kpl</MenuItem>
                                            ))}
                            </Select> </div>
                            <FormHelperText>Esimerkiksi Rata 5kpl, joita voidaan varata samanaikaisesti. Järjestelmä erottelee identtiset resurssit numeroilla (Rata 1, Rata 2 jne.)</FormHelperText>
                            </FormControl>
                            </span>}
                            <br/>
                        <TextField
                            id="resource"
                            label="Nimi"
                            style={{ margin: 4 }}
                            helperText="Nimen vaihtaminen ei ole mahdollista"
                            margin="dense"
                            variant='outlined'
                            value={selectedPerson.name}
                            onChange={({target}) => setSelectedPerson({
                                ...selectedPerson,
                                name: target.value
                            })}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                            disabled
                        />
                        <TextField
                            id="info"
                            label="Lisätiedot"
                            style={{ margin: 4 }}
                            helperText="Voit määritellä tähän haluamasi lisätiedot"
                            margin="dense"
                            variant='outlined'
                            disabled={loading}
                            value={selectedPerson.description}
                            onChange={({target}) => setSelectedPerson({
                                ...selectedPerson,
                                description: target.value
                            })}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <br />
                        <Typography>Resurssin tarjoamat palvelut näkyvät oikealla</Typography>
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item>{serviceLists(serviceList.filter(s => !selectedPerson.services.includes(s.service) ), true, true)}</Grid>
                            <Grid item>

                            </Grid>
                            <Grid item>{serviceLists(selectedPerson.services.map(s => serviceList.filter(a => a.service === s)[0]), false, true)}</Grid>
                        </Grid>




                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Päivitä tiedot'><Button className={classes.addServiceButton} onClick={updateResource} ><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => {
                            handleEditFormClose()
                        }}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                         </DialogContent>

        </Dialog>: <em/>}
        </div>
         ) }
    
    const nonHumanTab = () => {
        var nonHumanResources = []
        Object.keys(bookerObject.resources).map(key => {
            if (!bookerObject.resources[key].human){
                nonHumanResources.push(bookerObject.resources[key])
            }
        })

        return (
        <div>
        {nonHumanResources.map(resource => (
            <div key={resource.name} >
                <div className={classes.root}>
                    <ExpansionPanel >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{resource.name}, {resource.amountOfResources}kpl</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{resource.description}</Typography>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                            <div className={classes.column} />
                            <div className={classes.column}>
                                
                                
                            </div>
                            <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Resurssia voidaan käyttää seuraaviin palveluihin
                               <br />
                               {resource.services.map(singleService => (
                                    <Chip label={singleService} onDelete={() => { }} />
                                ))}
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />
                        <ExpansionPanelActions>
                            <Tooltip title={`Poista resurssi ${resource.name} `} arrow><span><Button size='small' className={classes.removeAdmin} onClick={() => removeResource(resource)}><CancelIcon /></Button></span></Tooltip>
                            <Button variant='contained' size="small" color="primary">
                                Muokkaa
                            </Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                </div>
            </div>
        ))}</div>
    )}

    return (
        <div>
            <Typography variant='h5'>Varausjärjestelmän resurssit</Typography>
            <Typography>Resursseilla tarkoitetaan varaukseen liittyvää tekijää/kohdetta, esim. työntekijä Milla Mallikas tai Rata 5 tms.</Typography>
            {!addFormOpen ? <Button onClick={() => setAddFormOpen(!addFormOpen)} variant='contained' style={{ backgroundColor: 'lightgreen', margin: '20px' }}>Lisää resurssi</Button>
                :

                <div className={classes.addServiceForm}>
                    <form>
                        <Typography style={{display:'inline'}}>Resurssin tyyppi: <Switch
                            classes={{
                                switchBase: classes.switchBase,
                                checked: classes.checked,
                                track: classes.track

                            }}
                            checked={isHuman}
                            onChange={() => setIsHuman(!isHuman)}
                        ></Switch> </Typography>
                            {isHuman ? <span><span style={{ backgroundColor: 'pink' }} className={classes.humanBox}>Henkilö</span>
                            <br/>
                            Sukupuoli 
                            <span >
                            <RadioGroup row style={{justifyContent: 'center'}} value={humanGender} onChange={handleGenderChange}>
                                <FormControlLabel value='male' control={<Radio/>} label='Mies'/>
                                <FormControlLabel value='female' control={<Radio/>} label='Nainen'/>
                                <FormControlLabel value='other' control={<Radio/>} label='Muu/ei ilmoitettu' />
                            </RadioGroup>
                            </span>
                            </span> : <span><span style={{ backgroundColor: 'lightblue' }} className={classes.humanBox}>Laite</span>
                            <br/>
                            <FormControl>
                            <div style={{display:'inline'}}>Identtisten resurssien määrä <Select
                            MenuProps={{ style: { maxHeight: '300px' } }}
                            onChange={({ target }) => setIdenticalResources(target.value)}
                            value={identicalResources}>
                            {getNumberArray(25, 1).filter(number => number != 0).map(number => (
                                                <MenuItem value={number}>{number}kpl</MenuItem>
                                            ))}
                            </Select> </div>
                            <FormHelperText>Esimerkiksi Rata 5kpl, joita voidaan varata samanaikaisesti. Järjestelmä erottelee identtiset resurssit numeroilla (Rata 1, Rata 2 jne.)</FormHelperText>
                            </FormControl>
                            </span>}
                            <br/>
                        <TextField
                            id="resource"
                            label="Resurssin nimi"
                            style={{ margin: 4 }}
                            helperText="Tämä tulee resurssin nimeksi. Esimerkiksi 'Huone' tai 'Teppo Työntekijä'"
                            margin="dense"
                            variant='outlined'
                            disabled={loading}
                            value={resName}
                            onChange={({ target }) => setResName(target.value)}
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
                            value={resDesc}
                            onChange={({ target }) => setResDesc(target.value)}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <br />
                        <Typography>Resurssin tarjoamat palvelut näkyvät oikealla</Typography>
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item>{serviceLists(serviceList, true, false)}</Grid>
                            <Grid item>

                            </Grid>
                            <Grid item>{serviceLists(resourceServiceList, false, false)}</Grid>
                        </Grid>




                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Lisää uusi palvelu'><Button className={classes.addServiceButton} onClick={addNewResource} ><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => {
                            resetForm()
                            setAddFormOpen(false)
                        }}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                </div>
            }
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
            
        </div>
    )
}

export default Resources