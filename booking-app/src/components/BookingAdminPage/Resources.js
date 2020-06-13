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
    const [serviceList, setServiceList] = useState(Object.assign([], bookerObject.services))
    const [resourceServiceList, setResourceServiceList] = useState([])
    const [resName, setResName] = useState('')
    const [resDesc, setResDesc] = useState('')
    const [humanGender, setHumanGender] = useState(null)
    const [identicalResources, setIdenticalResources] = useState(1)
    const [tabValue, setTabValue] = useState(0)
    const [openEditForm, setOpenEditForm] = useState(false)
    const [selectedResource, setSelectedResource] = useState(null)

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
                    services: resourceServiceList.filter(z => z.type === 'human').map(s => s.service),
                    gender: humanGender,
                    timeTables: bookerObject.timeTables 
                }
            } else {
                resourceObject = {
                    human : isHuman,
                    name: resName,
                    description: resDesc,
                    services: resourceServiceList.filter(z => z.type === 'device').map(s => s.service),
                    amountOfResources: identicalResources 
                }
            }
            
            firestore.collection(`booker${bookerObject.bookerAddress}`).doc('baseInformation').update({ [`resources.${resourceObject.name}`]: resourceObject })
                .then(response => {
                                setIsHuman(false)
                                resetForm()
                                setAddFormOpen(false)
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

            console.log(selectedResource)

            let resourceObject
            
            if(selectedResource.human){
                const {amountOfResources, ...humanResource} = selectedResource
                resourceObject = {...humanResource,
                    services: selectedResource.services.filter(s => bookerObject.services.filter(z => z.service === s && z.type === 'human')[0])
                }
            } else {
                const {gender, ...nonHumanResource} = selectedResource
                resourceObject = {...nonHumanResource,
                    services: selectedResource.services.filter(s => bookerObject.services.filter(z => z.service === s && z.type === 'device')[0])
                }
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
        setServiceList(Object.assign([], bookerObject.services))
        setResourceServiceList([])
        setResName('')
        setResDesc('')
        setHumanGender(null)
        setIdenticalResources(1)
        
    }

    const addService = (service) => {
        console.log(serviceList.filter(s => s.service === service.service)[0])
        setResourceServiceList(resourceServiceList.concat(service))
        var editedList = serviceList.filter(s => s.service !== service.service)
        //editedList.splice(index, 1)
        setServiceList(editedList)
    }
    const removeService = (service)  => {
        setServiceList(serviceList.concat(service))
        var editedList = resourceServiceList.filter(s => s.service !== service.service)
       //editedList.splice(index, 1)
        setResourceServiceList(editedList)
    }

    const editFormAddService = (service) => {
        console.log('Adding service : ', service, ' to :', selectedResource.services)
        setSelectedResource({
            ...selectedResource,
            services: selectedResource.services.concat(service.service)
        })
    }
    const editFormRemoveService = (service) => {
        var editedList = selectedResource.services.filter(s => s !== service.service)
        setSelectedResource({
            ...selectedResource,
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
                                {isEditForm? <Button style={{ color: 'green' }} onClick={() => editFormAddService(service)}>
                                    <AddIcon />
                                </Button>: 
                                <Button style={{ color: 'green' }} onClick={() => addService(service)}>
                                    <AddIcon />
                                </Button>}
                            </ListItemIcon>


                            </ListItem> : <ListItem>
                                
                                <ListItemIcon>
                                {isEditForm?
                                    <Button style={{ color: 'red' }} onClick={() => editFormRemoveService(service)}>
                                        <RemoveIcon />
                                    </Button> : 
                                    <Button style={{ color: 'red' }} onClick={() => removeService(service)}>
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
                isEditForm? setSelectedResource({
                    ...selectedResource,
                    services: bookerObject.services.map(s => s.service)
                }) : setResourceServiceList(resourceServiceList.concat(serviceList))
                isEditForm? console.log('Adding all') : setServiceList([])
                }}>Lisää kaikki</Button>:<Button style={{backgroundColor: 'pink'}}  variant='contained' size='small' onClick={() => {
                    isEditForm? setSelectedResource({
                        ...selectedResource,
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
        setSelectedResource(person)
        setOpenEditForm(true)
    }

    const handleEditFormClose = () => {
        setOpenEditForm(false)
        setSelectedResource(null)
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
                                    <Chip key={resource.name+singleService} label={singleService}/>
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
                                    <Chip key={singleService+resource.name} label={singleService}  />
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
                            onChange={() => {
                            setIsHuman(!isHuman)
                            resetForm()

                        }}
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
                            <Grid item>{serviceLists(isHuman? serviceList.filter(s => s.type === 'human') : serviceList.filter(s => s.type === 'device'), true, false)}</Grid>
                            <Grid item>

                            </Grid>
                            <Grid item>{serviceLists(isHuman? resourceServiceList.filter(s => s.type === 'human') : resourceServiceList.filter(s => s.type === 'device'), false, false)}</Grid>
                        </Grid>




                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Lisää uusi palvelu'><Button className={classes.addServiceButton} onClick={addNewResource} ><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => {
                            resetForm()
                            setAddFormOpen(false)
                        }}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                </div>
            }
            {Object.keys(bookerObject.resources).length >0? <div>
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
            </div> : <em/> }
            {getTabContent(tabValue)}
            {!!selectedResource? 
        <Dialog open={openEditForm} onClose={handleEditFormClose} >
            
                <DialogTitle>Muokkaa  {selectedResource.human? 'henkilön' : 'laitteen'} {selectedResource.name} tietoja</DialogTitle>
                         <DialogContent>
                         <form>
                        <Typography style={{display:'inline'}}>Resurssin tyyppi: <Switch
                            classes={{
                                switchBase: classes.switchBase,
                                checked: classes.checked,
                                track: classes.track

                            }}
                            checked={selectedResource.human}
                            onChange={() => {
                                    setSelectedResource({
                                        ...selectedResource,
                                        human: !selectedResource.human,
                                        services : []
                                    })
                                
                                
                                }}
                        ></Switch> </Typography>
                            {selectedResource.human ? <span><span style={{ backgroundColor: 'pink' }} className={classes.humanBox}>Henkilö</span>
                            <br/>
                            Sukupuoli 
                            <span >
                            <RadioGroup row style={{justifyContent: 'center'}} value={selectedResource.gender} onChange={({target}) => setSelectedResource({
                                    ...selectedResource,
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
                            onChange={({target}) => setSelectedResource({
                                ...selectedResource,
                                amountOfResources: target.value
                            })}
                            value={selectedResource.amountOfResources || 1}>
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
                            value={selectedResource.name}
                            onChange={({target}) => setSelectedResource({
                                ...selectedResource,
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
                            value={selectedResource.description}
                            onChange={({target}) => setSelectedResource({
                                ...selectedResource,
                                description: target.value
                            })}
                            InputProps={{
                                style: { backgroundColor: 'white' },
                            }}
                        />
                        <br />
                        <Typography>Resurssin tarjoamat palvelut näkyvät oikealla</Typography>
                        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                            <Grid item>{serviceLists(selectedResource.human? serviceList.filter(s => s.type === 'human' && !selectedResource.services.includes(s.service) ) : serviceList.filter(s => s.type === 'device' && !selectedResource.services.includes(s.service)), true, true)}</Grid>
                            <Grid item>

                            </Grid>
                            <Grid item>{serviceLists(selectedResource.human? selectedResource.services.map(s => serviceList.filter(a =>a.service === s)[0]).filter(s => s.type === 'human') : selectedResource.services.map(s => serviceList.filter(a =>a.service === s)[0]).filter(s => s.type === 'device'), false, true)}</Grid>
                        </Grid>




                        {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div style={{ display: 'inline' }}><Tooltip title='Päivitä tiedot'><Button className={classes.addServiceButton} onClick={updateResource} ><AddCircleIcon /></Button></Tooltip><Tooltip title='Peru'><Button className={classes.cancelServiceButton} onClick={() => {
                            handleEditFormClose()
                        }}><CancelIcon /></Button></Tooltip></div>}
                        {error ? <div className={classes.errorMessage}>Tietojen antamisessa tapahtui virhe, tarkasta kentät</div> : <em />}
                    </form>
                         </DialogContent>

        </Dialog>: <em/>}
        </div>
    )
}

export default Resources