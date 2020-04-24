import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Typography, CircularProgress } from '@material-ui/core';
import { auth, firestore } from '../../firebase'
import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from '../BookingAdminPage/TimeTableServices'
import 'date-fns'
import { format, getDay } from 'date-fns'
import { fi } from 'date-fns/locale'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationWindow = ({ setOpen, open, data, setConfirmationData, target }) => {
    const user = auth.currentUser
    const [loading, setLoading] = useState(false);
    console.log(data)
    console.log(data.target)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const confirmBooking = () => {
        setLoading(true)
        console.log(data)
        

        const bookingObject = {

            bookingDate: format(data.date, `dd/MM/yyyy`),
            whenBooked: format(new Date(), 'dd/MM/yyyy:HH.mm'),
            service: data.service.service,
            user: {
                name: auth.currentUser.displayName,
                email: auth.currentUser.email
            },
            times: data.times
        }
        var dates = []
        dates[`${(format(data.date, `dd:MM:yyyy`))}`] = bookingObject
        console.log(dates)
        console.log(typeof(Object(format(data.date, `dd:MM:yyyy`))))
        console.log(bookingObject.bookingDate)
        try {
            firestore.collection(`booker${data.target}`).doc('bookings').collection(`${format(data.date, `dd:MM:yyyy`)}`).get().then( doc => {
                //console.log(doc)
                if(!doc.empty){
                    console.log('HURRAA ON')
                }else{
                    console.log('EI OO, TEHÄÄN!')
                    firestore.collection(`booker${data.target}`).doc('bookings').collection(`${format(data.date, `dd:MM:yyyy`)}`).doc('active').set({bookings: [bookingObject]}, {merge:true})
                    //firestore.collection(`booker${data.target}`).doc('bookings').set((Object(format(data.date, `dd:MM:yyyy`))))
                    //.collection(bookingObject.bookingDate).doc() firebase.firestore.FieldValue.arrayUnion(serviceObject)}).document().set({bookingObject}, {merge:true})

                }
            })
            console.log(bookingObject)
    
            setLoading(false)
            
        } catch (error) {
            
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
                    {user? 
                        <span>Nimesi: {user.displayName}<br/></span>
                        : <span>Kirjaudu sisään varataksesi<br/></span>}
                    </DialogContentText> 
                    <DialogContentText id="alert-dialog-slide-description">
                        Palvelu: {data.service.service} <br/>
                        {format(data.date, "EEEE : dd.MM.yyyy" , { locale: fi})}<br/>
                        Klo: {getFormattedTimes([data.times.start, data.times.end])}, Kesto: {data.service.timelength.minutes} min<br/>
                        Hinta: {data.service.price}€<br/>

                    </DialogContentText>
                </DialogContent>
                
                    {loading? <div style={{alignSelf:'center', marginBottom:20}}>Varaustasi vahvistetaan<CircularProgress size={25}/> </div>: <div>
                    <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Palaa
          </Button>
                    <Button onClick={confirmBooking} color="primary">
                        Hyväksy
          </Button>
          </DialogActions>
          </div>}
                
            </Dialog>
        </div>
    );
}

export default ConfirmationWindow