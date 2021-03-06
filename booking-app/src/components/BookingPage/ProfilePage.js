import React, { useState } from 'react'
import 'date-fns'
import { parseISO, isAfter } from 'date-fns'
import { auth, firestore } from '../../firebase'
import { CircularProgress, Divider, capitalize,
    Button, Tooltip, Checkbox, Typography, Paper,
    FormControl, FormControlLabel, FormHelperText,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField,
    Backdrop
} from '@material-ui/core'
import useStyles from './useStyles'
import { valueLabelFormat } from '../BookingAdminPage/TimeTableServices'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import PhoneIcon from '@material-ui/icons/Phone'
import PersonIcon from '@material-ui/icons/Person'
import HelpIcon from '@material-ui/icons/Help'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'


const ProfilePage = ({ userData, fetchUserData, setSuccessMessage, setErrorMessage }) => {
    const user = auth.currentUser
    const [howToContact, setHowToContact] = useState(userData.contactPreferences)
    const [editPreferences, setEditPreferences] = useState(true)
    const [editInformation, setEditInformation] = useState(true)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({ name: userData.name, email: userData.email, phone: userData.phone })

    const classes = useStyles()


    const handleHTCChange = (event) => {
        setHowToContact({ ...howToContact, [event.target.name]: event.target.checked });
    }

    const handlePersonalChange = (event) => {
        setProfile({ ...profile, [event.target.name]: event.target.value });
    }

    const saveProfileEdit = () => {
        try {
            setLoading(true)
            firestore.collection(`userCollection`).doc(user.email).update({ name: profile.name, phone: profile.phone })
                .then(response => {
                    fetchUserData()
                    setLoading(false)
                    setSuccessMessage('Tietojen päivitys onnistui')
                })
        } catch (error) {
            setLoading(false)
            setErrorMessage('Tietojen päivitys epäonnistui')
        }
    }

    const saveContactPreferenceEdit = () => {
        try {
            setLoading(true)
            firestore.collection(`userCollection`).doc(user.email).update({ contactPreferences: howToContact })
                .then(response => {
                    fetchUserData()
                    setLoading(false)
                    setSuccessMessage('Tietojen päivitys onnistui')
                })
        } catch (error) {
            setLoading(false)
            setErrorMessage('Tietojen päivitys epäonnistui')
        }
    }

    return (
        <div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={classes.upperBox}>
                <div className={classes.profileBox}>
                    <Typography style={{ textAlign: 'center' }}>Omat tietosi</Typography>
                    <Divider />
                    {editInformation ? <div className={classes.innerBox}>
                        <Typography style={{ padding: '10px' }}><PersonIcon /> {userData.name}</Typography>
                        <Typography style={{ padding: '10px' }}><AlternateEmailIcon /> {userData.email}</Typography>
                        <Typography style={{ padding: '10px' }}><PhoneIcon /> {userData.phone}</Typography>
                    </div> :
                        <div className={classes.innerBox}>
                            <Grid container alignItems='flex-end'>
                                <Grid item style={{ padding: '0px', paddingLeft: '10px' }}>
                                    <PersonIcon />
                                </Grid>
                                <Grid item style={{ padding: '0px', paddingLeft: '4px' }}>
                                    <TextField value={profile.name} name='name' onChange={handlePersonalChange} label='Nimi'></TextField>
                                </Grid>
                            </Grid>
                            <Grid container alignItems='flex-end'>
                                <Grid item style={{ padding: '0px', paddingLeft: '10px' }}>
                                    <AlternateEmailIcon />
                                </Grid>
                                <Grid item style={{ padding: '0px', paddingLeft: '4px' }}>
                                    <TextField disabled value={profile.email} name='email' onChange={handlePersonalChange} label='Sähköposti'></TextField>
                                </Grid>
                            </Grid>
                            <Grid container alignItems='flex-end'>
                                <Grid item style={{ padding: '0px', paddingLeft: '10px' }}>
                                    <PhoneIcon />
                                </Grid>
                                <Grid item style={{ padding: '0px', paddingLeft: '4px' }}>
                                    <TextField value={profile.phone} name='phone' onChange={handlePersonalChange} label='Puhelin'></TextField>
                                </Grid>
                            </Grid>

                        </div>

                    }
                    <div className={classes.profileButtonBox}>
                    {editInformation ? <Tooltip title='Muokkaa'><Button onClick={() => setEditInformation(false)} className={classes.profileButtons} variant='contained' size='small'><EditIcon /></Button></Tooltip> : <Tooltip title='Peru muutokset'><Button onClick={() => { setEditInformation(true); setProfile({ name: userData.name, email: userData.email, phone: userData.phone }) }} className={classes.profileButtons} variant='contained' size='small'><CloseIcon /></Button></Tooltip>}
                    {(profile.email !== userData.email || profile.phone !== userData.phone || profile.name !== userData.name) ? <Tooltip title='Talleta'><Button onClick={() => { setEditInformation(true); saveProfileEdit() }} className={classes.profileButtons} size='small' variant='contained'><SaveIcon /></Button></Tooltip> :
                        <span> </span>}</div>
                </div>
                <div className={classes.profileBox}>
                    <Typography style={{ textAlign: 'center' }}>Yhteydenottotapa <Tooltip title='Varauksiisi liittyvissä asioissa otetaan yhteyttä valintasi mukaan. Sinun on valittava vähintään yksi yhteydenottotapa'><HelpIcon fontSize='small' /></Tooltip></Typography>
                    <Divider />
                    <div className={classes.innerBox}>
                        <FormControl required error={[howToContact.email, howToContact.phone].filter((v) => v).length === 0} className={classes.FormControl}>

                            <FormControlLabel
                                control={<Checkbox disabled={editPreferences} checked={howToContact.email} onChange={handleHTCChange} name='email' />}
                                label='Sähköposti'
                            />
                            <FormControlLabel
                                control={<Checkbox disabled={editPreferences} checked={howToContact.phone} onChange={handleHTCChange} name='phone' />}
                                label='Puhelin'
                            />
                            {[howToContact.email, howToContact.phone].filter((v) => v).length === 0 ? <FormHelperText style={{ textAlign: 'center' }}>Valitse vähintään yksi</FormHelperText> : <em />}
                        </FormControl>
                    </div>
                    <div className={classes.profileButtonBox}>
                    {editPreferences ? <Tooltip title='Muokkaa'><Button onClick={() => setEditPreferences(false)} className={classes.profileButtons} variant='contained' size='small'><EditIcon /></Button></Tooltip> : <Tooltip title='Peru muutokset'><Button onClick={() => { setEditPreferences(true); setHowToContact(userData.contactPreferences) }} className={classes.profileButtons} variant='contained' size='small'><CloseIcon /></Button></Tooltip>}
                    {(howToContact.email !== userData.contactPreferences.email || howToContact.phone !== userData.contactPreferences.phone) && [howToContact.email, howToContact.phone].filter((v) => v).length !== 0 ? <Tooltip title='Talleta'><Button onClick={() => { setEditPreferences(true); saveContactPreferenceEdit() }} className={classes.profileButtons} size='small' variant='contained'><SaveIcon /></Button></Tooltip> :
                        <span> </span>}</div>

                </div>
            </div>
            <Divider />
            {window.innerWidth > 600 ?
                        <div className={classes.lowerBox}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center' colSpan={5} style={{ fontWeight: 'bold', fontSize: '20px' }} >
                                            Oma historiasi
                                    </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bold' }}>Järjestelmä</TableCell>
                                        <TableCell align='right' style={{ fontWeight: 'bold' }}>Voimassa</TableCell>
                                        <TableCell align='right' style={{ fontWeight: 'bold' }}>Menneet</TableCell>
                                        <TableCell align='right' style={{ fontWeight: 'bold' }}>Peruutukset</TableCell>
                                        <TableCell align='right' style={{ fontWeight: 'bold' }}>Varauksia yhteensä</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {Object.keys(userData.bookings).map((bookingsKey) => (
                                    <TableRow key={bookingsKey}>
                                        <TableCell>{capitalize(bookingsKey)}</TableCell>
                                        <TableCell align='right'>{userData.bookings[`${bookingsKey}`].filter(booking => booking.active && !isAfter(new Date(), new Date(parseISO(`${booking.bookingDate.substring(6, 10)}-${booking.bookingDate.substring(3, 5)}-${booking.bookingDate.substring(0, 2)}T${valueLabelFormat(booking.times.start).substring(0, 2)}:${valueLabelFormat(booking.times.start).substring(3, 5)}`)))).length}</TableCell>
                                        <TableCell align='right'>{userData.bookings[`${bookingsKey}`].filter(booking => booking.active && isAfter(new Date(), new Date(parseISO(`${booking.bookingDate.substring(6, 10)}-${booking.bookingDate.substring(3, 5)}-${booking.bookingDate.substring(0, 2)}T${valueLabelFormat(booking.times.start).substring(0, 2)}:${valueLabelFormat(booking.times.start).substring(3, 5)}`)))).length}</TableCell>
                                        <TableCell align='right'>{userData.bookings[`${bookingsKey}`].filter(booking => !booking.active).length}</TableCell>
                                        <TableCell align='right'>{userData.bookings[`${bookingsKey}`].length}</TableCell>
                                    </TableRow>
        
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                        :
                        <span>
                            
                        </span>}
            

        </div>
    )

}



export default ProfilePage