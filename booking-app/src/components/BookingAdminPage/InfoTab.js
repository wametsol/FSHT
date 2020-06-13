import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color'
import firebase, { firestore, storage, auth } from '../../firebase'
import { Typography, CircularProgress, TextField, AppBar, Toolbar, Tabs, Tab, Button, Slider, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, Checkbox, Card, CardMedia, CardContent, Tooltip, Box } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx';

import useStyles from './useStyles'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CallIcon from '@material-ui/icons/Call'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'

import { sameAsBase, getFormattedTimes, getWeekdayTimes, getSingleDayTimes, getSingleDayTimesText } from './TimeTableServices'
import ColorPicker from '../Services/ColorPicker'


const marks = [
    {
        value: 0,
        label: '0%'
    },
    {
        value: 25,
        label: '25%'
    },
    {
        value: 50,
        label: '50%'
    },
    {
        value: 75,
        label: '75%'
    },
    {
        value: 100,
        label: '100%'
    },

]
function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="static" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const InfoTab = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const pagematch = useRouteMatch('/:id')
    const [footerColor, setFooterColor] = useState(bookerObject.siteSettings.footerColor)
    const [footerTextColor, setFooterTextColor] = useState(bookerObject.siteSettings.footerTextColor)
    const [navColor, setNavColor] = useState(bookerObject.siteSettings.navColor)
    const [navTextColor, setNavTextColor] = useState(bookerObject.siteSettings.navTextColor)
    const [navText2Color, setNavText2Color] = useState(bookerObject.siteSettings.navText2Color)
    const [footerBorderRadius, setFooterBorderRadius] = useState(bookerObject.siteSettings.footerBorderRadius)
    const [navTabValue, setNavTabValue] = useState(0)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [footerON, setFooterON] = useState(bookerObject.siteSettings.footerOn)
    const [uploadProgress, setUploadProgress] = useState(null)
    const [imageUpload, setImageUpload] = useState(null)
    const classes = useStyles()



    const sameAsInitialFooterStyle = () => {
        const initialSettings = bookerObject.siteSettings
        if (!isSameRGBColor(initialSettings.footerColor, footerColor)) {
            return false
        }
        if (!isSameRGBColor(initialSettings.footerTextColor, footerTextColor)) {
            return false
        }
        if (initialSettings.footerBorderRadius !== footerBorderRadius) {
            return false
        }
        if (initialSettings.footerOn !== footerON) {
            return false
        }
        return true
    }
    const sameAsInitialNavStyle = () => {
        const initialSettings = bookerObject.siteSettings
        if (!isSameRGBColor(initialSettings.navColor, navColor)) {
            return false
        }
        if (!isSameRGBColor(initialSettings.navTextColor, navTextColor)) {
            return false
        }
        if (!isSameRGBColor(initialSettings.navText2Color, navText2Color)) {
            return false
        }
        return true
    }
    const isSameRGBColor = (first, second) => {
        if (first.r !== second.r || first.b !== second.b || first.g !== second.g || first.a !== second.a) {
            return false
        }
        return true
    }



    const changeBorderRadius = (e, newValue) => {
        console.log(e)
        setFooterBorderRadius(newValue)
    }
    const changeFooterColor = (e) => {
        setFooterColor(e.rgb)
    }
    const changeFooterTextColor = (e) => {
        setFooterTextColor(e.rgb)
    }
    const changeNavColor = (e) => {
        setNavColor(e.rgb)
    }
    const changeNavTextColor = (e) => {
        setNavTextColor(e.rgb)
    }
    const changeNavText2Color = (e) => {
        setNavText2Color(e.rgb)
    }
    const resetFooterStyling = (e) => {
        setFooterColor(bookerObject.siteSettings.footerColor)
        setFooterBorderRadius(bookerObject.siteSettings.footerBorderRadius)
    }

    const resetNavStyling = (e) => {
        setNavColor(bookerObject.siteSettings.navColor)
        setNavTextColor(bookerObject.siteSettings.navTextColor)
        setNavText2Color(bookerObject.siteSettings.navText2Color)
    }

    const valueLabelFormat = (value) => {
        return `${value}%`
    }


    const changeSiteSettings = (e) => {
        e.preventDefault()
        let newSettings = { ...bookerObject.siteSettings }
        newSettings.footerColor = {
            a: footerColor.a,
            r: footerColor.r,
            g: footerColor.g,
            b: footerColor.b
        }
        newSettings.footerTextColor = {
            a: footerTextColor.a,
            r: footerTextColor.r,
            g: footerTextColor.g,
            b: footerTextColor.b
        }
        newSettings.navColor = {
            a: navColor.a,
            r: navColor.r,
            g: navColor.g,
            b: navColor.b
        }
        newSettings.navTextColor = {
            a: navTextColor.a,
            r: navTextColor.r,
            g: navTextColor.g,
            b: navTextColor.b
        }
        newSettings.navText2Color = {
            a: navText2Color.a,
            r: navText2Color.r,
            g: navText2Color.g,
            b: navText2Color.b
        }
        newSettings.footerBorderRadius = footerBorderRadius
        newSettings.footerOn = footerON
        try {
            setLoading(true)
            firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ 'siteSettings': newSettings })
                .then((res) => {
                    setSuccessMessage(`Footerin näkymää muutettu`)
                    fetchData()
                    setTimeout(() => {
                        setLoading(false)
                    }, 1000);

                })

        } catch (error) {

        }
    }

    const handleUpload = (e) => {
        e.preventDefault()

        try {
            console.log('Uploading: ', imageUpload.name, ' to server, hold on')
            setLoading(true)
            var metadata = {
                contentType: 'image/jpeg',
                customMetadata: {
                    'uploader': auth.currentUser.displayName
                }
            }
            let uploadTask = storage.ref(`booker${pagematch.params.id}/images/background.jpg`).put(imageUpload, metadata)

            uploadTask.on('state_changed', (snapshot) => {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setUploadProgress(progress)
            }, (error) => {
                console.log(error)
                setErrorMessage('Kuvan lataamisessa tapahtui virhe')
            }, () => {
                console.log('FINISHED')

                storage.ref(`booker${pagematch.params.id}/images/background.jpg`).getDownloadURL()
                    .then(bgImageUrl => {
                        firestore.collection(`booker${pagematch.params.id}`).doc('baseInformation').update({ 'images.background': bgImageUrl })
                            .then(res => {
                                fetchData()
                                setImageUpload(null)
                                setLoading(false)
                                setSuccessMessage('Kuvan lataaminen palvelimelle onnistui')
                            })
                    })

            })
        } catch (error) {
            console.log(error)
        }



    }

    const rgbLabeller = (color) => {
        return `rgb(${color.r},${color.g},${color.b},${color.a})`
    }

    const footerPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Alapalkki</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Säädä alapalkin asetuksia</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>{footerON ? <span style={{ color: 'green' }}>Käytössä</span> : <span style={{ color: 'red' }}>Ei käytössä</span>}</Typography>
                </div>

            </ExpansionPanelSummary>
            <Typography style={{ textAlign: 'left', marginLeft: '20%' }}>Alapalkki käytössä:<Checkbox color='primary' checked={footerON} onChange={() => setFooterON(!footerON)} /></Typography>
            {footerON ? <div>
            <Typography className={classes.secondaryHeading}>Tässä näkyvien tietojen päivittäminen tapahtuu niitä koskevilta välilehdiltä</Typography>
            <div>

                <div style={{ margin: 20 }}>
                    <div className={classes.footer} style={{ backgroundColor: `rgb(${footerColor.r},${footerColor.g},${footerColor.b},${footerColor.a})`, borderTopLeftRadius: footerBorderRadius, borderTopRightRadius: footerBorderRadius }}>
                        <Typography style={{ color: rgbLabeller(footerTextColor), fontWeight: 600 }} >Yhteystiedot </Typography>
                        <div className={classes.footerContent}>

                            <div className={classes.footerObject}>

                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>{bookerObject.publicInformation.name}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}><AlternateEmailIcon /> {bookerObject.publicInformation.email}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}><CallIcon /> {bookerObject.publicInformation.phone}</Typography>

                            </div>
                            <div className={classes.footerObject}>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>{bookerObject.publicInformation.company}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>Y-tunnus: {bookerObject.publicInformation.companyID}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>{bookerObject.publicInformation.address}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>{bookerObject.publicInformation.postnumber}, {bookerObject.publicInformation.city}</Typography>
                            </div>
                            <div className={classes.footerObject}>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>Avoinna: </Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>{sameAsBase(bookerObject.timeTables) ? <span>Arkisin: {getFormattedTimes(bookerObject.timeTables.base)}</span> : <span>{getWeekdayTimes(bookerObject.timeTables)}</span>}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>La: {getFormattedTimes(bookerObject.timeTables.weekEnds.sat)}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>Su: {getFormattedTimes(bookerObject.timeTables.weekEnds.sun)}</Typography>
                                <Typography style={{ color: rgbLabeller(footerTextColor) }}>{}</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ExpansionPanelDetails className={classes.details}>

                <div className={classes.oneFourthColumn} >


                    <ColorPicker title='Alapalkin pohjaväri' initialColor={bookerObject.siteSettings.footerColor} changeColor={changeFooterColor} color={footerColor} />
                    <br />
                    <Typography>Säädä kulmien pyöreyttä</Typography>
                    <Slider
                        disabled={!footerON}
                        name='Pyöreys'
                        value={footerBorderRadius}
                        onChange={changeBorderRadius}
                        valueLabelDisplay='auto'
                        aria-labelledby="range-slider"
                        //getAriaValueText={valuetext}
                        valueLabelFormat={valueLabelFormat}
                        step={1}
                        min={0}
                        max={100}
                        type={'number'}
                        aria-labelledby='input-slider'
                        marks={marks}></Slider>

                </div>
                <div className={classes.oneFourthColumn}>
                    <ColorPicker title='Alapalkin tekstiväri' initialColor={bookerObject.siteSettings.footerTextColor} changeColor={changeFooterTextColor} color={footerTextColor} disabled={!footerON} />
                </div>
            </ExpansionPanelDetails></div> : <em />}
            <Divider />
            <ExpansionPanelActions>
                {!loading ? <div><Button disabled={sameAsInitialFooterStyle()} color='secondary' onClick={resetFooterStyling}>Peru muutokset</Button>
                    <Button disabled={sameAsInitialFooterStyle()} color='primary' onClick={changeSiteSettings}>Hyväksy muutos</Button></div> : <CircularProgress />}
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const navPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Yläapalkki</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Säädä yläpalkin asetuksia</Typography>
                </div>

            </ExpansionPanelSummary>
            <div>
                <Divider />
                <div style={{ maxWidth: '75%', margin: 'auto' }}>
                    <AppBar position="static" style={{ backgroundColor: `rgb(${navColor.r},${navColor.g},${navColor.b},${navColor.a})` }}>
                        <Toolbar className={classes.bookingTopbar} variant="dense" >
                            <Tabs
                                value={navTabValue}
                                TabIndicatorProps={{ style: { background: `rgb(${navText2Color.r},${navText2Color.g},${navText2Color.b},${navText2Color.a})` } }}
                                variant='standard'>
                                <Tab label={<span className={classes.homeButton} onClick={() => setNavTabValue(0)} style={{ color: `rgb(${navTextColor.r},${navTextColor.g},${navTextColor.b},${navTextColor.a})` }} >{bookerObject.bookerName}</span>}></Tab>
                                <Tab label={<span className={classes.menuButton} onClick={() => setNavTabValue(1)} variant='outlined' style={{ color: `rgb(${navTextColor.r},${navTextColor.g},${navTextColor.b},${navTextColor.a})` }} >Varaukset</span>}></Tab>
                            </Tabs>


                        </Toolbar>
                    </AppBar>
                </div>
            </div>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.oneFourthColumn} >

                    <ColorPicker title='Palkin pohjaväri' initialColor={bookerObject.siteSettings.navColor} changeColor={changeNavColor} color={navColor} />
                    <br />
                    <Typography>Säädä kulmien pyöreyttä</Typography>
                    <Slider
                        name='Pyöreys'
                        value={footerBorderRadius}
                        onChange={changeBorderRadius}
                        valueLabelDisplay='auto'
                        aria-labelledby="range-slider"
                        //getAriaValueText={valuetext}
                        valueLabelFormat={valueLabelFormat}
                        step={1}
                        min={0}
                        max={100}
                        type={'number'}
                        aria-labelledby='input-slider'
                        marks={marks}
                        disabled></Slider>

                </div>
                <div className={classes.oneFourthColumn}>
                    <ColorPicker title='Painikkeiden tekstiväri' initialColor={bookerObject.siteSettings.navTextColor} changeColor={changeNavTextColor} color={navTextColor} />
                </div>
                <div className={classes.oneFourthColumn}>
                    <ColorPicker title='Painikkeiden korostusväri' initialColor={bookerObject.siteSettings.navText2Color} changeColor={changeNavText2Color} color={navText2Color} />
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                {!loading ? <div><Button disabled={sameAsInitialNavStyle()} color='secondary' onClick={resetNavStyling}>Peru muutokset</Button>
                    <Button disabled={sameAsInitialNavStyle()} color='primary' onClick={changeSiteSettings}>Hyväksy muutos</Button></div> : <CircularProgress />}
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const backgroundPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Taustakuva</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Muokkaa taustakuvaa</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.halfColumn} >
                    <input
                        accept='image/*'
                        id='uploadImage'
                        type='file'
                        hidden
                        onChange={({ target }) => setImageUpload(target.files[0])}
                    />
                    <label htmlFor='uploadImage'>
                        <Button variant='contained' component='span'>Lataa kuva</Button>
                    </label>

                    {imageUpload ? <Typography>{imageUpload.name}</Typography> : <em />}
                </div>
                <div className={classes.halfColumn} >
                    <Typography>Näkymä</Typography>
                    <div style={{ maxWidth: '75%', margin: 'auto' }}>
                        <AppBar position="static" style={{ backgroundColor: `rgb(${navColor.r},${navColor.g},${navColor.b},${navColor.a})` }}>
                            <Toolbar className={classes.BGbookingTopbar} >
                                <Tabs
                                    value={navTabValue}
                                    TabIndicatorProps={{ style: { background: `rgb(${navText2Color.r},${navText2Color.g},${navText2Color.b},${navText2Color.a})`, marginBottom: 6 } }}
                                    variant='standard'>
                                    <Tab label={<span className={classes.BGhomeButton} onClick={() => setNavTabValue(0)} style={{ color: `rgb(${navTextColor.r},${navTextColor.g},${navTextColor.b},${navTextColor.a})` }} >{bookerObject.bookerName}</span>}></Tab>
                                    <Tab label={<span className={classes.BGmenuButton} onClick={() => setNavTabValue(1)} variant='outlined' style={{ color: `rgb(${navTextColor.r},${navTextColor.g},${navTextColor.b},${navTextColor.a})` }} >Varaukset</span>}></Tab>
                                </Tabs>


                            </Toolbar>
                        </AppBar>
                        <Card>
                            {imageUpload ? <CardMedia className={classes.media} image={URL.createObjectURL(imageUpload)} /> : <CardMedia className={classes.media} image={bookerObject.images.background} />}
                            <CardContent style={{ padding: 4 }}>
                                <div >
                                    <Typography gutterBottom variant="h6" component="h5" style={{ fontSize: 15 }}>
                                        {bookerObject.bookerName} ajanvaraus
                            </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: 10 }}>
                                        Varaa aikasi täältä
                            </Typography>
                                </div>

                            </CardContent>


                            <Divider />
                        </Card>
                    </div>
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                {!loading ? <div><Button disabled={!imageUpload} color='secondary' onClick={() => setImageUpload(null)} >Peru</Button>
                    <Tooltip title='Päivittää sivuston taustakuvan. HUOM! tämä poistaa sivuston vanhan kuvan palvelimelta'><Button disabled disabled={!imageUpload} color='primary' onClick={handleUpload} >Päivitä taustakuva</Button></Tooltip></div > : <div style={{ marginRight: '40%' }}>{uploadProgress ? <Typography >Kuvaa ladataan palvelimelle: <CircularProgressWithLabel value={uploadProgress} /></Typography> : <em />}</div>}
            </ExpansionPanelActions>
        </ExpansionPanel>
    )



    console.log(bookerObject)
    return (
        <div>
            <Typography variant="h5">Sivuston näkymät</Typography>
            {navPanel()}
            {footerPanel()}
            {backgroundPanel()}
        </div>
    )
}
export default InfoTab
