import React, { useState } from 'react';
import firebase, { auth, firestore } from '../../firebase'
import { Typography, CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Chip, Divider } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


const UserTab = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const pagematch = useRouteMatch('/:id')
    const user = auth.currentUser
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [newAdmin, setNewAdmin] = useState('')
    const classes = useStyles()


    const addNewAdmin = (e) => {
        e.preventDefault()
        try {
            setError(false)
            setLoading(true)
            firestore.collection('userCollection').doc(newAdmin).get()
                .then(response => {
                    if (response.empty || Object.keys(bookerObject.admins).filter(a => a === newAdmin.uid).length > 0) {
                        setLoading(false)
                        setErrorMessage('Antamallasi osoitteella ei löytynyt käyttäjää. Huomioithan että käyttäjän tulee olla rekisteröitynyt ajanvarausjärjestelmän käyttäjäksi.')
                    } else {
                        const adminUid = response.data().uid
                        const adminObject = {
                            email: response.data().email,
                            name: response.data().name
                        }
                        firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').set({ admins: { [`${adminUid}`]: adminObject } }, { merge: true })
                            .then(res => {
                                firestore.collection(`userCollection`).doc(`${newAdmin}`).set({ bookers: { [`${bookerObject.bookerAddress}`]: { name: bookerObject.bookerName, address: bookerObject.bookerAddress } } }, { merge: true })
                                    .then(resp => {
                                        setNewAdmin('')
                                        fetchData()
                                        setLoading(false)
                                        setSuccessMessage(`Käyttäjä ${adminObject.name} lisätty adminksi`)
                                    })

                            })
                    }
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }


    const removeAdmin = (admin) => {
        const adminId = Object.keys(bookerObject.admins).filter(a => bookerObject.admins[a].email === admin.email && bookerObject.admins[a].name === admin.name)[0]
        try {
            setError(false)
            setLoading(true)

            firestore.collection(`userCollection`).doc(`${admin.email}`).update({ [`bookers.${bookerObject.bookerAddress}`]: firebase.firestore.FieldValue.delete() })
                .then(resp => {

                    firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ [`admins.${adminId}`]: firebase.firestore.FieldValue.delete() })
                        .then(res => {
                            fetchData()
                            setLoading(false)
                        })
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    return (
        <div>
            <Typography variant='h5'>Sivuston ylläpitäjä</Typography>
            <Typography>{bookerObject.bookerCreator}</Typography>
            -----------------------------------------------------
            <Typography>Lisää ja poista admin käyttäjiä sivulta</Typography>
            <div>
                <TextField
                    id="newadmin"
                    label="Email"
                    style={{ margin: 4 }}
                    helperText="Lisää admin emaililla"
                    margin="dense"
                    variant='outlined'
                    disabled={loading}
                    value={newAdmin}
                    onChange={({ target }) => setNewAdmin(target.value)}
                />
                {loading ? <CircularProgress className={classes.addButton} size={25} /> : <Button onClick={addNewAdmin}><AddCircleIcon className={classes.addButton} /></Button>}
                {error ? <div className={classes.errorMessage}>Virhe on sattunut, tarkista osoite ja yritä uudelleen</div> : <em />}
            </div>
            {Object.keys(bookerObject.admins).map(a => bookerObject.admins[a]).map(admin => (
                <div key={admin.email} >
                    <div className={classes.root}>
                        <ExpansionPanel >
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1c-content"
                                id="panel1c-header"
                            >
                                <div className={classes.column}>
                                    <Typography className={classes.heading}>{admin.name}</Typography>
                                </div>
                                <div className={classes.column}>
                                    <Typography className={classes.secondaryHeading}>{admin.email}</Typography>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <div className={classes.column} />
                                <div className={classes.column}>
                                    {admin.email === bookerObject.bookerCreator ? <div><Chip label="Owner" /></div> : <em />}
                                    <Chip label="Admin" />
                                    <Chip label="Booker" />
                                </div>
                                <div className={clsx(classes.column, classes.helper)}>
                                    <Typography variant="caption">
                                        Lisää tietoa
                                   <br />
                                    </Typography>
                                </div>
                            </ExpansionPanelDetails>
                            <Divider />
                            <ExpansionPanelActions>
                                <Tooltip title={`Poista henkilön ${admin.name} adminoikeudet `} arrow><span><Button disabled={admin.email === bookerObject.bookerCreator} size='small' className={classes.removeAdmin} onClick={() => removeAdmin(admin)}><CancelIcon /></Button></span></Tooltip>
                                <Button size="small" color="primary">
                                    Save
                                </Button>
                            </ExpansionPanelActions>
                        </ExpansionPanel>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserTab