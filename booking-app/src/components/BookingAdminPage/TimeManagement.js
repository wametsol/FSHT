import React, { useState, useEffect } from 'react';
import { Slider, Typography, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, Tooltip, Button, CircularProgress, TextField, capitalize, Select, MenuItem, ListSubheader, InputLabel, FormControl } from '@material-ui/core';
import useStyles from './useStyles'
import clsx from 'clsx'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import NavigateBeforeRoundIcon from '@material-ui/icons/NavigateBefore'

import firebase, { firestore } from '../../firebase'
import { useRouteMatch } from 'react-router-dom'
import { sameAsBase, isClosed, getFormattedTimes, getFormattedPersonTimes, getWeekdayTimes, getWeekdayPersonTimes, valueLabelFormat, valuetext, getSingleDayTimesText, getSingleDayTimes } from './TimeTableServices'

import DateFnsUtils from '@date-io/date-fns'
import { fi } from 'date-fns/locale'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { format, getDay, addDays, isBefore, parseISO } from 'date-fns'

const marks = [
    {
        value: 0,
        label: '00'
    },
    {
        value: 6,
        label: '06'
    },
    {
        value: 12,
        label: '12'
    },
    {
        value: 18,
        label: '18'
    },
    {
        value: 24,
        label: '24'
    },

]

