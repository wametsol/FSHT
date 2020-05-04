import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Paper, CircularProgress } from '@material-ui/core';
import {  useRouteMatch } from 'react-router-dom'

import ServiceTab from './ServiceTab'
import UserTab from './UserTab'
import TimeManagement from './TimeManagement'
import Bookings from './Bookings'
import InfoTab from './InfoTab'
import ContactInfoTab from './ContactInfoTab';



const BookingAdminPage = ({setSuccessMessage, setErrorMessage}) => {
    const pagematch = useRouteMatch('/:id')
    const [value, setValue] = useState(0)
    const user = auth.currentUser
    const [bookerObject, setBookerObject] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookings, setBookings] = useState(null)

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
                setBookerObject(response.data())

                firestore.collection(`booker${pagematch.params.id}`).doc('bookings').get()
                    .then(res => {
                        if(res.empty){
                            
                        }
                        setBookings(res.data())
                    })

                setLoading(false)
                
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
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErrorMessage('Tapahtui odottamaton virhe')
        }
    }, [])


    console.log(bookings)

    const getTabContent = (tab) => {
        switch (tab) {
            case 0:
                return <Bookings setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} bookingsObject={bookings} />
            case 1:
                return <ServiceTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 2:
                return <TimeManagement setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 3:
                return <InfoTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 4:
                return <UserTab setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} bookerObject={bookerObject} fetchData={fetchData} />
            case 5:
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
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor='primary'
                        textColor='primary'
                        centered
                    >
                        <Tab label='Varaukset' />
                        <Tab label='Palvelut' />
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