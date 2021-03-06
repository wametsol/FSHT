import React, { useState, useEffect } from 'react'
import 'date-fns'
import { format, getDay, addDays, isBefore, parseISO, isToday } from 'date-fns'
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Button, FormControl, InputLabel, MenuItem, Select, Typography, Paper, CircularProgress, AppBar, Toolbar, Card, CardMedia, CardContent, Divider, capitalize, Tooltip, Slide, Snackbar, IconButton, Drawer } from '@material-ui/core'
import useStyles from './useStyles'
import { useRouteMatch, Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import CallIcon from '@material-ui/icons/Call'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'

import DateFnsUtils from '@date-io/date-fns'
import { fi } from 'date-fns/locale'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { isClosed, sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText, getFormattedPersonTimes, getDayContent } from '../BookingAdminPage/TimeTableServices'

import UserBookingPage from './UserBookingPage'
import ConfirmationWindow from './ConfirmationWindow'
import ProfilePage from './ProfilePage'

import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded'
import NavigateBeforeRoundIcon from '@material-ui/icons/NavigateBefore'
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import { Alert } from '@material-ui/lab'
import LoginTab from './LoginTab'


const BookingPage = () => {
    const user = auth.currentUser
    const [userData, setUserData] = useState(null)
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
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [chosenWorker, setChosenWorker] = useState(null)




    useEffect(() => {
        try {

            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc(`baseInformation`).get()
                .then((response) => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    setBookerObject(response.data())
                    document.title = `${response.data().bookerName} ajanvaraus`

                    var collections = {}

                    const years = ['2020', '2021']
                    years.map(c => {
                        firestore.collection(`booker${pagematch.params.id}`).doc('bookings').collection(c).get()
                            .then(res => {
                                res.docs.map(doc => {
                                    collections = {
                                        ...collections,
                                        [`${doc.id}`]: doc.data()
                                    }
                                })
                                setBookings(collections)
                                setLoading(false)
                            })
                    })
                    setLoading(false)
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
    useEffect(() => {

        fetchUserData()
    }, [user])

    const fetchUserData = () => {
        try {
            setLoading(true)
            firestore.collection('userCollection').doc(`${user.email}`).get()
                .then(response => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    setUserData(response.data())
                    setLoading(false)
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
    }

    const handleSuccess = () => {
        setChosenWorker(null)
        setChosenService('')
        successMessageSetter('Varauksesi on onnistunut')
    }


    const signOut = (e) => {
        e.preventDefault()
        try {
            auth.signOut()
                .then((res) => {
                    setValue(0)
                    fetchUserData()
                })
        } catch (error) {
            console.log(error)
        }
    }

    const notification = () => (
        <div>
            <Snackbar
                open={successMessage !== null}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity='success'>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={errorMessage !== null}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity='error'>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    )

    const successMessageSetter = (message) => {
        setSuccessMessage(message)
        setTimeout(() => {
            setSuccessMessage(null)
        }, 5000);
    }
    const errorMessageSetter = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 5000);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const rgbLabeller = (color) => {
        return `rgb(${color.r},${color.g},${color.b},${color.a})`
    }
    const handleMenu = () => {
        setMobileMenuOpen(true)
    }
    const handleMenuClose = () => {
        setMobileMenuOpen(false)
    }

    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return BookerHomePage()
            case 1:
                return !!user ? <UserBookingPage site={bookerObject.bookerAddress} fetchUserData={fetchUserData} bookingsObject={bookings} services={bookerObject.services} userData={userData} /> : <LoginTab fetchUserData={fetchUserData} setSuccessMessage={successMessageSetter} setErrorMessage={errorMessageSetter} setValue={setValue} />
            case 2:
                return <ProfilePage userData={userData} fetchUserData={fetchUserData} setSuccessMessage={successMessageSetter} setErrorMessage={errorMessageSetter} />
            default:
                return 'Unknown step';
        }
    }



    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const handleSelectChange = (e) => {
        setChosenService(e.target.value)
        setChosenWorker(null)
    }
    const dayHasSpecialTimes = () => {
        if (!bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]]) {
            return false
        } else {
            return true
        }
    }


    const getFreeTimes = () => {
        const dailyBookings = Boolean(bookings[[`${format(selectedDate, `dd:MM:yyyy`)}`]]) ? bookings[[`${format(selectedDate, `dd:MM:yyyy`)}`]].bookings : []

        var dayTimes
        // CHECK IF DAY IS IN SPECIAL DAYS
        if (dayHasSpecialTimes()) {
            dayTimes = bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]].times
        } else {
            dayTimes = (getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables))
        }

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
            // PREVENT BOOKINGS IF TIME HAS PASSED OR IS TOO CLOSE
            const currentHH = Number(format(new Date(), 'HH'))
            const currentMM = Number(format(new Date(), 'mm'))
            if (isToday(selectedDate) && singleTime.start < currentHH + (currentMM / 60)) {
                continue

            }

            // CHECK IF DAILYBOOKINGS EXIST
            for (const b in dailyBookings) {
                if (dailyBookings[b].active === true && ((!!chosenWorker && !chosenWorker.human && !bookerObject.resources[`${dailyBookings[b].worker}`].human && dailyBookings[b].deviceID === chosenWorker.deviceID) || (!!chosenWorker && chosenWorker.human && dailyBookings[b].worker === chosenWorker.name)) && (dailyBookings[b].times.start <= singleTime.start && dailyBookings[b].times.end >= singleTime.end || dailyBookings[b].times.start < singleTime.end && dailyBookings[b].times.start >= singleTime.start || dailyBookings[b].times.start < singleTime.start && dailyBookings[b].times.end > singleTime.start)) {
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
    const incomingSpecialTimes = () => {

        var specialTimes = []

        Object.keys(bookerObject.specialDays).map(key => {
            const specDate = bookerObject.specialDays[key].date
            if (isBefore(addDays(selectedDate, -1), parseISO(`${specDate.substring(6, 10)}-${specDate.substring(3, 5)}-${specDate.substring(0, 2)}`))) {
                specialTimes.push(bookerObject.specialDays[key])
            }
        })



        if (specialTimes.length === 0) {
            return (
                <div >
                    <Typography gutterBottom variant="h5" component="h2">
                        {bookerObject.bookerName} ajanvaraus
                            </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Varaa aikasi täältä
                            </Typography>
                </div>
            )
        }
        specialTimes.sort((a, b) => parseISO(`${a.date.substring(6, 10)}-${a.date.substring(3, 5)}-${a.date.substring(0, 2)}`) - parseISO(`${b.date.substring(6, 10)}-${b.date.substring(3, 5)}-${b.date.substring(0, 2)}`))
        return (
            <div className={classes.cardTitleBox}>

                <div className={classes.titleBox}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {bookerObject.bookerName} ajanvaraus
                            </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Varaa aikasi täältä
                            </Typography>
                </div>
                <div>
                    <Typography>Lähestyvät poikkeusaikataulut: </Typography>
                    {specialTimes.map(time => (
                        <div key={time.reason+''+time.date} className={classes.specialTimeBox}>
                            <Typography>{time.reason}, {time.date} : <span style={{ fontWeight: 600 }}>{getFormattedTimes(time.times)}</span></Typography>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const prevDayButtons = () => (
        <span><Tooltip title={`${capitalize(format(selectedDate, "EEEE", { locale: fi }).substring(0, format(selectedDate, "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -7), 'dd/MM/yyyy')} `}>
            <span className={classes.weekBtn}>
                <Button disabled={isBefore(addDays(selectedDate, -6), new Date())} onClick={() => setSelectedDate(addDays(selectedDate, -7))} size='small'><DoubleArrowRoundedIcon style={{ transform: 'rotate(180deg)' }} /></Button>
            </span>
        </Tooltip>

            <Tooltip title={`${capitalize(format(addDays(selectedDate, -1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, -1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -1), 'dd/MM/yyyy')} `}>
                <span className={classes.dayBtn}><Button disabled={isBefore(selectedDate, new Date())} onClick={() => setSelectedDate(addDays(selectedDate, -1))} size='small'><NavigateBeforeRoundIcon /></Button></span></Tooltip></span>
    )
    const nextDayButtons = () => (
        <span>
            <Tooltip title={`${capitalize(format(addDays(selectedDate, 1), "EEEE", { locale: fi }).substring(0, format(addDays(selectedDate, 1), "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, 1), 'dd/MM/yyyy')} `}>
                <span className={classes.dayBtn}><Button onClick={() => setSelectedDate(addDays(selectedDate, 1))} size='small'><NavigateNextRoundedIcon /></Button></span></Tooltip>
            <Tooltip title={`${capitalize(format(selectedDate, "EEEE", { locale: fi }).substring(0, format(selectedDate, "EEEE", { locale: fi }).length - 2))} ${format(addDays(selectedDate, -7), 'dd/MM/yyyy')} `}>
                <span className={classes.weekBtn}><Button onClick={() => setSelectedDate(addDays(selectedDate, 7))} size='small'><DoubleArrowRoundedIcon /></Button></span></Tooltip></span>
    )
    const daySelector = () => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fi}>
            <KeyboardDatePicker
                //disableToolbar
                variant="dialog"
                cancelLabel="Peru"
                format={"EEEE dd.MM.yyyy"}

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
    )

    const getHumanResources = () => {
        var humanResources = []
        Object.keys(bookerObject.resources).map(key => {
            if (bookerObject.resources[key].human) {
                humanResources.push(bookerObject.resources[key])
            }
        })

        return humanResources
    }
    const getNonHumanResources = () => {
        var nonHumanResources = []
        Object.keys(bookerObject.resources).map(key => {
            if (!bookerObject.resources[key].human) {
                var i = 0
                while (i < bookerObject.resources[key].amountOfResources) {
                    nonHumanResources.push({
                        ...bookerObject.resources[key],
                        deviceID: i + 1
                    })
                    i += 1
                }

            }
        })

        return nonHumanResources
    }

    const getMaxWorktimes = (person) => {
        var maxWorktimes = Object.assign([], !!person.specialDays && !!person.specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`] ? person.specialDays[`${format(selectedDate, 'dd:MM:yyyy')}`].times : getDayContent(getDay(selectedDate), person.timeTables))
        if (maxWorktimes[0] === maxWorktimes[1]) {
            return maxWorktimes
        }
        var openinHours = dayHasSpecialTimes() ? bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]].times : getDayContent(getDay(selectedDate), bookerObject.timeTables)

        if (maxWorktimes[0] < openinHours[0]) {
            maxWorktimes[0] = openinHours[0]
        }
        if (maxWorktimes[1] > openinHours[1]) {
            maxWorktimes[1] = openinHours[1]
        }
        return maxWorktimes
    }

    const workerHasShift = (day, worker) => {
        var workerDayTimes = !!worker.specialDays && !!worker.specialDays[`${format(day, 'dd:MM:yyyy')}`] ? worker.specialDays[`${format(day, 'dd:MM:yyyy')}`].times : getDayContent(getDay(day), worker.timeTables)
        if (workerDayTimes[0] !== workerDayTimes[1]) {
            return true
        }


        return false
    }


    const BookerHomePage = () => (
        <div>
            <Card>
                <CardMedia className={classes.media} image={bookerObject.images.background} />
                <CardContent>

                    {incomingSpecialTimes()}

                </CardContent>
                <Divider />

                <div className={classes.currentDayTitle}>
                    {window.innerWidth > 600 ?
                        <span>
                            {prevDayButtons()}
                            {daySelector()}
                            {nextDayButtons()}
                        </span>
                        :
                        <span>
                            {daySelector()}
                            <br />
                            {prevDayButtons()}
                            {nextDayButtons()}
                        </span>}

                </div>


                <Divider />
            </Card>
            {dayHasSpecialTimes() ? <div className={classes.specialInfo}><Typography>{bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]].reason}, käytössä poikkeusaikataulu</Typography> </div> : <em />}
            {(getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables)[0] === getSingleDayTimes(getDay(selectedDate), bookerObject.timeTables)[1]) || (dayHasSpecialTimes() && (bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]].times[0] === bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]].times[1])) ? <div className={classes.closedInfo}><Typography>Suljettu, valitse toinen päivä</Typography></div> : <div>

                <Paper>
                    <Typography>Avoinna: <span style={{ fontWeight: 600 }}>{dayHasSpecialTimes() ? getFormattedTimes(bookerObject.specialDays[[`${format(selectedDate, `dd:MM:yyyy`)}`]].times) : getSingleDayTimesText(getDay(selectedDate), bookerObject.timeTables)}</span></Typography>
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
                                {getFreeTimes().length === 0 || chosenService.type === 'human' && getHumanResources().filter(r => r.services.filter(a => a === chosenService.service).length > 0 && workerHasShift(selectedDate, r)).length === 0 ? <div><Typography variant='caption'>Ei vapaita aikoja tälle päivälle</Typography><br />
                                    {prevDayButtons()}{nextDayButtons()}</div> : <div><Typography variant='caption'>Sopivia aikoja vapaana: {getFreeTimes().length}</Typography><br />
                                        {prevDayButtons()}{nextDayButtons()}</div>}
                            </div>}</div>
                        {!chosenService.service ? <em /> : <div>
                            <div key={chosenService.service} className={classes.singleServiceBox}>
                                <div className={classes.singleService} key={chosenService.service}>
                                    <Typography variant='h5'>{chosenService.service}</Typography>
                                    <Typography>Kuvaus: {chosenService.description}</Typography>
                                    <Typography>{chosenService.price !== 0 ? <span>Hinta: {chosenService.price}€</span> : <span>Varaus on maksuton</span>}</Typography>
                                    <Typography>Varauksen kesto: {chosenService.timelength.hours !== 0 ? <span>{chosenService.timelength.hours}h</span> : <em />} {chosenService.timelength.minutes !== 0 ? <span>{chosenService.timelength.minutes}min</span> : <em />}</Typography>
                                </div>
                            </div>

                        </div>}
                    </div>

                    {!!chosenService.service && chosenService.type === 'human' && getFreeTimes().length !== 0 ?

                        <div className={classes.freeTimesBox}>
                            {getFreeTimes().length === 0 || getHumanResources().filter(r => r.services.filter(a => a === chosenService.service).length > 0 && workerHasShift(selectedDate, r)).length === 0 ? <em /> :
                                <Typography>Valitse työntekijä</Typography>}
                            <div className={classes.workerBox} >


                                {getHumanResources().filter(r => r.services.filter(a => a === chosenService.service).length > 0 && workerHasShift(selectedDate, r)).map(person => (
                                    <div key={person.name} className={classes.singleWorker} onClick={() => setChosenWorker(person)} style={!!chosenWorker && chosenWorker.name === person.name ? { backgroundColor: 'lightgreen' } : {}}>

                                        <Typography>{person.name}</Typography>
                                        <Typography variant='caption'>{getFormattedPersonTimes(getMaxWorktimes(person))}</Typography>
                                    </div>
                                ))}</div>
                            <Divider />
                            {!!chosenWorker ? <div>
                                {getFreeTimes().length === 0 ? <div>Ei vapaita aikoja</div> :
                                    <div>
                                        {getFreeTimes().map(time => (
                                            <Paper key={time.start}>{getFormattedTimes([time.start, time.end])}<Button disabled={time.bookedAlready} size='small' onClick={() => popConfirmation({ service: chosenService, times: time, date: selectedDate, target: bookerObject.bookerAddress, worker: chosenWorker })}>{time.bookedAlready ? <span>VARATTU</span> : <span>Varaa</span>}</Button></Paper>
                                        ))}</div>}</div> : <em />}
                        </div>

                        : <em />}
                    {!!chosenService.service && chosenService.type === 'device' && getFreeTimes().length !== 0 ?
                        <div className={classes.freeTimesBox}>
                            <Typography>Valitse laite</Typography>
                            <div className={classes.workerBox} >


                                {getNonHumanResources().filter(r => r.services.filter(a => a === chosenService.service).length > 0).map(resource => (
                                    <div key={resource.name + resource.deviceID} className={classes.singleWorker} onClick={() => setChosenWorker(resource)} style={!!chosenWorker && chosenWorker.name === resource.name && chosenWorker.deviceID === resource.deviceID ? { backgroundColor: 'lightgreen' } : {}}>

                                        <Typography>{resource.name} {resource.deviceID}</Typography>
                                        <Typography variant='caption'></Typography>
                                    </div>
                                ))}</div>
                            <Divider />
                            {!!chosenWorker ? <div>
                                {getFreeTimes().length === 0 ? <div>
                                    <Typography>Ei vapaita aikoja tälle päivälle</Typography>
                                    <Button>Edellinen päivä</Button><Button>Seuraava päivä</Button>

                                </div> :
                                    <div>
                                        {getFreeTimes().map(time => (
                                            <Paper key={time.start}>{getFormattedTimes([time.start, time.end])}<Button disabled={time.bookedAlready} size='small' onClick={() => popConfirmation({ service: chosenService, times: time, date: selectedDate, target: bookerObject.bookerAddress, worker: chosenWorker })}>{time.bookedAlready ? <span>VARATTU</span> : <span>Varaa</span>}</Button></Paper>
                                        ))}</div>}</div> : <em />}
                        </div> : <em />}



                    {confirmationOpen ? <ConfirmationWindow setOpen={setConfirmationOpen} open={confirmationOpen} data={confirmationData} setConfirmationData={setConfirmationData} fetchUserData={fetchUserData} handleSuccess={handleSuccess} /> : <em />}
                </Paper>
            </div>}
        </div>
    )





    return (
        <div className={classes.root}>
            {(bookerObject && (bookerObject.siteSettings.visibleToPublic || (!!user && Object.keys(bookerObject.admins).filter(a => bookerObject.admins[a].email === user.email).length > 0))) ?
                <div>

            {(!bookerObject.siteSettings.visibleToPublic) ? <div className={classes.notPublicInfo}><Typography variant='h6'>Sivusto ei näy julkisesti, se näkyy vain sivuston ylläpitäjille. Varauksia ei voida tehdä. Voit julkaista sivuston hallintapaneelista.  {!!bookerObject? <Link to={`/${bookerObject.bookerAddress}/admin`} >Hallintapaneeliin</Link>: 'Hallintapaneeli löytyy osoitteesta: www.ajanvaraus.web.app/omasivu/admin'}</Typography></div> : <em />}
                    {notification()}
                    <div >
                        <div >

                            <AppBar position="static" style={{ backgroundColor: `rgb(${bookerObject.siteSettings.navColor.r},${bookerObject.siteSettings.navColor.g},${bookerObject.siteSettings.navColor.b},${bookerObject.siteSettings.navColor.a})` }}>

                                {window.innerWidth > 600 ?
                                    <Toolbar className={classes.bookingTopbar} variant="dense">
                                        <span style={{ display: 'contents' }}>
                                            <Tabs
                                                value={value}
                                                onChange={handleChange}
                                                TabIndicatorProps={{ style: { background: `rgb(${bookerObject.siteSettings.navText2Color.r},${bookerObject.siteSettings.navText2Color.g},${bookerObject.siteSettings.navText2Color.b},${bookerObject.siteSettings.navText2Color.a})` } }}
                                                variant='standard'>
                                                <Tab label={<span style={{ color: `rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})` }} className={classes.homeButton} >{bookerObject.bookerName}</span>}></Tab>
                                                {!user ?
                                                    <Tab label={<span style={{ color: `rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})` }} onClick={() => setValue(1)} className={classes.menuButton} color="inherit">Kirjaudu</span>} />
                                                    :
                                                    <Tab label={<span style={{ color: `rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})` }} onClick={() => setValue(1)} className={classes.menuButton} variant='outlined' color="inherit" >Varaukset</span>} />}
                                                {!user ? <em />
                                                    :
                                                    <Tab label={<span style={{ color: `rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})` }} onClick={() => setValue(2)} className={classes.menuButton} variant='outlined' color="inherit" >Profiili</span>}></Tab>}
                                            </Tabs>
                                            {!user ? <em />
                                                :
                                                <Button variant='outlined' onClick={signOut}>Logout</Button>}


                                        </span></Toolbar>
                                    :
                                    <Toolbar className={classes.bookingTopbar} variant="dense">
                                        <Button onClick={() => setValue(0)}>
                                            <span style={{ color: `rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})` }} className={classes.homeButton} >{bookerObject.bookerName}</span>
                                        </Button>
                                        <IconButton
                                            edge='start'
                                            onClick={handleMenu}
                                            style={{ color: `rgb(${bookerObject.siteSettings.navTextColor.r},${bookerObject.siteSettings.navTextColor.g},${bookerObject.siteSettings.navTextColor.b},${bookerObject.siteSettings.navTextColor.a})` }} className={classes.homeButton} >
                                            <MenuIcon />
                                        </IconButton>
                                        <Drawer
                                            anchor='top'
                                            variant='temporary'
                                            open={mobileMenuOpen}
                                            onClose={handleMenuClose}>
                                            <IconButton style={{ padding: 0 }} onClick={() => handleMenuClose()}><KeyboardArrowUpIcon /></IconButton>
                                            <Button onClick={() => {
                                                setValue(0)
                                                handleMenuClose()
                                            }}>Etusivu</Button>
                                            <Button onClick={() => {
                                                setValue(1)
                                                handleMenuClose()
                                            }}>Varaukset</Button>
                                            <Button onClick={() => {
                                                setValue(2)
                                                handleMenuClose()
                                            }}>Profiili</Button>
                                        </Drawer>
                                    </Toolbar>}
                            </AppBar>

                        </div>
                        <div>{getTabContent(value)}</div>


                    </div>
                    <br />
                    <br />
                    {bookerObject.siteSettings.footerOn ? <span>
                        <div className={classes.footer} style={{ backgroundColor: `rgb(${bookerObject.siteSettings.footerColor.r},${bookerObject.siteSettings.footerColor.g},${bookerObject.siteSettings.footerColor.b},${bookerObject.siteSettings.footerColor.a})`, borderTopRightRadius: bookerObject.siteSettings.footerBorderRadius, borderTopLeftRadius: bookerObject.siteSettings.footerBorderRadius }}>
                            <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor), fontWeight: 600 }}>Yhteystiedot </Typography>
                            <div className={classes.footerContent}>

                                <div className={classes.footerObject} >

                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>{bookerObject.publicInformation.name}</Typography>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}><AlternateEmailIcon /> {bookerObject.publicInformation.email}</Typography>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}><CallIcon /> {bookerObject.publicInformation.phone}</Typography>

                                </div>
                                <div className={classes.footerObject}>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>{bookerObject.publicInformation.company}</Typography>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>Y-tunnus:{bookerObject.publicInformation.companyID}</Typography>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>{bookerObject.publicInformation.address}</Typography>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>{bookerObject.publicInformation.postnumber}, {bookerObject.publicInformation.city}</Typography>
                                </div>
                                <div className={classes.footerObject}>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>Avoinna: </Typography>
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>{sameAsBase(bookerObject.timeTables) ? <span>Arkisin: {getFormattedTimes(bookerObject.timeTables.base)}</span> : <span>{getWeekdayTimes(bookerObject.timeTables)}</span>}</Typography>
                                    {isClosed(bookerObject.timeTables.weekEnds.sat) && isClosed(bookerObject.timeTables.weekEnds.sun) ? <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }} >Viikonloppuisin: suljettu</Typography> : <div>
                                        <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>La: {getFormattedTimes(bookerObject.timeTables.weekEnds.sat)}</Typography>
                                        <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>Su: {getFormattedTimes(bookerObject.timeTables.weekEnds.sun)}</Typography>
                                    </div>}
                                    <Typography style={{ color: rgbLabeller(bookerObject.siteSettings.footerTextColor) }}>{}</Typography>
                                </div>
                            </div>
                        </div>
                    </span> : <em />}

                </div>
                :
                <div>
                    {loading ? <CircularProgress size={25} /> : <div>
                        <Typography>
                            Sivuston osoite on virheellinen, tai sivuston ylläpitäjä on asettanut sivuston piilotetuksi</Typography></div>}
                    {error ? <div>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <em />}
                </div>}
        </div>
    )
}




export default BookingPage