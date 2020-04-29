import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Paper, CircularProgress, Typography } from '@material-ui/core';
import {  useRouteMatch } from 'react-router-dom'
import { format, getDay, addDays, isBefore } from 'date-fns'
import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from '../BookingAdminPage/TimeTableServices'


const ProfilePage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [userData, setUserData] = useState(null)
    const user = auth.currentUser

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


    

    return (
        <div>
            <Typography>Omat varauksesi</Typography>
            {!userData? <div>{!loading? <div></div> : <div>LATAA</div>}</div> : <div>
                <Typography>{userData.name}</Typography>
                {userData.bookings.map(singleBooking => (
                    <div style={{border: 'solid 1px'}}>
                    <Typography>Varaus: {singleBooking.service}</Typography>
                <Typography>{singleBooking.bookingDate}, {getFormattedTimes([singleBooking.times.start, singleBooking.times.end])}</Typography>
                {!singleBooking.active? <Typography>Peruttu</Typography> : <Typography>Aktiivinen</Typography>}
                </div>
                ))}
                </div>}
            
        </div>
    )

}


export default ProfilePage