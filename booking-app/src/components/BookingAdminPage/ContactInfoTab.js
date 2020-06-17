import React, { useState } from 'react';
import { firestore } from '../../firebase'
import { Typography, TextField, InputAdornment, Button } from '@material-ui/core';

import useStyles from './useStyles'

import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import PhoneIcon from '@material-ui/icons/Phone';



const ContactInfoTab = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)

    const [systName, setSystName] = React.useState(bookerObject.bookerName)
    const [systEmail, setSystEmail] = React.useState(bookerObject.systemEmail)
    const [webAddress, setWebAddress] = React.useState('')

    const [publicName, setPublicName] = React.useState(bookerObject.publicInformation.name)
    const [publicCompany, setPublicCompany] = React.useState(bookerObject.publicInformation.company)
    const [publicEmail, setPublicEmail] = React.useState(bookerObject.publicInformation.email)
    const [publicPhone, setPublicPhone] = React.useState(bookerObject.publicInformation.phone)
    const [publicCompanyID, setPublicCompanyID] = React.useState(bookerObject.publicInformation.companyID)
    const [publicAddress, setPublicAddress] = React.useState(bookerObject.publicInformation.address)
    const [publicPostNumber, setPublicPostNumber] = React.useState(bookerObject.publicInformation.postnumber)
    const [publicCity, setPublicCity] = React.useState(bookerObject.publicInformation.city)


    const resetChanges = (e) => {
        e.preventDefault()
        setEdit(!edit)
        setSystName(bookerObject.bookerName)
        setSystEmail(bookerObject.systemEmail)
        setPublicName(bookerObject.publicInformation.name)
        setPublicCompany(bookerObject.publicInformation.company)
        setPublicEmail(bookerObject.publicInformation.email)
        setPublicPhone(bookerObject.publicInformation.phone)
        setPublicCompanyID(bookerObject.publicInformation.companyID)
        setPublicAddress(bookerObject.publicInformation.address)
        setPublicPostNumber(bookerObject.publicInformation.postnumber)
        setPublicCity(bookerObject.publicInformation.city)
        setWebAddress(bookerObject.publicInformation.webAddress)
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
            newInfo.webAddress = webAddress

            firestore.collection(`booker${bookerObject.bookerAddress}`).doc('baseInformation').update({ publicInformation: newInfo, systemEmail: systEmail })
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


                <Typography variant='h4'>Yhteystiedot </Typography>



                {edit ? <div>
                    <div>
                        <Typography variant='h5'>Järjestelmäsi </Typography>
                        <div className={classes.contactInfoEditBox}>
                            <TextField disabled className={classes.basicText} id="systemName" style={{ background: '#f5f5f5' }} value={systName} label="Nimi" variant="outlined" onChange={({ target }) => setSystName(target.value)} />
                            <TextField className={classes.basicText} id="systemEmail" style={{ background: '#f5f5f5' }} value={systEmail} label="Järjestelmän email" variant="outlined" onChange={({ target }) => setSystEmail(target.value)} />
                        </div>
                    </div>
                    <br />
                    <Typography variant='h5'>Julkisesti näkyvät yhteystiedot</Typography>
                    <div className={classes.contactInfoEditBox}>
                        <TextField className={classes.basicText} id="contactName" style={{ background: '#f5f5f5' }} value={publicName} label="Nimi" variant="outlined" onChange={({ target }) => setPublicName(target.value)} />


                        <TextField InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AlternateEmailIcon />
                                </InputAdornment>
                            ),
                        }} className={classes.basicText} id="bookerEmail" style={{ background: '#f5f5f5' }} value={publicEmail} label="Sähköposti" variant="outlined" onChange={({ target }) => setPublicEmail(target.value)} />

                        <TextField InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIcon />
                                </InputAdornment>
                            ),
                        }} className={classes.basicText} id="bookerPhone" style={{ background: '#f5f5f5' }} value={publicPhone} label="Puhelinnumero" variant="outlined" onChange={({ target }) => setPublicPhone(target.value)} />
                    </div>
                    <br />
                    <Typography variant='h5'>Julkisesti näkyvät yrityksen tiedot</Typography>
                    <div className={classes.contactInfoEditBox}>
                        <TextField className={classes.basicText} style={{ background: '#f5f5f5' }} value={publicCompany} id="contactCompany" label="Yritys" variant="outlined" onChange={({ target }) => setPublicCompany(target.value)} />
                        <TextField className={classes.basicText} style={{ background: '#f5f5f5' }} value={publicCompanyID} id="contactCompanyID" label="Y-tunnus" variant="outlined" onChange={({ target }) => setPublicCompanyID(target.value)} />
                        <TextField className={classes.basicText} style={{ background: '#f5f5f5' }} value={webAddress} id="webAddress" label="Web Osoite" variant="outlined" onChange={({ target }) => setWebAddress(target.value)} />
                        <br />
                        <TextField className={classes.basicText} style={{ background: '#f5f5f5' }} value={publicAddress} id="contactAddress" label="Osoite" variant="outlined" onChange={({ target }) => setPublicAddress(target.value)} />
                        <TextField className={classes.basicText} style={{ background: '#f5f5f5' }} value={publicPostNumber} id="contactPostnumber" label="Postinumero" variant="outlined" onChange={({ target }) => setPublicPostNumber(target.value)} />
                        <TextField className={classes.basicText} style={{ background: '#f5f5f5' }} value={publicCity} id="contactCity" label="Kaupunki" variant="outlined" onChange={({ target }) => setPublicCity(target.value)} />
                    </div>
                </div> : <div>
                        <div>
                            <Typography variant='h5'>Järjestelmäsi </Typography>
                            <div className={classes.contactInfoBox}>
                                <Typography>Järjestelmän nimi: <span className={classes.boldText}>{systName}</span></Typography>
                                <Typography>Järjestelmän email: <span className={classes.boldText}>{systEmail}</span></Typography>
                            </div>
                        </div>
                        <br />
                        <Typography variant='h5'>Yhteystiedot</Typography>
                        <div className={classes.contactInfoBox}>
                            <Typography>Nimi: <span className={classes.boldText}>{publicName}</span></Typography>
                            <Typography>Sähköposti: <span className={classes.boldText}>{publicEmail}</span></Typography>
                            <Typography>Puhelin: <span className={classes.boldText}>{publicPhone}</span></Typography>
                            <Typography>Nettisivusto: <span className={classes.boldText}>{webAddress}</span></Typography>
                        </div>
                        <br />
                        <Typography variant='h5'>Yrityksen tiedot</Typography>
                        <div className={classes.contactInfoBox}>
                            <Typography>Yrityksen nimi: <span className={classes.boldText}>{publicCompany}</span></Typography>
                            <Typography>Y-tunnus: <span className={classes.boldText}>{publicCompanyID}</span></Typography>
                            <Typography>Osoite: <span className={classes.boldText}>{publicAddress}</span></Typography>
                            <Typography>Postinumero: <span className={classes.boldText}>{publicPostNumber}</span></Typography>
                            <Typography>Toimipaikka: <span className={classes.boldText}>{publicCity}</span></Typography>
                        </div>
                    </div>}


                <br />


                {edit ? <div><Button color='primary' onClick={acceptChanges}>Hyväksy</Button><Button color='secondary' onClick={resetChanges}>Hylkää</Button></div> : <Button color='secondary' onClick={() => setEdit(!edit)}>Muokkaa</Button>}

            </div>
        </div>
    )

}

export default ContactInfoTab