const TimeManagement = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const classes = useStyles()
    const [value, setValue] = useState(bookerObject.timeTables)
    const [editWeekDays, setEditWeekdays] = useState(true)
    const [editPersonWeekDays, setEditPersonWeekdays] = useState(true)
    const [editWeekEnds, setEditWeekends] = useState(true)
    const [editPersonWeekEnds, setEditPersonWeekends] = useState(true)
    const [loading, setLoading] = useState(false)
    const [holidayFormOpen, setHolidayFormOpen] = useState(false)
    const [holidayForm2Open, setHolidayForm2Open] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date)
    const [resourceSelectedDate, setResourceSelectedDate] = useState(new Date)
    const [resourceSpecialTimes, setResourceSpecialTimes] = useState([8, 16])
    const [specialDayTimes, setSpecialDayTimes] = useState([8, 16])
    const [specialDayReason, setSpecialDayReason] = useState('')
    const pagematch = useRouteMatch('/:id')
    const [specialDayKeys, setSpecialDayKeys] = useState(Object.keys(bookerObject.specialDays))
    const [selectedResources, setSelectedResources] = useState('default')
    const [selectedTimeTables, setSelectedTimeTables] = useState(null)


    //SORT SPECIALDAYS TO ASC ORDER
    specialDayKeys.sort((a, b) => parseISO(`${a.substring(6, 10)}-${a.substring(3, 5)}-${a.substring(0, 2)}`) - parseISO(`${b.substring(6, 10)}-${b.substring(3, 5)}-${b.substring(0, 2)}`))

    useEffect(() => {
        try {
            setSpecialDayKeys(Object.keys(bookerObject.specialDays))
        } catch (error) {
            console.log(error)
        }
    }, [bookerObject])



    const handleBase = (event, newValue) => {
        if (event === 2 && isClosed(value.base)) {
            newValue = [8, 16]
        }
        console.log(newValue)
        setValue({
            ...value,
            base: newValue,
            weekDays: {
                mon: newValue,
                tue: newValue,
                wed: newValue,
                thu: newValue,
                fri: newValue
            }
        })
    }

    const handlePersonBase = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            base: newValue,
            weekDays: {
                mon: newValue,
                tue: newValue,
                wed: newValue,
                thu: newValue,
                fri: newValue
            }
        })

    }

    const handlePersonMon = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekDays: {
                ...selectedTimeTables.weekDays,
                mon: newValue
            }

        })
    }
    const handleMon = (event, newValue) => {
        if (event === 2 && isClosed(value.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekDays: {
                ...value.weekDays,
                mon: newValue
            }

        })
    }

    const handlePersonTue = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekDays: {
                ...selectedTimeTables.weekDays,
                tue: newValue
            }

        })
    }

    const handleTue = (event, newValue) => {
        if (event === 2 && isClosed(value.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekDays: {
                ...value.weekDays,
                tue: newValue
            }
        })
    }

    const handlePersonWed = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekDays: {
                ...selectedTimeTables.weekDays,
                wed: newValue
            }

        })
    }

    const handleWed = (event, newValue) => {
        if (event === 2 && isClosed(value.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekDays: {
                ...value.weekDays,
                wed: newValue
            }
        })
    }

    const handlePersonThu = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekDays: {
                ...selectedTimeTables.weekDays,
                thu: newValue
            }

        })
    }

    const handleThu = (event, newValue) => {
        if (event === 2 && isClosed(value.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekDays: {
                ...value.weekDays,
                thu: newValue
            }
        })
    }

    const handlePersonFri = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekDays: {
                ...selectedTimeTables.weekDays,
                fri: newValue
            }

        })
    }

    const handleFri = (event, newValue) => {
        if (event === 2 && isClosed(value.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekDays: {
                ...value.weekDays,
                fri: newValue
            }
        })
    }
    const handleSat = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekEnds: {
                ...value.weekEnds,
                sat: newValue
            }
        })
    }

    const handlePersonSat = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekEnds: {
                ...selectedTimeTables.weekEnds,
                sat: newValue
            }

        })
    }

    const handleSun = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setValue({
            ...value,
            weekEnds: {
                ...value.weekEnds,
                sun: newValue
            }
        })
    }

    const handlePersonSun = (event, newValue) => {
        if (event === 2 && isClosed(selectedTimeTables.base)) {
            newValue = [8, 16]
        }
        setSelectedTimeTables({
            ...selectedTimeTables,
            weekEnds: {
                ...selectedTimeTables.weekEnds,
                sun: newValue
            }

        })
    }

    const handleSpecial = (event, newValue) => {
        setSpecialDayTimes(newValue)

    }

    const handleResourceSpecial = (event, newValue) => {
        setResourceSpecialTimes(newValue)
    }

    const saveWeekDayEdit = (e) => {
        e.preventDefault()
        try {
            setEditWeekdays(true)
            setEditWeekends(true)
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ timeTables: value })
                .then((res) => {
                    fetchData()
                    setLoading(false)
                    setSuccessMessage(`Aikataulujen muokkaus onnistui`)
                })
        } catch (error) {
            setErrorMessage(`Tapahtui virhe`)
            console.log(error)
        }

    }

    const savePersonWeekDayEdit = (e) => {
        e.preventDefault()
        try {
            setEditPersonWeekdays(true)
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({[`resources.${selectedResources}`]:
            {
                ...bookerObject.resources[`${selectedResources}`],
                timeTables: selectedTimeTables
            }})
                .then((res) => {
                    fetchData()
                    setLoading(false)
                    setSuccessMessage(`Aikataulujen muokkaus onnistui`)
                })

        } catch (error) {
            setErrorMessage(`Tapahtui virhe`)
            console.log(error)
        }
    }


    const resetSpecialForm = (e) => {
        e.preventDefault()
        setSpecialDayTimes([8, 16])
        setHolidayFormOpen(false)
        setSpecialDayReason('')
    }
    const resetResourceSpecialForm = (e) => {
        setResourceSpecialTimes([8, 16])
        setHolidayForm2Open(false)
    }


    const addResourceSpecialDay = (e) => {
        e.preventDefault()
        console.log(resourceSelectedDate)
        console.log(resourceSpecialTimes)

        try {
            setLoading(true)
            const resSpecialDayObject = {
                date: format(resourceSelectedDate, 'dd/MM/yyyy'),
                times: resourceSpecialTimes,
            }
            console.log(bookerObject.resources[`${selectedResources}`].specialDays)
            console.log([`${format(resourceSelectedDate, `dd:MM:yyyy`)}`],  resSpecialDayObject)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({[`resources.${selectedResources}`]: 
            {
                ...bookerObject.resources[`${selectedResources}`],
                specialDays: {
                    ...bookerObject.resources[`${selectedResources}`].specialDays,
                    [`${format(resourceSelectedDate, `dd:MM:yyyy`)}`]: resSpecialDayObject
                }
            }
        })
            .then(res => {
                fetchData()
                setLoading(false)
                resetResourceSpecialForm()
                setSuccessMessage(`Päiväkohtainen työaika henkilölle ${selectedResources} asetettu`)
            })

        } catch (error) {
            console.log(error)
        }
    }

    const removeResourceSpecialDay = (key, person) => {
        console.log(key)
        try {
            setLoading(true)


            firestore.collection(`booker${pagematch.params.id}`).doc(`baseInformation`).get()
                .then(obj => {
                    const editedObj = obj.data().resources[`${person}`].specialDays
                    delete editedObj[`${key}`]
                    firestore.collection(`booker${pagematch.params.id}`).doc(`baseInformation`).update({[`resources.${selectedResources}`]: 
                    {
                        ...bookerObject.resources[`${selectedResources}`],
                        specialDays: editedObj
                    }
                    })
                        .then((res) => {
                            setSuccessMessage(`Poikkeusaikataulu henkilöltä '${person}' poistettu`)
                            fetchData()
                            setLoading(false)
                        })
                })

        } catch (error) {
            setErrorMessage(`Tapahtui virhe`)
            setLoading(false)
            console.log(error)
        }
    }

    const addNewSpecialDay = (e) => {
        e.preventDefault()
        console.log(selectedDate)
        console.log(specialDayReason)
        console.log(specialDayTimes)

        try {
            setLoading(true)
            const specialDayObject = {
                date: format(selectedDate, 'dd/MM/yyyy'),
                times: specialDayTimes,
                reason: specialDayReason
            }

            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({
                specialDays: {
                    ...bookerObject.specialDays,
                    [`${format(selectedDate, `dd:MM:yyyy`)}`]: specialDayObject
                }
            })
                .then(res => {
                    fetchData()
                    setLoading(false)
                    setSuccessMessage(`Poikkeusaikataulu lisätty`)
                    setSpecialDayTimes([8, 16])
                    setHolidayFormOpen(false)
                    setSpecialDayReason('')
                })
        } catch (error) {
            setErrorMessage(`Tapahtui virhe`)
            setLoading(false)
            setSpecialDayTimes([8, 16])
            setHolidayFormOpen(false)
            setSpecialDayReason('')
            console.log(error)
        }
    }

    const deleteSpecialDay = (key) => {
        console.log(key)
        try {
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').get()
                .then(obj => {
                    const editedObj = obj.data().specialDays
                    delete editedObj[`${key}`]
                    firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({
                        specialDays: editedObj
                    })
                        .then((res) => {
                            setSuccessMessage(`Poikkeusaikataulu '${bookerObject.specialDays[key].reason}' poistettu`)
                            setSpecialDayKeys(Object.keys(editedObj))
                            fetchData()
                            setLoading(false)
                            setSpecialDayTimes([8, 16])
                            setHolidayFormOpen(false)
                            setSpecialDayReason('')
                        })
                })
            /*
            console.log(cRef)
            const removed = cRef.update({
                specialDays: {
                    [`${bookerObject.specialDays[key].date}`]: firebase.firestore.FieldValue.delete()
                }
            })*/

        } catch (error) {
            setErrorMessage(`Tapahtui virhe`)
            setLoading(false)
            setSpecialDayTimes([8, 16])
            setHolidayFormOpen(false)
            setSpecialDayReason('')
            console.log(error)
        }
    }
    const dayHasSpecialTimes = (date) => {
        if (!bookerObject.specialDays[[`${format(date, `dd:MM:yyyy`)}`]]) {
            return false
        } else {
            return true
        }
    }

    const getDateTimes = (date) => {
        if (!bookerObject.specialDays[[`${format(date, `dd:MM:yyyy`)}`]]) {
            return getSingleDayTimes(getDay(date), value)
        } else {
            return bookerObject.specialDays[[`${format(date, `dd:MM:yyyy`)}`]].times
        }
    }


    const weekendPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Viikonloppu </Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Aseta Viikonloppu</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >
                </div>
                <div className={classes.column} >
                    {singleDaySlider('Lauantai', value.weekEnds.sat, handleSat, editWeekEnds, value.base, true)}
                    {singleDaySlider('Sunnuntai', value.weekEnds.sun, handleSun, editWeekEnds, value.base, true)}



                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    {isClosed(value.weekEnds.sun) && isClosed(value.weekEnds.sat) ? <Typography >Viikonloppuisin: suljettu</Typography> : <div>
                        <Typography >La: {getFormattedTimes(value.weekEnds.sat)}</Typography>
                        <Typography >Su: {getFormattedTimes(value.weekEnds.sun)}</Typography>
                    </div>}


                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div>{editWeekEnds ? <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' onClick={() => setEditWeekends(!editWeekDays)}>Muokkaa</Button></Tooltip> : <div>
                    <Tooltip title={`Talleta muokkauksesi `} arrow><Button size='small' variant='outlined' color='primary' onClick={saveWeekDayEdit}>Tallenna</Button></Tooltip>
                    <Tooltip title={`Peru muokkaukset`} arrow><Button size='small' variant='outlined' color='secondary' onClick={() => {
                        setValue(bookerObject.timeTables)
                        setEditWeekends(!editWeekEnds)
                    }}>Peru</Button></Tooltip>
                </div>}</div>}
            </ExpansionPanelActions>
        </ExpansionPanel>
    )



    const weekdayPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Arkipäivät</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>{sameAsBase(value) ? <span>Arkisin: {getFormattedTimes(value.base)}</span> : <span>{getWeekdayTimes(value)}</span>}</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >
                    <Typography>Yleisen ajan muokkaaminen asettaa kaikki arkipäivät samaan aikaan</Typography>
                    {singleDaySlider('Yleinen', value.base, handleBase, editWeekDays, value.base, true)}
                    
                </div>
                <div className={classes.column} >
                {singleDaySlider('Maanantai', value.weekDays.mon, handleMon, editWeekDays, value.base, true)}
                {singleDaySlider('Tiistai', value.weekDays.tue, handleTue, editWeekDays, value.base, true)}
                {singleDaySlider('Keskiviikko', value.weekDays.wed, handleWed, editWeekDays, value.base, true)}
                {singleDaySlider('Torstai', value.weekDays.thu, handleThu, editWeekDays, value.base, true)}
                {singleDaySlider('Perjantai', value.weekDays.fri, handleFri, editWeekDays, value.base, true)}
                
                
                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    <Typography variant="caption">
                        Näkymä:
                    </Typography>
                    {sameAsBase(value) ? <div>Arkisin: {getFormattedTimes(value.base)}</div> : <div>{getWeekdayTimes(value)}</div>}
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div>{editWeekDays ? <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' onClick={() => setEditWeekdays(!editWeekDays)}>Muokkaa</Button></Tooltip> : <div>
                    <Tooltip title={`Talleta muokkauksesi `} arrow><Button size='small' variant='outlined' color='primary' onClick={saveWeekDayEdit}>Tallenna</Button></Tooltip>
                    <Tooltip title={`Peru muokkaukset`} arrow><Button size='small' variant='outlined' color='secondary' onClick={() => {
                        setValue(bookerObject.timeTables)
                        setEditWeekdays(!editWeekDays)
                    }}>Peru</Button></Tooltip>
                </div>}</div>}

            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const holidayPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Pyhät ja erikoispäivät</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Aseta poikkeuksia</Typography>
                </div>

            </ExpansionPanelSummary>
            <div >
                {holidayFormOpen ? <div className={classes.holidayAddForm}>
                    <div className={classes.halfDiv}>
                        <div>
                            <Tooltip title={`${capitalize(format(addDays(selectedDate, -1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, -1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -1), 'MM/dd/yyyy')} `}>
                                <span className={classes.dayBtn}><Button className={classes.dayBtn} disabled={isBefore(selectedDate, new Date)} onClick={() => setSelectedDate(addDays(selectedDate, -1))} size='small'><NavigateBeforeRoundIcon /></Button></span></Tooltip>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fi}>
                                <KeyboardDatePicker
                                    //disableToolbar
                                    variant="dialog"
                                    cancelLabel="Peru"
                                    format={"EEEE dd/MM/yyyy"}

                                    options={{ locale: fi }}
                                    margin="normal"
                                    id="date-picker-inline"
                                    value={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    autoOk
                                    locale={fi}
                                    disablePast
                                    inputProps={{
                                        disabled: true,
                                        size: 'small',
                                        className: classes.dateInput

                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />

                            </MuiPickersUtilsProvider>
                            <Tooltip title={`${capitalize(format(addDays(selectedDate, 1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, 1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, 1), 'dd/MM/yyyy')} `}>
                                <span className={classes.dayBtn}><Button className={classes.dayBtn} onClick={() => setSelectedDate(addDays(selectedDate, 1))} size='small'><NavigateNextRoundedIcon /></Button></span></Tooltip>

                        </div>
                        <br />
                        <TextField
                            className={classes.specialTextfield}
                            id="reason"
                            label="Syy tai nimike"
                            variant="outlined"
                            onChange={({ target }) => setSpecialDayReason(target.value)}
                            helperText="Esimerkiksi 'Helatorstai' tai 'Inventaario'" />
                    </div>
                    <br />
                    <div className={classes.halfDiv} >
                        <div style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                            <Typography>Aseta ajat </Typography>
                            <Slider
                                name='Erikoispäivä'
                                value={specialDayTimes}
                                onChange={handleSpecial}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                getAriaValueText={valuetext}
                                valueLabelFormat={valueLabelFormat}
                                step={0.25}
                                min={0}
                                max={24}
                                type={'number'}
                                aria-labelledby='input-slider'
                                marks={marks}
                            //disabled={editWeekDays}
                            />
                        </div>
                        <Typography>Näkymä:</Typography>
                        <Typography style={{ fontWeight: 600 }}>  {specialDayReason.length === 0 ? <span>Syy tai nimi</span> : <span>{specialDayReason}</span>}, {format(selectedDate, 'dd.MM.')} : {getFormattedTimes(specialDayTimes)} {isClosed(specialDayTimes) ? <Button size='small' color='secondary' onClick={() => handleSpecial(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleSpecial(1, [0, 0])}>Aseta suljetuksi</Button>}</Typography>

                        <div style={{ margin: 10, float: 'right' }}>
                            {specialDayReason.length === 0 ? <Tooltip title='Täytä kaikki tiedot ensiksi'><Button disabled>Lisää</Button></Tooltip> : <Button onClick={addNewSpecialDay} style={{ backgroundColor: 'green', color: 'white' }} variant='contained'>Lisää</Button>}
                            <Button onClick={resetSpecialForm} color='secondary' variant='contained'>Peru</Button>
                        </div>
                    </div>

                </div> : <div ><span>Lisää uusi<Tooltip title='Lisää uusi poikkeuspäivä'><Button onClick={() => setHolidayFormOpen(true)}><AddCircleIcon style={{ color: 'green' }} /></Button></Tooltip></span></div>

                }

            </div>
            <br />
            <div className={classes.column}>

            </div>
            <div className={classes.column}>

            </div>
            {specialDayKeys.map(specialKey => (
                <div key={specialKey} style={{ marginLeft: '20%', marginRight: '20%' }}>
                    <Divider />
                    <div className={classes.specialDays}>

                        <div className={classes.specialDay}>
                            <Typography className={classes.specialText}>{bookerObject.specialDays[specialKey].date}</Typography>
                        </div>
                        <div className={classes.specialDay}>
                            <Typography className={classes.specialText}>{bookerObject.specialDays[specialKey].reason}</Typography>
                        </div>
                        <div className={classes.specialDay}>
                            <Typography variant="caption" className={classes.specialText}>
                                Aukiolot : {getFormattedTimes(bookerObject.specialDays[specialKey].times)}
                            </Typography>
                        </div>
                        <div className={classes.specialDay}>
                            <Button size='small' color='secondary' variant='contained' onClick={() => deleteSpecialDay(specialKey)}>Poista</Button>
                        </div>
                    </div>
                </div>
            ))}
            <Divider />
            <ExpansionPanelDetails className={classes.details}>

            </ExpansionPanelDetails>

            <ExpansionPanelActions>
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const personWeekdayPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Arkipäivät</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>{sameAsBase(selectedTimeTables) ? <span>Arkisin: {getFormattedPersonTimes(selectedTimeTables.base)}</span> : <span>{getWeekdayPersonTimes(selectedTimeTables)}</span>}</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >
                    <Typography>Yleisen ajan muokkaaminen asettaa kaikki arkipäivät samaan aikaan</Typography>
                    {singleDaySlider('Yleinen', selectedTimeTables.base, handlePersonBase, editPersonWeekDays, selectedTimeTables.base, false)}
                </div>
                <div className={classes.column} >
                    {singleDaySlider('Maanantai', selectedTimeTables.weekDays.mon, handlePersonMon, editPersonWeekDays, selectedTimeTables.base, false)}
                    {singleDaySlider('Tiistai', selectedTimeTables.weekDays.tue, handlePersonTue, editPersonWeekDays, selectedTimeTables.base, false)}
                    {singleDaySlider('Keskiviikko', selectedTimeTables.weekDays.wed, handlePersonWed, editPersonWeekDays, selectedTimeTables.base, false)}
                    {singleDaySlider('Torstai', selectedTimeTables.weekDays.thu, handlePersonThu, editPersonWeekDays, selectedTimeTables.base, false)}
                    {singleDaySlider('Perjantai', selectedTimeTables.weekDays.fri, handlePersonFri, editPersonWeekDays, selectedTimeTables.base, false)}

                    
                    
                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    <Typography variant="caption">
                        Näkymä:
                    </Typography>
                    {sameAsBase(selectedTimeTables) ? <div>Arkisin: {isClosed(selectedTimeTables.base)? <span>Ei paikalla</span> : <span>{getFormattedPersonTimes(selectedTimeTables.base)}</span>}</div> : <div>{getWeekdayPersonTimes(selectedTimeTables)}</div>}
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div>{editPersonWeekDays ? <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' onClick={() => setEditPersonWeekdays(!editPersonWeekDays)}>Muokkaa</Button></Tooltip> : <div>
                    <Tooltip title={`Talleta muokkauksesi `} arrow><Button size='small' variant='outlined' color='primary' onClick={savePersonWeekDayEdit}>Tallenna</Button></Tooltip>
                    <Tooltip title={`Peru muokkaukset`} arrow><Button size='small' variant='outlined' color='secondary' onClick={() => {
                        setSelectedTimeTables(bookerObject.resources[`${selectedResources}`].timeTables)
                        setEditPersonWeekdays(!editPersonWeekDays)
                    }}>Peru</Button></Tooltip>
                </div>}</div>}

            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const personWeekendPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Viikonloppu </Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Aseta Viikonloppu</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >
                </div>
                <div className={classes.column} >
                    {singleDaySlider('Lauantai', selectedTimeTables.weekEnds.sat, handlePersonSat, editPersonWeekEnds, selectedTimeTables.base, false)}
                    {singleDaySlider('Sunnuntai', selectedTimeTables.weekEnds.sun, handlePersonSun, editPersonWeekEnds, selectedTimeTables.base, false)}



                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    {isClosed(selectedTimeTables.weekEnds.sun) && isClosed(value.weekEnds.sat) ? <Typography >Viikonloppuisin: ei paikalla</Typography> : <div>
                    <Typography >La: {isClosed(selectedTimeTables.weekEnds.sat)? <span>Ei paikalla</span> : <span>{getFormattedTimes(selectedTimeTables.weekEnds.sat)}</span>}</Typography>
                        <Typography >Su: {isClosed(selectedTimeTables.weekEnds.sun)? <span>Ei paikalla</span> : <span>{getFormattedTimes(selectedTimeTables.weekEnds.sun)}</span>}</Typography>
                    </div>}


                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                {loading ? <CircularProgress className={classes.addButton} size={25} /> : <div>{editPersonWeekEnds ? <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' onClick={() => setEditPersonWeekends(!editPersonWeekDays)}>Muokkaa</Button></Tooltip> : <div>
                    <Tooltip title={`Talleta muokkauksesi `} arrow><Button size='small' variant='outlined' color='primary' onClick={saveWeekDayEdit}>Tallenna</Button></Tooltip>
                    <Tooltip title={`Peru muokkaukset`} arrow><Button size='small' variant='outlined' color='secondary' onClick={() => {
                        setSelectedTimeTables(bookerObject.resources[`${selectedResources}`].timeTables)
                        setEditPersonWeekends(!editPersonWeekEnds)
                    }}>Peru</Button></Tooltip>
                </div>}</div>}
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const singleDaySlider = (name, dayValue, onChange, disabled, baseValue, system) => (
            <div className={classes.sliderOuter} >
                        <div className={classes.sliderInner}>
                            <Typography>{name}: </Typography>
                            <Slider
                                name={`${name}`}
                                value={dayValue}
                                onChange={onChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                getAriaValueText={valuetext}
                                valueLabelFormat={valueLabelFormat}
                                step={0.25}
                                min={0}
                                max={24}
                                type={'number'}
                                aria-labelledby='input-slider'
                                marks={marks}
                                disabled={disabled}
                            />
                            <Typography >{system? getFormattedTimes(dayValue) : getFormattedPersonTimes(dayValue)}</Typography>
                            {disabled ? <em /> : <div>{isClosed(dayValue) ? <Button size='small' color='secondary' onClick={() => onChange(2, baseValue)}>{system? 'Aseta avonaiseksi' : 'Aseta läsnäolevaksi'}</Button> : <Button size='small' color='secondary' onClick={() => onChange(1, [0, 0])}>{system? 'Aseta suljetuksi' : 'Aseta poissaolevaksi'}</Button>}</div>}
                        </div>
                    </div>
        )
    

    const personSpecialPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Yksittäiset päivät</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Määrittele yksittäisille päiville aikatauluja</Typography>
                </div>

            </ExpansionPanelSummary>
            <div >
                {holidayForm2Open ? <div className={classes.holidayAddForm}>
                    <div className={classes.halfDiv}>
                        <div>
                            <Tooltip title={`${capitalize(format(addDays(resourceSelectedDate, -1), "EEEE", { locale: fi }).substring(0, format(addDays(resourceSelectedDate, -1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(resourceSelectedDate, -1), 'MM/dd/yyyy')} `}>
                                <span className={classes.dayBtn}><Button className={classes.dayBtn} disabled={isBefore(resourceSelectedDate, new Date)} onClick={() => setResourceSelectedDate(addDays(resourceSelectedDate, -1))} size='small'><NavigateBeforeRoundIcon /></Button></span></Tooltip>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fi}>
                                <KeyboardDatePicker
                                    //disableToolbar
                                    variant="dialog"
                                    cancelLabel="Peru"
                                    format={"EEEE dd/MM/yyyy"}

                                    options={{ locale: fi }}
                                    margin="normal"
                                    id="date-picker-inline"
                                    value={resourceSelectedDate}
                                    onChange={(date) => {
                                        setResourceSelectedDate(date)
                                    }}
                                    autoOk
                                    locale={fi}
                                    disablePast
                                    inputProps={{
                                        disabled: true,
                                        size: 'small',
                                        className: classes.dateInput

                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />

                            </MuiPickersUtilsProvider>
                            <Tooltip title={`${capitalize(format(addDays(resourceSelectedDate, 1), "EEEE", { locale: fi }).substring(0, format(addDays(resourceSelectedDate, 1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(resourceSelectedDate, 1), 'dd/MM/yyyy')} `}>
                                <span className={classes.dayBtn}><Button className={classes.dayBtn} onClick={() => setResourceSelectedDate(addDays(resourceSelectedDate, 1))} size='small'><NavigateNextRoundedIcon /></Button></span></Tooltip>

                        </div>
                        <br />
                        <div style={{ margin: 20 }}>
                            <Typography>Aseta ajat </Typography>


                            <Slider
                                name='Erikoispäivä'
                                value={resourceSpecialTimes}
                                onChange={handleResourceSpecial}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                getAriaValueText={valuetext}
                                valueLabelFormat={valueLabelFormat}
                                step={0.25}
                                min={0}
                                max={24}
                                type={'number'}
                                aria-labelledby='input-slider'
                                marks={marks}
                            //disabled={editWeekDays}
                            />
                        </div>
                    </div>
                    <br />
                    <div className={classes.halfDiv} >
                        <div style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                            <Typography>Valitun päivän aukioloajat: <span style={{ fontWeight: 600 }}>{dayHasSpecialTimes(resourceSelectedDate) ? <span>(Poikkeusaikataulu) {getFormattedTimes(bookerObject.specialDays[[`${format(resourceSelectedDate, `dd:MM:yyyy`)}`]].times)}</span> : getSingleDayTimesText(getDay(resourceSelectedDate), bookerObject.timeTables)}</span></Typography>
                            {console.log('Singletimes:', getDateTimes(resourceSelectedDate))}

                        </div>
                        <br />
                        {(getDateTimes(resourceSelectedDate)[0] > resourceSpecialTimes[0] || getDateTimes(resourceSelectedDate)[1] < resourceSpecialTimes[1]) && !isClosed(resourceSpecialTimes) ? <Typography>Et voi asettaa henkilölle aukioloaikoja pidempiä aikoja <Button size='small' color='secondary' onClick={() => handleResourceSpecial(2, [getDateTimes(resourceSelectedDate)[0], getDateTimes(resourceSelectedDate)[1]])}>Aseta kokoajaksi</Button></Typography> : <span>
                            <Typography style={{ fontWeight: 600 }}>  {specialDayReason.length === 0 ? <span>{selectedResources}</span> : <span>{specialDayReason}</span>}, {format(resourceSelectedDate, 'dd.MM.')} : {!isClosed(resourceSpecialTimes) ? <span>{getFormattedTimes(resourceSpecialTimes)}   <Button size='small' color='secondary' onClick={() => handleResourceSpecial(1, [0, 0])}>Aseta poissaolevaksi</Button></span> : <span> Ei paikalla <Button size='small' color='secondary' onClick={() => handleResourceSpecial(2, [getDateTimes(resourceSelectedDate)[0], getDateTimes(resourceSelectedDate)[1]])}>Aseta kokoajaksi</Button></span>}</Typography>
                        </span>}
                        <div style={{ margin: 10, float: 'right' }}>
                            {(getDateTimes(resourceSelectedDate)[0] > resourceSpecialTimes[0] || getDateTimes(resourceSelectedDate)[1] < resourceSpecialTimes[1]) && !isClosed(resourceSpecialTimes) ? <Tooltip title='Tarkista antamasi tiedot'><Button >Lisää</Button></Tooltip> : <Button onClick={addResourceSpecialDay} style={{ backgroundColor: 'green', color: 'white' }} variant='contained'>Lisää</Button>}
                            <Button onClick={resetResourceSpecialForm} color='secondary' variant='contained'>Peru</Button>
                        </div>
                    </div>

                </div> : <div ><span>Lisää uusi<Tooltip title='Lisää uusi poikkeuspäivä'><Button onClick={() => setHolidayForm2Open(true)}><AddCircleIcon style={{ color: 'green' }} /></Button></Tooltip></span></div>

                }

            </div>
            <br />
            <div className={classes.column}>

            </div>
            <div className={classes.column}>

            </div>
            {!!bookerObject.resources[`${selectedResources}`].specialDays?
            <div>
            {Object.keys(bookerObject.resources[`${selectedResources}`].specialDays).map(key => (
                <div style={{ marginLeft: '20%', marginRight: '20%' }}>
                    <Divider />
                    <div className={classes.specialDays}>

                        
                        <div className={classes.specialDay}>
                            <Typography variant="caption" className={classes.specialText}>
                                {bookerObject.resources[`${selectedResources}`].specialDays[key].date}
                            </Typography>
                        </div>
                        <div className={classes.specialDay}>
                            <Typography variant='caption' className={classes.specialText}>
                                {isClosed(bookerObject.resources[`${selectedResources}`].specialDays[key].times)? <span>Poissa</span> : getFormattedTimes(bookerObject.resources[`${selectedResources}`].specialDays[key].times)}
                            </Typography>
                        </div>
                        <div className={classes.specialDay}>
                            <Button size='small' color='secondary' variant='contained' disabled={loading} onClick={() => removeResourceSpecialDay(key, selectedResources)} >Poista</Button>
                        </div>
                    </div>
                </div>
            ))}</div>: <em/>}
            <Divider />
            <ExpansionPanelDetails className={classes.details}>

            </ExpansionPanelDetails>

            <ExpansionPanelActions>
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const resourcePanel = () => {
        
        var humanResources = []
        Object.keys(bookerObject.resources).map(key => {
            if (bookerObject.resources[key].human){
                humanResources.push(bookerObject.resources[key])
            }
        })

        return (
            <div>
                <div style={{ display: 'flex' }}><Typography variant="h6" style={{ flexBasis: '80%', paddingLeft: '20%' }}>Resurssikohtainen ajanhallinta</Typography>
                    <FormControl style={{ bottom: 10 }}>
                        <InputLabel id='resouceTimes'>Valitse henkilö</InputLabel>
                        <Select labelId='resourceTimes'
                            style={{ minWidth: 150 }}
                            value={selectedResources}
                            onChange={({ target }) => { if (!!target.value) {
                                setSelectedResources(target.value)
                                setSelectedTimeTables(bookerObject.resources[`${target.value}`].timeTables)} }}>
                            {humanResources.map(r => (
                                <MenuItem key={r.name+'list'} value={r.name}>{r.name}</MenuItem>
                            ))}
                        </Select></FormControl>
                    <br />
                    <Divider />
                </div>
                {selectedResources === 'default' ? <div>
                    <Typography variant='caption'>Valitse henkilö nähdäksesi henkilökohtaiset ajat</Typography>
                </div> : <div>
                        <Typography variant='caption'>Henkilön {selectedResources} ajanhallinta</Typography>
                        {personWeekdayPanel()}
                        {personWeekendPanel()}
                        {personSpecialPanel()}
                    </div>}
            </div>

        )
    }


    return (
        <div>
            <br />
            <Typography variant='h5'>Aukioloajat</Typography>
            <Typography variant='caption'>Aseta varausjärjestelmääsi aukioloajat</Typography>
            <br />
            {weekdayPanel()}
            {weekendPanel()}
            {holidayPanel()}
            <Divider />
            <br />
            {bookerObject.resources.length>0? resourcePanel() : <em/>}



        </div>
    )

}

export default TimeManagement