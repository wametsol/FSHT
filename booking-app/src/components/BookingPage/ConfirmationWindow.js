import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Typography, CircularProgress } from '@material-ui/core';
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

const ConfirmationWindow = ({ setOpen, open, data, setConfirmationData, target }) => {
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
            firestore.collection(`booker${data.target}`).doc('bookings').get().then(doc => {
                console.log(!!doc.data()[`${format(data.date, `dd:MM:yyyy`)}`])
                console.log(doc.data()[`${format(data.date, `dd:MM:yyyy`)}`])


                if (!!doc.data()[`${format(data.date, `dd:MM:yyyy`)}`]) {
                    console.log(doc.data())
                    const bookings = doc.data()[`${format(data.date, `dd:MM:yyyy`)}`]
                    console.log('HURRAA ON')
                    console.log(bookings)
                    if ((bookings.filter(booking => booking.times.start === data.times.start && booking.active===true)).length === 0) {

                        firestore.collection(`booker${data.target}`).doc('bookings').update({ [`${format(data.date, `dd:MM:yyyy`)}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) }).then(res => {

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
                            

                        })
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
                    firestore.collection(`booker${data.target}`).doc('bookings').update({ [`${format(data.date, `dd:MM:yyyy`)}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) }).then(res => {
                        firestore.collection('userCollection').doc(user.email).update({ [`bookings.${data.target}`]: firebase.firestore.FieldValue.arrayUnion(bookingObject) })
                                .then((res) => {
                                    console.log(res)
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
                        {format(data.date, "EEEE : dd.MM.yyyy", { locale: fi })}<br />
                        Klo: {getFormattedTimes([data.times.start, data.times.end])}, Kesto: {data.service.timelength.minutes} min<br />
                        Hinta: {data.service.price}€<br />

                    </DialogContentText>
                </DialogContent>

                {error ? <Typography style={{ margin: 'auto' }}>Aika on jo varattu, yritä uudelleen</Typography> : <div style={{ margin: 'auto' }} > {success ? <Typography >Varauksesi onnistui{<CheckIcon />}</Typography> : <div>{loading ? <Typography style={{ margin: 'auto', marginBottom: 20 }}>Varaustasi vahvistetaan<CircularProgress size={25} /> </Typography> : <div>
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