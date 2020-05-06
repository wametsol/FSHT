import React, { useState, useEffect } from 'react';
import { Slider, Typography, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, Tooltip, Button, CircularProgress, TextField, capitalize } from '@material-ui/core';
import useStyles from './useStyles'
import clsx from 'clsx'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import NavigateBeforeRoundIcon from '@material-ui/icons/NavigateBefore'

import firebase, { firestore } from '../../firebase'
import { useRouteMatch } from 'react-router-dom'
import { sameAsBase, isClosed, getFormattedTimes, getWeekdayTimes, valueLabelFormat, valuetext } from './TimeTableServices'

import DateFnsUtils from '@date-io/date-fns'
import { fi } from 'date-fns/locale'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { format, getDay, addDays, isBefore, parseISO } from 'date-fns'




const initialTimetable = {
    base: [8, 16],
    weekDays: {
        mon: [8, 16],
        tue: [8, 16],
        wed: [8, 16],
        thu: [8, 16],
        fri: [8, 16],
    },
    weekEnds: {
        sat: [8, 16],
        sun: [8, 16]
    }
}
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
    const [editWeekEnds, setEditWeekends] = useState(true)
    const [loading, setLoading] = useState(false)
    const [holidayFormOpen, setHolidayFormOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date)
    const [specialDayTimes, setSpecialDayTimes] = useState([8, 16])
    const [specialDayReason, setSpecialDayReason] = useState('')
    const pagematch = useRouteMatch('/:id')

    const specialDayKeys = Object.keys(bookerObject.specialDays)
    
    //SORT SPECIALDAYS TO ASC ORDER
    specialDayKeys.sort((a,b) => parseISO(`${a.substring(6,10)}-${a.substring(3,5)}-${a.substring(0,2)}`) - parseISO(`${b.substring(6,10)}-${b.substring(3,5)}-${b.substring(0,2)}`))
    
    

    const handleBase = (event, newValue) => {
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
        setValue({
            ...value,
            weekEnds: {
                ...value.weekEnds,
                sat: newValue
            }
        })
    }
    const handleSun = (event, newValue) => {
        setValue({
            ...value,
            weekEnds: {
                ...value.weekEnds,
                sun: newValue
            }
        })
    }
    const handleSpecial = (event, newValue) => {
        setSpecialDayTimes(newValue)
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


    const resetSpecialForm = (e) => {
        e.preventDefault()
        setSpecialDayTimes([8, 16])
        setHolidayFormOpen(false)
        setSpecialDayReason('')
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
                .then((res) => {
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
                    <div style={{ margin: 20, border: 'solid 1px' }}>
                        <Typography>Lauantai: </Typography>
                        <Slider
                            name='Lauantai'
                            value={value.weekEnds.sat}
                            onChange={handleSat}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'
                            disabled={editWeekEnds}

                        />
                        <Typography >{getFormattedTimes(value.weekEnds.sat)}</Typography>
                        {editWeekEnds ? <em /> : <div>{isClosed(value.weekEnds.sat) ? <Button size='small' color='secondary' onClick={() => handleSat(2, [8, 16])}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleSat(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}
                    </div>
                    <div style={{ margin: 20, border: 'solid 1px' }}>
                        <Typography>Sunnuntai: </Typography>
                        <Slider
                            name='Sunnuntai'
                            value={value.weekEnds.sun}
                            onChange={handleSun}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'
                            disabled={editWeekEnds}

                        />
                        <Typography >{getFormattedTimes(value.weekEnds.sun)}</Typography>
                        {editWeekEnds ? <em /> : <div>{isClosed(value.weekEnds.sun) ? <Button size='small' color='secondary' onClick={() => handleSun(2, [8, 16])}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleSun(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}
                    </div>



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
                    <Typography className={classes.secondaryHeading}>{sameAsBase(value) ? <div>Arkisin: {getFormattedTimes(value.base)}</div> : <div>{getWeekdayTimes(value)}</div>}</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >
                    <Typography variant='h5'>Yleinen</Typography>
                    <Typography>Yleisen ajan muokkaaminen asettaa kaikki arkipäivät samaan aikaan</Typography>
                    <Slider
                        name='Yleinen'
                        value={value.base}
                        onChange={handleBase}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valueLabelFormat}
                        step={0.25}
                        min={0}
                        max={24}
                        marks={marks}
                        type={'number'}
                        aria-labelledby='input-slider'
                        width='75%'
                        disabled={editWeekDays}


                    />
                    <Typography >{getFormattedTimes(value.base)}</Typography>
                    {editWeekDays ? <em /> : <div>{isClosed(value.base) ? <Button size='small' color='secondary' onClick={() => handleBase(2, [8, 16])}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleBase(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}

                </div>
                <div className={classes.column} >
                    <div className={classes.sliderOuter} >
                        <div className={classes.sliderInner}>
                            <Typography>Maanantai: </Typography>
                            <Slider
                                name='Maanantai'
                                value={value.weekDays.mon}
                                onChange={handleMon}
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
                                disabled={editWeekDays}
                            />
                            <Typography >{getFormattedTimes(value.weekDays.mon)}</Typography>
                            {editWeekDays ? <em /> : <div>{isClosed(value.weekDays.mon) ? <Button size='small' color='secondary' onClick={() => handleMon(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleMon(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}

                        </div>
                    </div>
                    <div className={classes.sliderOuter} >
                        <div className={classes.sliderInner}>
                            <Typography>Tiistai: </Typography>
                            <Slider
                                name='Tiistai'
                                value={value.weekDays.tue}
                                onChange={handleTue}
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
                                disabled={editWeekDays}
                            />
                            <Typography >{getFormattedTimes(value.weekDays.tue)}</Typography>
                            {editWeekDays ? <em /> : <div>{isClosed(value.weekDays.tue) ? <Button size='small' color='secondary' onClick={() => handleTue(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleTue(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}
                        </div>
                    </div>
                    <div className={classes.sliderOuter} >
                        <div className={classes.sliderInner}>
                            <Typography>Keskiviikko: </Typography>
                            <Slider
                                name='Keskiviikko'
                                value={value.weekDays.wed}
                                onChange={handleWed}
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
                                disabled={editWeekDays}
                            />
                            <Typography>{getFormattedTimes(value.weekDays.wed)}</Typography>
                            {editWeekDays ? <em /> : <div>{isClosed(value.weekDays.wed) ? <Button size='small' color='secondary' onClick={() => handleWed(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleWed(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}
                        </div>
                    </div>
                    <div className={classes.sliderOuter} >
                        <div className={classes.sliderInner}>
                            <Typography>Torstai: </Typography>
                            <Slider
                                name='Torstai'
                                value={value.weekDays.thu}
                                onChange={handleThu}
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
                                disabled={editWeekDays}
                            />
                            <Typography > {getFormattedTimes(value.weekDays.thu)}</Typography>
                            {editWeekDays ? <em /> : <div>{isClosed(value.weekDays.thu) ? <Button size='small' color='secondary' onClick={() => handleThu(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleThu(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}
                        </div>
                    </div>
                    <div className={classes.sliderOuter} >
                        <div className={classes.sliderInner}>
                            <Typography>Perjantai: </Typography>
                            <Slider
                                name='Perjantai'
                                value={value.weekDays.fri}
                                onChange={handleFri}
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
                                disabled={editWeekDays}
                            />
                            <Typography >{getFormattedTimes(value.weekDays.fri)}</Typography>
                            {editWeekDays ? <em /> : <div>{isClosed(value.weekDays.fri) ? <Button size='small' color='secondary' onClick={() => handleFri(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleFri(1, [0, 0])}>Aseta suljetuksi</Button>}</div>}
                        </div>
                    </div>
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
                                <Typography style={{ fontWeight: 600 }}>  {specialDayReason.length===0? <span>Syy tai nimi</span>: <span>{specialDayReason}</span>}, {format(selectedDate, 'dd.MM.')} : {getFormattedTimes(specialDayTimes)} {isClosed(specialDayTimes) ? <Button size='small' color='secondary' onClick={() => handleSpecial(2, value.base)}>Aseta avonaiseksi</Button> : <Button size='small' color='secondary' onClick={() => handleSpecial(1, [0, 0])}>Aseta suljetuksi</Button>}</Typography>

                        <div style={{ margin: 10, float: 'right' }}>
                                {specialDayReason.length===0? <Tooltip title='Täytä kaikki tiedot ensiksi'><Button disabled>Lisää</Button></Tooltip> : <Button onClick={addNewSpecialDay} style={{backgroundColor: 'green', color: 'white'}} variant='contained'>Lisää</Button> }
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
            {console.log(specialDayKeys)}
            {specialDayKeys.map(specialKey => (
                <div style={{ marginLeft: '20%', marginRight: '20%' }}>
                    <Divider />
                    <div className={classes.specialDays}>

                        <div className={classes.specialDay}>
                            {console.log(bookerObject.specialDays[specialKey].date)}
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


    return (
        <div>

            <Typography>Aukioloajat</Typography>
            <Typography>Aseta varausjärjestelmääsi aukioloajat</Typography>
            {weekdayPanel()}
            {weekendPanel()}
            {holidayPanel()}

        </div>
    )

}

export default TimeManagement