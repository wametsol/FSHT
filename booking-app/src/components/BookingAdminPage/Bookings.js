import React, { useState, useEffect } from 'react';
import 'date-fns'
import { format, getDay, addDays, isBefore, set } from 'date-fns'
import firebase, { auth, firestore } from '../../firebase'
import { ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, Tooltip, Button, Typography, CircularProgress, capitalize, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, TextField, Select, MenuItem, ListSubheader } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import useStyles from './useStyles'
import clsx from 'clsx';

import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText, getSinglePersonDayTimesText, getFormattedPersonTimes } from '../BookingAdminPage/TimeTableServices'

import DateFnsUtils from '@date-io/date-fns'
import { fi } from 'date-fns/locale'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CheckIcon from '@material-ui/icons/Check'
import BlockIcon from '@material-ui/icons/Block'
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import NavigateBeforeRoundIcon from '@material-ui/icons/NavigateBefore'
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded'






const Bookings = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData, bookingsObject }) => {
    const [chosenBooking, setChosenBooking] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [reason, setReason] = useState('')
    const [selectedResources, setSelectedResources] = useState('all')

    const classes = useStyles()


    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setChosenBooking(null)
        setOpen(false)
    }

    const handleDateChange = (date) => {
        setSelectedDate(date)
        console.log(bookingsObject[`${format(date, `dd:MM:yyyy`)}`])
    }

    const cancelBooking = (booking) => {
        setChosenBooking(booking)
        handleClickOpen()

    }
    /*
    firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ services: firebase.firestore.FieldValue.arrayRemove(service) })
    
        firestore.collection(`booker${data.target}`).doc('bookings').update({ [`${format(selectedDate, `dd:MM:yyyy`)}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) }).then(res => {
            firestore.collection('userCollection').doc(user.email).update({ bookings: firebase.firestore.FieldValue.arrayUnion(bookingObject) })
    */
    const confirmCancellation = (e) => {
        e.preventDefault()
        setLoading(true)
        var cancelReason
        if (e.target.name.value.length > 0) {
            cancelReason = e.target.name.value
        } else {
            cancelReason = 'Tuntematon syy'
        }
        try {
            bookingsObject[`${format(selectedDate, `dd:MM:yyyy`)}`].map(b => {
                console.log(b.id + " vs. " + chosenBooking.id)
                if (b.id === chosenBooking.id) {
                    let updatedObject = { ...b }
                    b.active = false
                    b.cancelled = {
                        date: format(new Date, `dd:MM:yyyy:HH.mm`),
                        reason: cancelReason
                    }
                    firestore.collection(`booker${bookerObject.bookerAddress}`).doc('bookings').update({ [`${format(selectedDate, `dd:MM:yyyy`)}`]: firebase.firestore.FieldValue.arrayRemove(updatedObject) }).then(res => {
                        console.log(res)

                        firestore.collection(`booker${bookerObject.bookerAddress}`).doc('bookings').update({ [`${format(selectedDate, `dd:MM:yyyy`)}`]: firebase.firestore.FieldValue.arrayUnion(b) }).then(resp => {

                            firestore.collection('userCollection').doc(updatedObject.user.email).update({ bookings: firebase.firestore.FieldValue.arrayRemove(updatedObject) }).then(res => {

                                firestore.collection('userCollection').doc(b.user.email).update({ bookings: firebase.firestore.FieldValue.arrayUnion(b) }).then(res => {
                                    console.log(resp)
                                    setTimeout(() => {
                                        setSuccess(true)
                                        setTimeout(() => {
                                            setReason(cancelReason)
                                            setOpen(false)
                                            setSuccess(false)
                                            setLoading(false)
                                        }, 2000);

                                    }, 2000);
                                })
                            })
                        })




                    }).catch(err => {
                        console.log(err)
                    })

                }
            })

        } catch (error) {
            console.log(error)
        }



    }

    const getBookings = () => {
        if(selectedResources==='all') return bookingsObject[`${format(selectedDate, `dd:MM:yyyy`)}`]
        else return bookingsObject[`${format(selectedDate, `dd:MM:yyyy`)}`].filter(a => a.worker === selectedResources)
    }


    if (bookingsObject  === null) {
        return (
            <span><Typography>Ladataan varauksia </Typography><CircularProgress size={25} /></span>
            
        )
    } else if (bookingsObject === undefined) {
        return (
            <Typography>Sivustollasi ei ole vielä varauksia</Typography>
        )
    }

    const getHumanResources = () => {
        var humanResources = []
        Object.keys(bookerObject.resources).map(key => {
            if (bookerObject.resources[key].human){
                humanResources.push(bookerObject.resources[key])
            }
        })

        return humanResources
    }

    return (
        <div>

            <div style={{display:'flex'}}><Typography variant="h5" style={{flexBasis:'80%', paddingLeft:'20%'}}>Varaukset sivustolla </Typography> <div>
                <Select style={{ minWidth: 150 }}
                value={selectedResources}
                onChange={({ target }) => {if(!!target.value) setSelectedResources(target.value)}}>
                <MenuItem value='all'>Kaikki</MenuItem>
                <ListSubheader>Henkilöt</ListSubheader>
                {getHumanResources().map(r => (
                    <MenuItem key={r.name} value={r.name}>{r.name}</MenuItem>
                ))}
                <ListSubheader>Laitteet</ListSubheader>
                </Select></div></div>
                {selectedResources==='all'? <Typography>Näytetään varaukset kaikkien henkilöiden osalta</Typography> : <Typography>Näytetään henkilöön {selectedResources} kohdistuvat varaukset</Typography>}
            <div className={classes.adminDatepicker}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fi}>
                    <KeyboardDatePicker
                        //disableToolbar
                        variant="dialog"
                        cancelLabel="Peru"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Päivämäärä"
                        value={selectedDate}
                        onChange={handleDateChange}
                        autoOk
                        inputProps={{
                            disabled: true
                        }}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />

                </MuiPickersUtilsProvider>
                <div className={classes.datePickerTitle}>
                    {!!bookerObject.specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`]?
                    <Typography>Valittuna päivänä käytössä poikkeuksellinen aukiolo, {bookerObject.specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`].reason}: <b>{getFormattedTimes(bookerObject.specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`].times)}</b> </Typography>
                    :
                    <Typography>Ilmoittamasi aukioloajat valitulle päivälle: <b>{getSingleDayTimesText(getDay(selectedDate), bookerObject.timeTables)} </b></Typography>}
                    {selectedResources==='all'? <em/>: 
                    <Typography>
                    {selectedResources} työajat valittuna päivänä: {!!bookerObject.resources[`${selectedResources}`].specialDays && !!bookerObject.resources[`${selectedResources}`].specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`]? 
                    <b>{getFormattedPersonTimes(bookerObject.resources[`${selectedResources}`].specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`].times)}</b>
                    : 
                    <b>{getSinglePersonDayTimesText(getDay(selectedDate), bookerObject.resources[`${selectedResources}`].timeTables)}</b>}
                    </Typography>}
                    
                </div>
            </div>
            <Divider />
            <div className={classes.currentDayTitle}>
                <Tooltip title={`${capitalize(format(selectedDate, "EEEE", { locale: fi }).substring(0, format(selectedDate, "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -7), 'dd/MM/yyyy')} `}>
                    <Button className={classes.weekBtn} onClick={() => setSelectedDate(addDays(selectedDate, -7))} size='small'><DoubleArrowRoundedIcon style={{ transform: 'rotate(180deg)' }} /></Button></Tooltip>

                <Tooltip title={`${capitalize(format(addDays(selectedDate, -1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, -1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -1), 'dd/MM/yyyy')} `}>
                    <Button className={classes.dayBtn} onClick={() => setSelectedDate(addDays(selectedDate, -1))} size='small'><NavigateBeforeRoundIcon /></Button></Tooltip>

                <Typography className={classes.datePickerTitle}> {capitalize(format(selectedDate, "EEEE", { locale: fi }))} {format(selectedDate, 'dd/MM/yyyy')}</Typography>

                <Tooltip title={`${capitalize(format(addDays(selectedDate, 1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, 1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, 1), 'dd/MM/yyyy')} `}>
                    <Button className={classes.dayBtn} onClick={() => setSelectedDate(addDays(selectedDate, 1))} size='small'><NavigateNextRoundedIcon /></Button></Tooltip>
                <Tooltip title={`${capitalize(format(selectedDate, "EEEE", { locale: fi }).substring(0, format(selectedDate, "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -7), 'dd/MM/yyyy')} `}>
                    <Button className={classes.weekBtn} onClick={() => setSelectedDate(addDays(selectedDate, 7))} size='small'><DoubleArrowRoundedIcon /></Button></Tooltip>
            </div>
            <Divider />

            <ExpansionPanel>
                <ExpansionPanelSummary disabled>
                <div className={classes.column}>
                                <Typography className={classes.heading}>Palvelu</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.heading}>Aika / tila</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.heading}>Työntekijä</Typography>
                            </div>
                </ExpansionPanelSummary>
            </ExpansionPanel>
            {!bookingsObject[`${format(selectedDate, `dd:MM:yyyy`)}`] ? <em /> : <div>{getBookings().map(booking => (
                <div className={classes.root} key={booking.whenBooked}>
                    <ExpansionPanel >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{booking.service}</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{getFormattedTimes([booking.times.start, booking.times.end])} {!booking.active ? <span>PERUTTU {<BlockIcon className={classes.errorMessage} />}</span> : <span>AKTIIVINEN {<CheckIcon className={classes.green} />}</span>}</Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{booking.worker}</Typography>
                            </div>

                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                            <div className={classes.column} />
                            <div className={classes.column}>
                                <Typography>Varaaja: {booking.user.name}</Typography>
                                <Typography>Email: {booking.user.email}</Typography>
                            </div>
                            <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Varattu: {booking.whenBooked}
                                    {!booking.active ? <span> <br />Peruttu:  {booking.cancelled.date}
                                        <br /> Syy: {booking.cancelled.reason}
                                    </span> : <em />}
                                    <br />
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />

                        <ExpansionPanelActions>
                            <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                            <Tooltip title={`Peru henkilön ${booking.user.name} varaus ${getFormattedTimes([booking.times.start, booking.times.end])}`} arrow><Button size="small" color="secondary" onClick={() => cancelBooking(booking)} >Peruuta varaus</Button></Tooltip>
                        </ExpansionPanelActions>
                    </ExpansionPanel>

                </div>
            ))}</div>}
            {!chosenBooking ? <em /> : <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Vahvista varauksen peruutus</DialogTitle>
                <form onSubmit={confirmCancellation}>
                    <DialogContent>
                        <DialogContentText>
                            Olet perumassa varausta "{chosenBooking.service}"
            <br />Päivämäärä: {chosenBooking.bookingDate}
                            <br />Kello: {getFormattedTimes([chosenBooking.times.start, chosenBooking.times.end])}
                            <br />Varaaja: {chosenBooking.user.name}

                        </DialogContentText>
                        <TextField
                            helperText={reason.length === 0 ? "Anna peruutukselle syy" : ""}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Peruutuksen syy"
                            type="text"
                            fullWidth
                            multiline
                            required
                            error={reason.length === 0 ? true : false}
                            onChange={({ target }) => setReason(target.value)}

                        />
                    </DialogContent>
                    <DialogActions>
                        {success ? <Typography style={{ margin: 'auto' }}>Peruutus onnistui<CheckIcon /></Typography> : <span style={{ margin: 'auto' }}>{loading ? <span><Typography style={{ display: 'inline' }} >Perutaan varausta </Typography><CircularProgress size={25} /></span> : <span>
                            <Button type="submit" color="primary">
                                Vahvista peruutus
          </Button>
                            <Button onClick={handleClose} color="primary">
                                Palaa
          </Button>
                        </span>}</span>}
                    </DialogActions>
                </form>
            </Dialog>}





        </div>
    )

}


export default Bookings