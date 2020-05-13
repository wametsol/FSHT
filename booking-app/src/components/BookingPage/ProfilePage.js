import React, { useState, useEffect } from 'react';
import firebase, { auth, firestore } from '../../firebase'
import { Tabs, Tab, Paper, CircularProgress, Typography, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import { format, getDay, addDays, isBefore, formatDistance, formatDistanceToNow, parseISO, sub, isAfter } from 'date-fns'
import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText, valueLabelFormat } from '../BookingAdminPage/TimeTableServices'
import useStyles from './useStyles'

import clsx from 'clsx';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CheckIcon from '@material-ui/icons/Check'
import BlockIcon from '@material-ui/icons/Block'
import DoneAllIcon from '@material-ui/icons/DoneAll'

const ProfilePage = ({ site, bookingsObject, services }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [userData, setUserData] = useState(null)
    const [chosenBooking, setChosenBooking] = useState(null)
    const [reason, setReason] = useState('')
    const [open, setOpen] = useState(false)
    const [success, setSuccess] = useState(false)
    const user = auth.currentUser
    const classes = useStyles()
    const [value, setValue] = useState(0)

    useEffect(() => {
        try {
            setLoading(true)
            firestore.collection('userCollection').doc(`${user.email}`).get()
                .then(response => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    console.log(response)
                    console.log(response.data())
                    setUserData(response.data())
                    setLoading(false)
                    console.log(userData)
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

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const cancelBooking = (booking) => {
        setChosenBooking(booking)
        handleClickOpen()
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setChosenBooking(null)
        setOpen(false)
    }
    const confirmCancellation = (e) => {
        e.preventDefault()
        setLoading(true)
        var cancelReason
        if (reason.length > 0) {
            cancelReason = reason
        } else {
            cancelReason = 'Tuntematon syy'
        }
        try {
            const dateObj = chosenBooking.bookingDate.replace(/\//g, ":")
            console.log(bookingsObject[dateObj])
            bookingsObject[dateObj].map(b => {
                console.log(b.id + " vs. " + chosenBooking.id)
                if (b.id === chosenBooking.id) {
                    let updatedObject = { ...b }
                    b.active = false
                    b.cancelled = {
                        date: format(new Date, `dd:MM:yyyy:HH.mm`),
                        reason: cancelReason
                    }
                    firestore.collection(`booker${site}`).doc('bookings').update({ [`${dateObj}`]: firebase.firestore.FieldValue.arrayRemove(updatedObject) }).then(res => {
                        console.log(res)

                        firestore.collection(`booker${site}`).doc('bookings').update({ [`${dateObj}`]: firebase.firestore.FieldValue.arrayUnion(b) }).then(resp => {

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

        }
    }

    const validCancelTime = (booking) => {

        return isAfter(new Date, sub(new Date(parseISO(`${booking.bookingDate.substring(6, 10)}-${booking.bookingDate.substring(3, 5)}-${booking.bookingDate.substring(0, 2)}T${valueLabelFormat(booking.times.start).substring(0, 2)}:${valueLabelFormat(booking.times.start).substring(3, 5)}`)), { hours: services.filter(service => service.service === booking.service)[0].cancelTime }))
    }

    const lastCancelTime = (booking) => {
        return new Date(sub(new Date(parseISO(`${booking.bookingDate.substring(6, 10)}-${booking.bookingDate.substring(3, 5)}-${booking.bookingDate.substring(0, 2)}T${valueLabelFormat(booking.times.start).substring(0, 2)}:${valueLabelFormat(booking.times.start).substring(3, 5)}`)), { hours: services.filter(service => service.service === booking.service)[0].cancelTime }))
    }

    const cancelledBookings = () => {
        return userData.bookings.filter(booking => !booking.active)
    }

    const activeBookings = () => {
        return userData.bookings.filter(booking => booking.active && !isAfter(new Date, new Date(parseISO(`${booking.bookingDate.substring(6, 10)}-${booking.bookingDate.substring(3, 5)}-${booking.bookingDate.substring(0, 2)}T${valueLabelFormat(booking.times.start).substring(0, 2)}:${valueLabelFormat(booking.times.start).substring(3, 5)}`))))
    }

    const pastBookings = () => {
        return userData.bookings.filter(booking => booking.active && isAfter(new Date, new Date(parseISO(`${booking.bookingDate.substring(6, 10)}-${booking.bookingDate.substring(3, 5)}-${booking.bookingDate.substring(0, 2)}T${valueLabelFormat(booking.times.start).substring(0, 2)}:${valueLabelFormat(booking.times.start).substring(3, 5)}`))))
    }

    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return activeTab()
            case 1:
                return pastTab()
            case 2:
                return cancelTab()
            default:
                return 'Unknown step';
        }
    }

    const activeTab = () => (
        <div>
            {activeBookings().map(booking => (
                <div key={booking.id}>

                    <ExpansionPanel className={classes.expanded} >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{booking.service}</Typography>
                            </div>
                            <div className={classes.column}>
                                {booking.bookingDate}
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{getFormattedTimes([booking.times.start, booking.times.end])} </Typography>
                            </div>
                            <div className={classes.column}>
                                {validCancelTime(booking) ? <Typography className={classes.heading}>Peruutusaika umpeutunut {<CheckIcon className={classes.green} />} </Typography> : <Typography className={classes.heading}>Peruttavissa {<CheckIcon className={classes.green} />}</Typography>}
                            </div>


                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>

                            <div className={classes.column} style={{ textAlign: 'left' }}>
                                <Typography>Varaaja: {booking.user.name}</Typography>
                                <Typography>Email: {booking.user.email}</Typography>
                            </div>
                            <div className={classes.column} />
                            <div className={classes.column} />
                            <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Varattu: {booking.whenBooked}
                                    {!booking.active ? <span> <br />Peruttu:  {booking.cancelled.date}
                                        <br /> Syy: {booking.cancelled.reason}
                                    </span> : <span>
                                            <br />
                                            {validCancelTime(booking) ?
                                                <div>
                                                    Peruutusaika umpeutui {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')}
                                                </div>
                                                :
                                                <div>
                                                    Peruttavissa {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')} mennessä
                                    </div>

                                            }
                                        </span>}
                                    <br />
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />

                        <ExpansionPanelActions>
                            {!booking.active ? <Typography style={{ justifyContent: 'center' }}>Varaus on peruttu. Epäselvissä tilanteissa ota suoraan yhteyttä toimipisteeseen.</Typography> :
                                <span>
                                    {validCancelTime(booking) ?
                                        <span>
                                            <Typography>Varausta ei voida peruuttaa, sillä peruutusaika umpeutui {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')}. Ota tarvittaessa yhteyttä suoraan toimipisteeseen </Typography>
                                        </span>
                                        :
                                        <span>
                                            <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                                            <Tooltip title={`Peru henkilön ${booking.user.name} varaus ${getFormattedTimes([booking.times.start, booking.times.end])}`} arrow><Button size="small" color="secondary" onClick={() => cancelBooking(booking)} >Peruuta varaus</Button></Tooltip>
                                        </span>

                                    }

                                </span>}
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                    <Divider />
                </div>
            ))}</div>
    )



    const pastTab = () => (
        <div>
            {pastBookings().map(booking => (
                <div key={booking.id}>

                    <ExpansionPanel className={classes.expanded} >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{booking.service}</Typography>
                            </div>
                            <div className={classes.column}>
                                {booking.bookingDate}
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{getFormattedTimes([booking.times.start, booking.times.end])} </Typography>
                            </div>
                            <div className={classes.column}>
                                {!booking.active ? <Typography className={classes.heading}>PERUTTU {<BlockIcon className={classes.errorMessage} />}</Typography> : <Typography className={classes.heading}>KÄYTETTY{<DoneAllIcon className={classes.pastIcon} />}</Typography>}
                            </div>


                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>

                            <div className={classes.column} style={{ textAlign: 'left' }}>
                                <Typography>Varaaja: {booking.user.name}</Typography>
                                <Typography>Email: {booking.user.email}</Typography>
                            </div>
                            <div className={classes.column} />
                            <div className={classes.column} />
                            <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Varattu: {booking.whenBooked}
                                    {!booking.active ? <span> <br />Peruttu:  {booking.cancelled.date}
                                        <br /> Syy: {booking.cancelled.reason}
                                    </span> : <span>
                                            <br />
                                            {validCancelTime(booking) ?
                                                <div>
                                                    Peruutusaika umpeutui {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')}
                                                </div>
                                                :
                                                <div>
                                                    Peruttavissa {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')} mennessä
                                            </div>

                                            }
                                        </span>}
                                    <br />
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />

                        <ExpansionPanelActions>
                            {!booking.active ? <Typography style={{ justifyContent: 'center' }}>Varaus on peruttu. Epäselvissä tilanteissa ota suoraan yhteyttä toimipisteeseen.</Typography> :
                                <span>
                                    {validCancelTime(booking) ?
                                        <span>
                                            <Typography>Varausta ei voida peruuttaa, sillä peruutusaika umpeutui {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')}. Ota tarvittaessa yhteyttä suoraan toimipisteeseen </Typography>
                                        </span>
                                        :
                                        <span>
                                            <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                                            <Tooltip title={`Peru henkilön ${booking.user.name} varaus ${getFormattedTimes([booking.times.start, booking.times.end])}`} arrow><Button size="small" color="secondary" onClick={() => cancelBooking(booking)} >Peruuta varaus</Button></Tooltip>
                                        </span>

                                    }

                                </span>}
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                    <Divider />
                </div>
            ))}
        </div>
    )
    const cancelTab = () => (
        <div>
            {cancelledBookings().map(booking => (
                <div key={booking.id}>

                    <ExpansionPanel className={classes.expanded} >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                            <div className={classes.column}>
                                <Typography className={classes.heading}>{booking.service}</Typography>
                            </div>
                            <div className={classes.column}>
                                {booking.bookingDate}
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>{getFormattedTimes([booking.times.start, booking.times.end])} </Typography>
                            </div>
                            <div className={classes.column}>
                                {!booking.active ? <Typography className={classes.heading}>PERUTTU {<BlockIcon className={classes.errorMessage} />}</Typography> : <Typography className={classes.heading}>AKTIIVINEN {<CheckIcon className={classes.green} />}</Typography>}
                            </div>


                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>

                            <div className={classes.column} style={{ textAlign: 'left' }}>
                                <Typography>Varaaja: {booking.user.name}</Typography>
                                <Typography>Email: {booking.user.email}</Typography>
                            </div>
                            <div className={classes.column} />
                            <div className={classes.column} />
                            <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Varattu: {booking.whenBooked}
                                    {!booking.active ? <span> <br />Peruttu:  {booking.cancelled.date}
                                        <br /> Syy: {booking.cancelled.reason}
                                    </span> : <span>
                                            <br />
                                            {validCancelTime(booking) ?
                                                <div>
                                                    Peruutusaika umpeutui {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')}
                                                </div>
                                                :
                                                <div>
                                                    Peruttavissa {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')} mennessä
                                            </div>

                                            }
                                        </span>}
                                    <br />
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />

                        <ExpansionPanelActions>
                            {!booking.active ? <Typography style={{ justifyContent: 'center' }}>Varaus on peruttu. Epäselvissä tilanteissa ota suoraan yhteyttä toimipisteeseen.</Typography> :
                                <span>
                                    {validCancelTime(booking) ?
                                        <span>
                                            <Typography>Varausta ei voida peruuttaa, sillä peruutusaika umpeutui {format(lastCancelTime(booking), 'dd.MM.yyyy HH.mm')}. Ota tarvittaessa yhteyttä suoraan toimipisteeseen </Typography>
                                        </span>
                                        :
                                        <span>
                                            <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                                            <Tooltip title={`Peru henkilön ${booking.user.name} varaus ${getFormattedTimes([booking.times.start, booking.times.end])}`} arrow><Button size="small" color="secondary" onClick={() => cancelBooking(booking)} >Peruuta varaus</Button></Tooltip>
                                        </span>

                                    }

                                </span>}
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                    <Divider />
                </div>
            ))}
        </div>
    )







    return (
        <div>
            <Typography>Omat varauksesi</Typography>

            {!userData ? <div>{!loading ? <div></div> : <CircularProgress />}</div> : <div>
                <Typography>{userData.name}</Typography>
                <Tabs
                    centered
                    value={value}
                    onChange={handleChange}
                    variant='standard'>
                    <Tab label={'Tulevat'}></Tab>
                    <Tab label={'Menneet'}></Tab>
                    <Tab label={'Perutut'}></Tab>
                </Tabs>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        disabled
                        style={{ marginRight: '5%' }}
                    >
                        <div className={classes.column}>
                            <Typography className={classes.heading}>Palvelu</Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography className={classes.heading}>Päivämäärä</Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography className={classes.heading}>Aika</Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography className={classes.heading}>Tila</Typography>
                        </div>
                    </ExpansionPanelSummary>
                </ExpansionPanel>
                <Divider />
                <div>{getTabContent(value)}</div>
            </div>}

            {!chosenBooking ? <em /> : <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='md' fullWidth>
                <DialogTitle id="form-dialog-title">Vahvista varauksen peruutus</DialogTitle>
                <form onSubmit={confirmCancellation}>
                    <DialogContent>
                        <DialogContentText>
                            Olet perumassa varausta "{chosenBooking.service}"
                            <br />Päivämäärä: {chosenBooking.bookingDate}
                            <br />Kello: {getFormattedTimes([chosenBooking.times.start, chosenBooking.times.end])}
                            <br />Varaaja: {chosenBooking.user.name}

                        </DialogContentText>
                        {validCancelTime(chosenBooking) ?
                            <Typography>Varausta ei voida peruuttaa, sillä peruutusaika ({services.filter(service => service.service === chosenBooking.service)[0].cancelTime}h) on umpeutunut. Ota tarvittaessa yhteyttä toimipisteeseen</Typography>
                            :
                            <div>


                                <TextField
                                    helperText={reason.length === 0 ? "Anna peruutukselle syy" : ""}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    value={reason}
                                    label="Peruutuksen syy"
                                    type="text"
                                    fullWidth
                                    multiline
                                    required
                                    error={reason.length === 0 ? true : false}
                                    onChange={({ target }) => setReason(target.value)}

                                />
                            </div>}
                    </DialogContent>
                    <DialogActions>
                        {success ? <Typography style={{ margin: 'auto' }}>Peruutus onnistui<CheckIcon /></Typography> : <span style={{ margin: 'auto' }}>{loading ? <span><Typography style={{ display: 'inline' }} >Perutaan varausta </Typography><CircularProgress size={25} /></span> : <span>
                            <Button disabled={validCancelTime(chosenBooking)} type="submit" color="primary">
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


export default ProfilePage