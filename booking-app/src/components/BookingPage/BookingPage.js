import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase'
import { Tabs, Tab, Typography, Paper, CircularProgress } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
const BookingPage = () => {
    const pagematch = useRouteMatch('/:id')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookerObject, setBookerObject] = useState(null)

    useEffect(() => {
        try {
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).get()
                .then((response) => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    response.forEach(doc => {
                        console.log(doc.data())
                        setBookerObject(doc.data())
                        setLoading(false)
                    })
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


    if (bookerObject) {
        return (
            <div>
                <Typography>Sivuston nimi: {bookerObject.bookerName}</Typography>

                <Typography>Yhteystiedot:</Typography>
                <Typography>{bookerObject.publicInformation.company}</Typography>
                <Typography>{bookerObject.publicInformation.name}</Typography>
                <Typography>{bookerObject.publicInformation.email}</Typography>
                <Typography>{bookerObject.publicInformation.phone}</Typography>

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