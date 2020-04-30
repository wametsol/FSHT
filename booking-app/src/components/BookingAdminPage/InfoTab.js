import React, { useState } from 'react';
import { ChromePicker } from 'react-color'
import firebase, { firestore } from '../../firebase'
import { Typography,  CircularProgress, TextField, Button, Tooltip, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CallIcon from '@material-ui/icons/Call'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'

import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from './TimeTableServices'

const InfoTab = ({setSuccessMessage, setErrorMessage, bookerObject, fetchData}) => {
    const pagematch = useRouteMatch('/:id')
    const [footerColor, setFooterColor] = useState(bookerObject.siteSettings.footerColor)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    

    const classes = useStyles()

    const changeColor = (e) => {
        setFooterColor(e.rgb)
    }

    const changeFooterColor = (e) => {
        e.preventDefault()
        console.log(footerColor)

        try {
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ 'siteSettings.footerColor': footerColor })
                .then((res) => {
                    setLoading(false)
                    setSuccessMessage(`Infobarin väri vaihdettu`)
                })
            
        } catch (error) {
            
        }
    }

    console.log(bookerObject)
    return (
        <div>
            <Typography variant="h5">Sivuston info</Typography>
            <Typography>Nykyinen näkymä</Typography>
            <div style={{margin: 20}}>
            <div className={classes.footer} style={{backgroundColor:`rgb(${footerColor.r},${footerColor.g},${footerColor.b},${footerColor.a})`}}>
                    <Typography >Yhteystiedot </Typography>
                    <div className={classes.footerContent}>

                        <div className={classes.footerObject}>

                            <Typography color="textSecondary">{bookerObject.publicInformation.name}</Typography>
                            <Typography color="textSecondary"><AlternateEmailIcon /> {bookerObject.publicInformation.email}</Typography>
                            <Typography color="textSecondary"><CallIcon /> {bookerObject.publicInformation.phone}</Typography>

                        </div>
                        <div className={classes.footerObject}>
                            <Typography color="textSecondary">{bookerObject.publicInformation.company}</Typography>
                            <Typography color="textSecondary">JokuRandomOsoite 123</Typography>
                            <Typography color="textSecondary">02250, Espoo</Typography>
                        </div>
                        <div className={classes.footerObject}>
                            <Typography color="textSecondary">Avoinna: </Typography>
                            <Typography>{sameAsBase(bookerObject.timeTables) ? <span>Arkisin: {getFormattedTimes(bookerObject.timeTables.base)}</span> : <span>{getWeekdayTimes(bookerObject.timeTables)}</span>}</Typography>
                            <Typography>La: {getFormattedTimes(bookerObject.timeTables.weekEnds.sat)}</Typography>
                            <Typography>Su: {getFormattedTimes(bookerObject.timeTables.weekEnds.sun)}</Typography>
                            <Typography color="textSecondary">{}</Typography>
                        </div>
                    </div>
                </div>
                </div>
                <Divider/>
                
                <Typography>Muuta tietoja</Typography>
                <div>
                <Typography>Väri:</Typography>
                <TextField></TextField>
                <ChromePicker
                title='Infobar'
                color={footerColor}
                onChange={changeColor} 
                />
                <Button onClick={changeFooterColor}>Hyväksy muutos</Button>
                </div>
        </div>
    )
}


export default InfoTab
