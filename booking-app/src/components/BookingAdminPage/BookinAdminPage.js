import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Paper, CircularProgress, Typography, Tooltip, Button } from '@material-ui/core';
import { useRouteMatch, Link } from 'react-router-dom'

import ServiceTab from './ServiceTab'
import UserTab from './UserTab'
import TimeManagement from './TimeManagement'
import Bookings from './Bookings'
import InfoTab from './InfoTab'
import ContactInfoTab from './ContactInfoTab';

import useStyles from './useStyles'
import Resources from './Resources';

const firebase = require('firebase')
const app = firebase.app()
const functions = app.functions('europe-west3')

const getSubCollections = functions.httpsCallable('getSubCollections')

const BookingAdminPage = ({ setSuccessMessage, setErrorMessage }) => {
    const pagematch = useRouteMatch('/:id')
    const [value, setValue] = useState(0)
    const user = auth.currentUser
    const [bookerObject, setBookerObject] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookings, setBookings] = useState(null)
    const classes = useStyles()
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const fetchData = () => {

        
        firestore.collection(`booker${pagematch.params.id}`).doc(`baseInformation`).get()
            .then((response) => {
                if (response.empty) {
                    setError(true)
                    setLoading(false)
                }
                if(response.data().admins.filter(a => a.email === user.email).length>0 || response.data().bookerCreator === user.email){
                setBookerObject(response.data())
                
                console.log('Getting subs: ', getSubCollections)
                getSubCollections({docPath: `booker${pagematch.params.id}/bookings` })
                .then(result => {
                    console.log(result.data.collections[0])
                    if(result.data.collections.length===0){
                        setBookings(undefined)
                    }else {
                    var collections = {}
                    result.data.collections.map(c => {
                        firestore.collection(`booker${pagematch.params.id}`).doc('bookings').collection(c).get()
                        .then(res => {
                            res.docs.map(doc => {
                                collections = {...collections,
                                    [`${doc.id}`]: doc.data()
                                }
                            })
                            setBookings(collections)
                            console.log(collections)
                            setLoading(false)
                        })
                    })
                }
                setLoading(false)

                })
                

            }

            })
            .catch(error => {
                console.log(error)
                setLoading(false)
                setError(true)
            })
    }
    useEffect(() => {
        try {
            setLoading(true)
            fetchData()
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErrorMessage('Tapahtui odottamaton virhe')
        }
    }, [])


    const updatePublicVisibility = (e) => {
        e.preventDefault()

        try {
            console.log('Asetetaan julkisuus: ', !bookerObject.siteSettings.visibleToPublic)
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ 'siteSettings.visibleToPublic': !bookerObject.siteSettings.visibleToPublic })
                .then((res) => {
                    fetchData()
                    setLoading(false)
                    setSuccessMessage(bookerObject.siteSettings.visibleToPublic ? 'Sivusto piilotettiin asiakkailta' : 'Sivusto julkaistiin asiakkaille')
                })

        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }


    }


    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return <Bookings setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} bookingsObject={bookings} />
            case 1:
                return <ServiceTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 2:
                return <Resources setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 3:
                return <TimeManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 4:
                return <InfoTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 5:
                return <UserTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 6:
                return <ContactInfoTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            default:
                return 'Unknown step';
        }
    }

    return (
        <div>
            {!bookerObject ? <div>
                {loading ? <CircularProgress size={25} /> : <em />}
                {error ? <div>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <div>Sivustoja ei löydy</div>}
            </div>
                : (<Paper>
                    <div className={classes.visibilityBar}>
                        <div className={classes.innerVisibilityBox}>
                            <div className={classes.visibilityButtons}>
                            {bookerObject.siteSettings.visibleToPublic ?
                                <Typography>Sivustosi on julkinen <Tooltip title='Piilottamalla sivuston, vain sinä ja muut adminit voivat nähdä sivuston'><Button onClick={updatePublicVisibility} variant='contained' className={classes.hideVisibilityBtn}>Piilota</Button></Tooltip> </Typography>
                                :
                                <Typography>Sivustosi ei ole julkinen <Tooltip title='Julkaisemalla sivuston, avautuu sivusto kaikille käyttäjille'><Button onClick={updatePublicVisibility} variant='contained' className={classes.publishVisibilityBtn}>Julkaise</Button></Tooltip> </Typography>
                            }
                            </div>
                            <div className={classes.visibilityButtons}>
                            <Typography >Siirry sivustolle<Button variant='contained' className={classes.toSiteButton} component={Link} to={`/${bookerObject.bookerAddress}`}>{bookerObject.bookerName}</Button></Typography>
                            </div>
                        </div>

                    </div>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor='primary'
                        textColor='primary'
                        centered
                    >
                        <Tab label='Varaukset' />
                        <Tab label='Palvelut' />
                        <Tab label='Resurssit' />
                        <Tab label='Ajanhallinta' />
                        <Tab label='Näkymät' />
                        <Tab label='Käyttäjähallinta' />
                        <Tab label='Yhteystiedot' />
                    </Tabs>
                    <div>{getTabContent(value)}</div>

                </Paper>)
            }
        </div>
    )


}


export default BookingAdminPage