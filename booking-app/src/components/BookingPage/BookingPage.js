import React, { useState, useEffect } from 'react'
import 'date-fns'
import { format, getDay, addDays, isBefore } from 'date-fns'
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Button, FormControl, InputLabel, MenuItem, Select, Typography, Paper, CircularProgress, AppBar, Toolbar, Card, CardMedia, CardContent, Divider, capitalize, Tooltip } from '@material-ui/core'
import useStyles from './useStyles'
import { useRouteMatch } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import CallIcon from '@material-ui/icons/Call'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import { Route, Link, useHistory } from 'react-router-dom'

import DateFnsUtils from '@date-io/date-fns'
import { fi } from 'date-fns/locale'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from '../BookingAdminPage/TimeTableServices'
import ProfilePage from './ProfilePage'
import ConfirmationWindow from './ConfirmationWindow'

import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import NavigateBeforeRoundIcon from '@material-ui/icons/NavigateBefore'
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded'

    

const BookingPage = () => {
    const user = auth.currentUser
    const pagematch = useRouteMatch('/:id')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookerObject, setBookerObject] = useState(null)
    const [bookings, setBookings] = useState(null)
    const [chosenService, setChosenService] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [confirmationData, setConfirmationData] = useState({})
    const [value, setValue] = useState(0)
    const classes = useStyles()

    useEffect(() => {
        try {
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc(`baseInformation`).get()
                .then((response) => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    console.log(response.data)
                    setBookerObject(response.data())

                    firestore.collection(`booker${pagematch.params.id}`).doc('bookings').get()
                        .then(res => {
                            if (res.empty) {

                            }
                            setBookings(res.data())

                        })
                    setLoading(false)
                    /*
                    
                    response.forEach(doc => {
                        console.log(doc.data())
                        setBookerObject(doc.data())
                        setLoading(false)
                    })*/
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false)
                    setError(true)
                })



            console.log(bookerObject)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const rgbLabeller = (color) => {
        return `rgb(${color.r},${color.g},${color.b},${color.a})`
    }

    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return BookerHomePage()
            case 1:
                return <ProfilePage site={bookerObject.bookerAddress} bookingsObject={bookings}/>
            default:
                return 'Unknown step';
        }
    }



    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const handleSelectChange = (e) => {
        setChosenService(e.target.value)
        console.log(getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables))
    }

    const getFreeTimes = () => {
        const dailyBookings = bookings[[`${format(selectedDate, `dd:MM:yyyy`)}`]]


        const dayTimes = (getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables))
        const timeSlot = chosenService.timelength.hours + chosenService.timelength.minutes / 60
        var timeObject = []
        for (var x = dayTimes[0]; x < dayTimes[1]; x += timeSlot) {

            const singleTime = {
                start: Number(x.toFixed(2)),
                end: Number((x + timeSlot).toFixed(2)),
                bookedAlready: false
            }

            // PREVENT TOO LATE END TIME
            if (singleTime.end > dayTimes[1]) {
                continue
            }

            // CHECK IF DAILYBOOKINGS EXIST
            for (const b in dailyBookings) {
                if (dailyBookings[b].times.start <= singleTime.start && dailyBookings[b].times.end > singleTime.start) {
                    singleTime.bookedAlready = true
                }
            }
            timeObject.push(singleTime)
        }
        return timeObject
    }

    const popConfirmation = (e) => {
        setConfirmationData(e)
        setConfirmationOpen(true)
    }
    // <Typography className={classes.datePickerTitle}> {capitalize(format(selectedDate, "EEEE", { locale: fi }))} {format(selectedDate, 'MM/dd/yyyy')}</Typography>

    
    const BookerHomePage = () => (
        <div>
            <Card>
                            <CardMedia className={classes.media} image="https://i1.pickpik.com/photos/80/669/198/hill-lane-forest-motorcycle-preview.jpg" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {bookerObject.bookerName} ajanvaraus
                            </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Varaa aikasi täältä
                            </Typography>
                            </CardContent>
                            <Divider />
                            <div className={classes.currentDayTitle}>
                                <Tooltip title={`${capitalize(format(selectedDate, "EEEE", { locale: fi }).substring(0, format(selectedDate, "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -7), 'MM/dd/yyyy')} `}>
                                    <span className={classes.weekBtn}>
                                    <Button disabled={isBefore(addDays(selectedDate, -6), new Date)}  onClick={() => setSelectedDate(addDays(selectedDate, -7))} size='small'><DoubleArrowRoundedIcon style={{ transform: 'rotate(180deg)' }} /></Button>
                                    </span>
                                    </Tooltip>
    
                                <Tooltip title={`${capitalize(format(addDays(selectedDate, -1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, -1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -1), 'MM/dd/yyyy')} `}>
                                    <span className={classes.dayBtn}><Button disabled={isBefore(selectedDate, new Date)}  onClick={() => setSelectedDate(addDays(selectedDate, -1))} size='small'><NavigateBeforeRoundIcon /></Button></span></Tooltip>
    
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fi}>
                                    <KeyboardDatePicker
                                        //disableToolbar
                                        variant="dialog"
                                        cancelLabel="Peru"
                                        format={"EEEE MM/dd/yyyy"}
    
                                        options={{ locale: fi }}
                                        margin="normal"
                                        id="date-picker-inline"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        autoOk
                                        locale={fi}
                                        disablePast
                                        inputProps={{
                                            disabled: true
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
    
                                </MuiPickersUtilsProvider>
    
                                <Tooltip title={`${capitalize(format(addDays(selectedDate, 1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, 1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, 1), 'MM/dd/yyyy')} `}>
                                    <span className={classes.dayBtn}><Button  onClick={() => setSelectedDate(addDays(selectedDate, 1))} size='small'><NavigateNextRoundedIcon /></Button></span></Tooltip>
                                <Tooltip title={`${capitalize(format(selectedDate, "EEEE", { locale: fi }).substring(0, format(selectedDate, "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -7), 'MM/dd/yyyy')} `}>
                                    <span className={classes.weekBtn}><Button  onClick={() => setSelectedDate(addDays(selectedDate, 7))} size='small'><DoubleArrowRoundedIcon /></Button></span></Tooltip>
                            </div>
    
    
                            <Divider />
                        </Card>
                        {getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables)[0] === getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables)[1] ? <div className={classes.closedInfo}><Typography>Suljettu, valitse toinen päivä</Typography></div> : <div>
    
                            <Paper>
                                <Typography>Avoinna: {getSingleDayTimesText(getDay(selectedDate), bookerObject.timeTables)}</Typography>
                                        <div className={classes.selectorLine} >
                                            <div className={classes.selector}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="">
                                                    Palvelu
                                                </InputLabel>
                                                <Select
                                                    value={chosenService}
                                                    label='Palvelu'
                                                    onChange={handleSelectChange}
                                                    className={classes.selectEmpty}
                                                    fullWidth
                                                >
                                                    {bookerObject.services.map(object => (
                                                        <MenuItem key={object.service} value={object}>{object.service}</MenuItem>
                                                    ))}
    
                                                </Select>
                                            </FormControl>
                                            
                                            {!chosenService.service ? <em /> : <div>
                                                {getFreeTimes().length === 0 ? <div>Ei vapaita aikoja</div> : <div>Sopivia aikoja vapaana: {getFreeTimes().length}</div>}
                                            </div>}</div>
                                        {!chosenService.service ? <em /> : <div>
                                            <div key={chosenService.service}>
                                                <div className={classes.singleService} key={chosenService.service}>
                                                    <Typography variant='h5'>{chosenService.service}</Typography>
                                                    <Typography>Kuvaus: {chosenService.description}</Typography>
                                                    <Typography>Hinta: {chosenService.price}€</Typography>
                                                    <Typography>Varauksen kesto: {chosenService.timelength.hours}h {chosenService.timelength.minutes}m</Typography>
                                                </div>
                                            </div>
                                        </div>}
                                        </div>
                                {!chosenService.service ? <em /> : <div>
                                    <br />
                                    <Divider />
                                    {getFreeTimes().length === 0 ? <div>Ei vapaita aikoja</div> :
                                        <div>
                                            {getFreeTimes().map(time => (
                                                <Paper key={time.start}>{getFormattedTimes([time.start, time.end])}<Button disabled={time.bookedAlready} size='small' onClick={() => popConfirmation({ service: chosenService, times: time, date: selectedDate, target: bookerObject.bookerAddress })}>{time.bookedAlready ? <span>VARATTU</span> : <span>Varaa</span>}</Button></Paper>
                                            ))}</div>}
                                </div>}
    
    
                                {confirmationOpen ? <ConfirmationWindow setOpen={setConfirmationOpen} open={confirmationOpen} data={confirmationData} setConfirmationData={setConfirmationData} /> : <em />}
                            </Paper>
                        </div>}
        </div>
    )


    if (bookerObject) {
        document.title = `${bookerObject.bookerName} ajanvaraus`
        return (
            <div >
                <div className={classes.root}>
                    <div >
                        <AppBar  position="static" style={{ backgroundColor: `rgb(${bookerObject.siteSettings.navColor.r},${bookerObject.siteSettings.navColor.g},${bookerObject.siteSettings.navColor.b},${bookerObject.siteSettings.navColor.a})`}}>
                            <Toolbar className={classes.bookingTopbar} variant="dense">
                                <Tabs
                                value={value}
                                onChange={handleChange}
                                TabIndicatorProps={{style: {background:`rgb(${bookerObject.siteSettings.navText2Color.r},${bookerObject.siteSettings.navText2Color.g},${bookerObject.siteSettings.navText2Color.b},${bookerObject.siteSettings.navText2Color.a})`}}}
                                variant='standard'>
                                    <Tab label={<span style={{  color:`rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})`}} className={classes.homeButton} >{bookerObject.bookerName}</span>}></Tab>
                                    <Tab label={!user ? <span style={{  color:`rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})`}}  className={classes.menuButton} color="inherit">Login</span>: <span style={{  color:`rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})`}} onClick={() => setValue(1)} className={classes.menuButton} variant='outlined' color="inherit" >Varaukset</span>}></Tab>
                                </Tabs>
                                    
                                
                            </Toolbar>
                        </AppBar>
                    </div>
                    <div>{getTabContent(value)}</div>
                    

                </div>
                <br/>
                <br/>
                <div className={classes.footer} style={{backgroundColor:`rgb(${bookerObject.siteSettings.footerColor.r},${bookerObject.siteSettings.footerColor.g},${bookerObject.siteSettings.footerColor.b},${bookerObject.siteSettings.footerColor.a})`, borderTopRightRadius:bookerObject.siteSettings.footerBorderRadius, borderTopLeftRadius:bookerObject.siteSettings.footerBorderRadius}}>
                    <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor), fontWeight: 600}}>Yhteystiedot </Typography>
                    <div className={classes.footerContent}>

                        <div className={classes.footerObject} >

                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>{bookerObject.publicInformation.name}</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}><AlternateEmailIcon /> {bookerObject.publicInformation.email}</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}><CallIcon /> {bookerObject.publicInformation.phone}</Typography>

                        </div>
                        <div className={classes.footerObject}>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>{bookerObject.publicInformation.company}</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>JokuRandomOsoite 123</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>02250, Espoo</Typography>
                        </div>
                        <div className={classes.footerObject}>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>Avoinna: </Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>{sameAsBase(bookerObject.timeTables) ? <span>Arkisin: {getFormattedTimes(bookerObject.timeTables.base)}</span> : <span>{getWeekdayTimes(bookerObject.timeTables)}</span>}</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>La: {getFormattedTimes(bookerObject.timeTables.weekEnds.sat)}</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>Su: {getFormattedTimes(bookerObject.timeTables.weekEnds.sun)}</Typography>
                            <Typography style={{color:rgbLabeller(bookerObject.siteSettings.footerTextColor)}}>{}</Typography>
                        </div>
                    </div>
                </div>
            
            </div>
        )
    }


    return (
        <div>
            {loading ? <CircularProgress size={25} /> : <em />}
            {error ? <div>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <em />}
        </div>
    )
}



export default BookingPage