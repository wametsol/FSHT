import React, { useState } from 'react';
import { ChromePicker } from 'react-color'
import firebase, { firestore } from '../../firebase'
import { Typography, CircularProgress, TextField, InputAdornment, Toolbar, Tabs, Tab, Button, Slider, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CallIcon from '@material-ui/icons/Call'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import PhoneIcon from '@material-ui/icons/Phone';
import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from './TimeTableServices'



const ContactInfoTab = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [edit, setEdit] = useState(false)

    const [systName, setSystName] = React.useState(bookerObject.bookerName)
    const [webAddress, setWebAddress] = React.useState('')

    const [publicName, setPublicName] = React.useState(bookerObject.publicInformation.name)
    const [publicCompany, setPublicCompany] = React.useState(bookerObject.publicInformation.company)
    const [publicEmail, setPublicEmail] = React.useState(bookerObject.publicInformation.email)
    const [publicPhone, setPublicPhone] = React.useState(bookerObject.publicInformation.phone)
    const [publicCompanyID, setPublicCompanyID] = React.useState(bookerObject.publicInformation.companyID)
    const [publicAddress, setPublicyAddress] = React.useState(bookerObject.publicInformation.address)
    const [publicPostNumber, setPublicPostNumber] = React.useState(bookerObject.publicInformation.postnumber)
    const [publicCity, setPublicCity] = React.useState(bookerObject.publicInformation.city)


    const resetChanges = (e) => {
        e.preventDefault()
        setEdit(!edit)
        setSystName(bookerObject.bookerName)
        setPublicName(bookerObject.publicInformation.name)
        setPublicCompany(bookerObject.publicInformation.company)
        setPublicEmail(bookerObject.publicInformation.email)
        setPublicPhone(bookerObject.publicInformation.phone)
        setPublicCompanyID(bookerObject.publicInformation.companyID)
        setPublicyAddress(bookerObject.publicInformation.address)
        setPublicPostNumber(bookerObject.publicInformation.postnumber)
        setPublicCity(bookerObject.publicInformation.city)
    }

    const acceptChanges = (e) => {
        e.preventDefault()
        try {
            setEdit(!edit)
            setLoading(true)
            let newInfo = { ...bookerObject.publicInformation }
            newInfo.name = publicName
            newInfo.company = publicCompany
            newInfo.email = publicEmail
            newInfo.phone = publicPhone
            newInfo.address = publicAddress
            newInfo.postnumber = publicPostNumber
            newInfo.city = publicCity
            newInfo.companyID = publicCompanyID
            
            firestore.collection(`booker${bookerObject.bookerAddress}`).doc('baseInformation').update({ publicInformation: newInfo})
                .then((res) => {
                    fetchData()
                    setLoading(false)
                    setSuccessMessage(`Tietojen päivitys onnistui`)
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErrorMessage('Tapahtui odottamaton virhe')
        }
    }

    return (
        <div>


            <div>
                <Typography variant='h4'>Yhteystiedot asiakkaille </Typography>
                

                
                {edit ? <div>
                    <div>
                    <Typography variant='h5'>Järjestelmäsi </Typography>
                    <TextField disabled className={classes.basicText} id="systemName" value={systName} label="Nimi" variant="outlined" onChange={({ target }) => setSystName(target.value)} />
                </div>
                <br />
                    <Typography variant='h5'>Yhteystiedot</Typography>
                    <TextField className={classes.basicText} id="contactName" value={publicName} label="Nimi" variant="outlined" onChange={({ target }) => setPublicName(target.value)} />


                    <TextField InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AlternateEmailIcon />
                            </InputAdornment>
                        ),
                    }} className={classes.basicText} id="bookerEmail" value={publicEmail} label="Sähköposti" variant="outlined" onChange={({ target }) => setPublicEmail(target.value)} />

                    <TextField InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PhoneIcon />
                            </InputAdornment>
                        ),
                    }} className={classes.basicText} id="bookerPhone" value={publicPhone} label="Puhelinnumero" variant="outlined" onChange={({ target }) => setPublicPhone(target.value)} />

                    <br />
                    <Typography variant='h5'>Yrityksen tiedot</Typography>
                    <TextField className={classes.basicText} value={publicCompany} id="contactCompany" label="Yritys" variant="outlined" onChange={({ target }) => setPublicCompany(target.value)} />
                    <TextField className={classes.basicText} value={publicCompanyID} id="contactCompanyID" label="Y-tunnus" variant="outlined" onChange={({ target }) => setPublicCompanyID(target.value)} />
                    <br/>
                    <TextField className={classes.basicText} value={publicAddress} id="contactAddress" label="Osoite" variant="outlined" onChange={({ target }) => setPublicyAddress(target.value)} />
                    <TextField className={classes.basicText} value={publicPostNumber} id="contactPostnumber" label="Postinumero" variant="outlined" onChange={({ target }) => setPublicPostNumber(target.value)} />
                    <TextField className={classes.basicText} value={publicCity} id="contactCity" label="Kaupunki" variant="outlined" onChange={({ target }) => setPublicCity(target.value)} />
                </div> : <div>
                <div>
                    <Typography variant='h5'>Järjestelmäsi </Typography>
                    <Typography>Nimi: <span style={{fontWeight:600}}>{systName}</span></Typography>
                </div>
                <br />
                        <Typography variant='h5'>Yhteystiedot</Typography>
                        <div style={{margin:'auto', maxWidth: '30%' , border:'solid 1px', textAlign: 'left'}}>
                        <Typography>Nimi: <span style={{fontWeight:600}}>{publicName}</span></Typography>
                        <Typography>Sähköposti: <span style={{fontWeight:600}}>{publicEmail}</span></Typography>
                        <Typography>Puhelin: <span style={{fontWeight:600}}>{publicPhone}</span></Typography>
                        </div>
                        <br />
                        <Typography variant='h5'>Yrityksen tiedot</Typography>
                        <div style={{margin:'auto', maxWidth: '30%' , border:'solid 1px', textAlign: 'left'}}>
                        <Typography>Yrityksen nimi: <span style={{fontWeight:600}}>{publicCompany}</span></Typography>
                        <Typography>Y-tunnus: <span style={{fontWeight:600}}>{publicCompanyID}</span></Typography>
                        <Typography>Osoite: <span style={{fontWeight:600}}>{publicAddress}</span></Typography>
                        <Typography>Postinumero: <span style={{fontWeight:600}}>{publicPostNumber}</span></Typography>
                        <Typography>Toimipaikka: <span style={{fontWeight:600}}>{publicCity}</span></Typography>
                        </div>
                    </div>}


                <br />


                {edit ? <div><Button color='primary' onClick={acceptChanges}>Hyväksy</Button><Button color='secondary' onClick={resetChanges}>Hylkää</Button></div> : <Button color='secondary' onClick={() => setEdit(!edit)}>Muokkaa</Button>}

            </div>
        </div>
    )

}

export default ContactInfoTab