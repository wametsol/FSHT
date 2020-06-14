import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Typography, CircularProgress, capitalize } from '@material-ui/core';
import firebase, { auth, firestore } from '../../firebase'
import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from '../BookingAdminPage/TimeTableServices'
import 'date-fns'
import { format, getDay } from 'date-fns'
import { fi } from 'date-fns/locale'
import { v1 as uuid } from 'uuid'

import CheckIcon from '@material-ui/icons/Check'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationWindow = ({ setOpen, open, data, setConfirmationData, target, fetchUserData, handleSuccess }) => {
    const user = auth.currentUser
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const confirmBooking = () => {

        console.log(data)
        const bookingObject = {
            id: uuid(),
            bookingDate: format(data.date, `dd/MM/yyyy`),
            whenBooked: format(new Date(), 'dd/MM/yyyy:HH.mm'),
            service: data.service.service,
            worker: data.worker.name,
            deviceID: !!data.worker.deviceID? data.worker.deviceID : 0,
            user: {
                name: auth.currentUser.displayName,
                email: auth.currentUser.email,
                uid: auth.currentUser.uid
            },
            times: {
                start: data.times.start,
                end: data.times.end
            },
            active: true

        }


        try {
            setLoading(true)
            firestore.collection(`booker${data.target}`).doc('bookings').collection(`${format(data.date, `yyyy`)}`).get().then(col => {
                //console.log(!!doc.data()[`${format(data.date, `dd:MM:yyyy`)}`])
                //console.log(doc.data()[`${format(data.date, `dd:MM:yyyy`)}`])


                if (col.docs.length > 0 && col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`)).length > 0) {
                    console.log(data)
                    //console.log(col.docs.filter(d => d.id === format(data.date, `MM`))[0].data()[`${format(data.date, `dd:MM:yyyy`)}`].filter(b => b.worker === data.worker.name))
                    console.log((col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`))[0]))
                    //console.log(Object.keys(col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`))[0].data().bookings).map(k => col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`))[0].data().bookings[k]))
                    if (!(col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`))[0].data().bookings) ||
                     (Object.keys(col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`))[0].data().bookings).map(k => col.docs.filter(d => d.id === format(data.date, `dd:MM:yyyy`))[0].data().bookings[k]).filter(booking => booking.times.start === data.times.start 
                        && booking.active===true && booking.worker === data.worker.name && booking.deviceID === data.worker.deviceID )).length === 0) {

                            firestore.collection(`booker${data.target}`).doc('bookings').collection(`${format(data.date, `yyyy`)}`).doc(`${format(data.date, `dd:MM:yyyy`)}`).set({bookings:{[bookingObject.id]:  bookingObject }}, {merge: true}).then(res => {
                                firestore.collection('userCollection').doc(user.email).update({ [`bookings.${data.target}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) })
                                    .then((res) => {
                                        setSuccess(true)
                                        setLoading(false)
                                        setTimeout(() => {
                                            handleSuccess()
                                            fetchUserData()
                                            setSuccess(false)
                                            setOpen(false)
                                        }, 2000);
                                        console.log(res)
                                    })
                            })
                        
                    //const existingBookings = col.docs.map(d => console.log(d.data())[`${format(data.date, `dd:MM:yyyy`)}`])
                    //.data()[`${format(data.date, `dd:MM:yyyy`)}`]
                    
                    
                    
                        /*

                        firestore.collection(`booker${data.target}`).doc('bookings').update({ [`${format(data.date, `dd:MM:yyyy`)}.${bookingObject.id}`]: bookingObject }).then(res => {

                            firestore.collection('userCollection').doc(user.email).update({ [`bookings.${data.target}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) })
                                .then((res) => {
                                    setSuccess(true)
                            setLoading(false)
                            setTimeout(() => {
                                setSuccess(false)
                                setOpen(false)
                            }, 2000);
                                    console.log(res)
                                })
                            console.log(res)
                            

                        })*/


                        
                    } else {
                        console.log('AIKA ON JO VARATTU')
                        setError(true)
                        setLoading(false)
                        setTimeout(() => {
                            setError(false)
                            setOpen(false)
                        }, 2000);

                    }


                } else {
                    console.log('EI OO, TEHÄÄN!')
                    firestore.collection(`booker${data.target}`).doc('bookings').collection(`${format(data.date, `yyyy`)}`).doc(`${format(data.date, `dd:MM:yyyy`)}`).set({bookings: { [bookingObject.id]:  bookingObject }}, {merge: true}).then(res => {
                        firestore.collection('userCollection').doc(user.email).update({ [`bookings.${data.target}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) })
                            .then((res) => {
                                handleSuccess()
                                fetchUserData()
                                setSuccess(true)
                                setLoading(false)
                                setTimeout(() => {
                                    setSuccess(false)
                                    setOpen(false)
                                }, 2000);
                            })
                        console.log(`Added document at '${res}'`);


                    })
                }
            })
            console.log(bookingObject)



        } catch (error) {
            setLoading(false)
        }

    }

    const handleClose = () => {
        setConfirmationData({})
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Vahvista varauksesi"}</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        {user ?
                            <span>Nimesi: {user.displayName}<br /></span>
                            : <span>Kirjaudu sisään varataksesi<br /></span>}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-slide-description">
                        Palvelu: {data.service.service} <br />
                        {data.worker.deviceID === 0? `Työntekijä: ${data.worker.name}` : `Resurssi: ${data.worker.name} ${data.worker.deviceID}`} <br />
                        <br />
                        Ajankohta<br />
                        {capitalize(format(data.date, "EEEE : dd.MM.yyyy", { locale: fi }))}<br />
                        Klo: {getFormattedTimes([data.times.start, data.times.end])}<br/>
                        Varauksen kesto: {data.service.timelength.hours !== 0 ? <span>{data.service.timelength.hours}h</span> : <em />} {data.service.timelength.minutes !== 0 ? <span>{data.service.timelength.minutes}min</span> : <em />}<br />
                        <br />
                        {data.service.price > 0? `Hinta: ${data.service.price}€`: `Palvelu on ilmainen`}<br />

                    </DialogContentText>

                    
                </DialogContent>

                {error ? <Typography style={{ margin: 'auto' }}>Aika on jo varattu, yritä uudelleen</Typography> : <div style={{ margin: 'auto' }} > {success ? <Typography >Varauksesi onnistui{<CheckIcon />}</Typography> : <div>{loading ? <div style={{ margin: 'auto', marginBottom: 20}}><Typography style={{display: 'inline'}} >Varaustasi vahvistetaan</Typography><CircularProgress size={25} /></div> : <div>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Palaa
          </Button>
                        <Button onClick={confirmBooking} color="primary">
                            Hyväksy
          </Button>
                    </DialogActions>
                </div>}</div>} </div>}

            </Dialog>
        </div>
    );
}

export default ConfirmationWindow