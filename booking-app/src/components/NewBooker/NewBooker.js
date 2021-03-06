import React, {  useState } from 'react';
import { auth, firestore } from '../../firebase'
import { Stepper, Step, StepButton, Typography, Button, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import useStyles from './useStyles'
import {useHistory } from 'react-router-dom'
import CheckIcon from '@material-ui/icons/Check'
import BlockIcon from '@material-ui/icons/Block'

import clsx from 'clsx'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import PhoneIcon from '@material-ui/icons/Phone';





const NewBooker = () => {
    const user = auth.currentUser
    const classes = useStyles()
    const history = useHistory()

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const [activeStep, setActiveStep] = React.useState(0)
    const [completed, setCompleted] = React.useState([false, false, false])

    const [systName, setSystName] = React.useState('')
    const [webAddress, setWebAddress] = React.useState('')

    const [publicName, setPublicName] = React.useState('')
    const [publicCompany, setPublicCompany] = React.useState('')
    const [publicEmail, setPublicEmail] = React.useState('')
    const [publicPhone, setPublicPhone] = React.useState('')

    const [bookerServices, setBookerServices] = React.useState([])
    


    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
        [classes.checkBtn]: !success,
    })

    const addressClassname = clsx({
        [classes.addressSuccess]: success,
        [classes.addressError]: error,
    })

    const systemInput = clsx({
        [classes.addressSuccess]: systName.length > 3,
    })

    const getSteps = () => {
        return ['Sivuston perustiedot', 'Yhteystiedot', 'Tarkistus'];
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return basicInformation()
            case 1:
                return contactInformation()
            case 2:
                return checkInformation()
            default:
                return 'Unknown step';
        }
    }
    const steps = getSteps()


    const totalSteps = () => {
        return steps.length
    }

    const completedSteps = () => {
        const complSteps = Object.keys(completed).filter(object => completed[object] === true)
        return complSteps.length
    }

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    }

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    }

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1
        setActiveStep(newActiveStep)

        if(isLastStep() && allStepsCompleted()){
            creationComplete()
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStep = (step) => () => {
        setActiveStep(step)
    }

    const handleComplete = () => {
        const newCompleted = completed
        newCompleted[activeStep] = true
        setCompleted(newCompleted)
        handleNext()
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompleted({})
    }


    const resetOne = () => {
        const newReseted = completed
        newReseted[activeStep] = false
        setCompleted(newReseted)
        setActiveStep(0)

        if(activeStep===0){
            setSystName('')
            setWebAddress('')
            setSuccess(false)
        }
        if(activeStep===1){
            setPublicName('')
            setPublicCompany('')
            setPublicEmail('')
            setPublicPhone('')
            setSuccess(false)
        }
    }


    const checkAvailability = (e) => {
        e.preventDefault()
        
        try {
            if (webAddress.length<3){
                setError(true)
            } else if (!loading) {
                setSuccess(false)
                setError(false)
                setLoading(true)
                firestore.collection(`bookerCollection`).get().then( (response) => {
                    if(response.docs.filter(a => a.id === webAddress).length===0){
                        setTimeout(() => {
                            setSuccess(true)
                            setLoading(false)
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            setError(true)
                            setLoading(false)
                        }, 1000);
                    }
                })
            }
        } catch (exception) {
            console.log(exception)
        }
    }
    const isReady = () => {
        Object.keys(completed).map(key => {
            if(!completed[key]){
                return false
            }
        })
        if(completedSteps() !== totalSteps() - 1){
            return false
        }

        return true
    }

    const checkInformation = () => (
        <div>
            {isReady() ? (
            <div><Typography variant='h4'>Varmista antamasi tiedot</Typography>
            <Typography>Sivustosi nimi: {systName}</Typography>
            <Typography>Sivustosi osoite: www.ajanvaraus.web.app/{webAddress}</Typography>
            <Typography>______________</Typography>
            <Typography>Yhteystiedot sivullesi:</Typography>
            <Typography>Yritys: {publicCompany}</Typography>
            <Typography>Nimi: {publicName}</Typography>
            <Typography>Sähköposti: {publicEmail}</Typography>
            <Typography>Puhelin: {publicPhone}</Typography>
            
            </div>)
            : (
                <div>
                    <Typography>Et ole varmistanut kaikkia kohtia vielä.</Typography>
            
                {Object.keys(completed).map(key => {
                    //if(!completed[key]){
                        return (<Typography key={key}>{Number(key)+1} <em className={classes.inlineIcons}>{completed[key] ? <CheckIcon size={25} className={classes.success} /> : <BlockIcon size={25} className={classes.error}/>}</em></Typography>)
                    //}
            })}
        
                </div>
            )}
            
        </div>
    )

    const basicInformation = () => (
        <div  >
            <Typography >Aloitetaan tulevan järjestelmän perustiedoista</Typography>
            <TextField
                id="name"
                value={systName}
                label="Järjestelmäsi nimi"
                style={{ margin: 8 }}
                helperText="Tämä tulee sivustosi nimeksi. Esimerkiksi 'Kampaamo kaisa'"
                fullWidth
                margin="dense"
                variant='outlined'
                onChange={({target}) => setSystName(target.value)}
                InputProps={{
                    className: systemInput
                }}
                
            />
            <TextField
                value={webAddress}
                id="address"
                label="Sivustosi osoite"
                style={{ margin: 8, width: '75%' }}
                placeholder="omasivustosi"
            helperText={error? <Typography variant='caption' style={{color: 'red'}}>{webAddress.length<3? <span>Sivuston osoitteen pituus voi minimissään olla 3 merkkiä</span>: <span>Tunnus ei ole sopiva tai se on jo käytössä</span>}</Typography>: success? <Typography variant='caption' className={classes.success}>Tämä tunnus on vapaana</Typography> :'Sivusto josta ajanvarausjärjestelmäsi löytyy luomisen jälkeen. Et pysty muuttamaan sivustosi osoitetta myöhemmin.'}
                margin="dense"
                className={classes.addresInput}
                onChange={({target}) => {
                    setError(false)
                    setSuccess(false)
                    setWebAddress(target.value)
                }}
                variant='outlined'
                InputProps={{
                    className: addressClassname,
                    startAdornment: <InputAdornment position="start">www.ajanvaraus.web.app/</InputAdornment>,
                }}
                disabled={loading}
            />
            <Button
                onClick={checkAvailability}
                variant='contained'
                className={buttonClassname}
                disabled={loading}
            >Tarkista</Button>
            {loading ? <CircularProgress size={25} className={classes.success} /> : <em>{success ? <CheckIcon size={25} className={classes.success} /> : <em />}</em>}


        </div>
    )
    const contactInformation = () => (
        <div>
            <Typography variant='h4'>Yhteystiedot asiakkaille </Typography>
            <Typography>Voit halutessasi määritellä asiakkaille näkyvät yhteystiedot vielä uudelleen myöhemmin.</Typography>
            <Typography>Järjestelmän ja sinun välinen kommunikaatio tapahtuu kuitenkin tähän talletetun emailin mukaan mukaan.</Typography>
            <TextField value={publicName} className={classes.basicText} id="contactName" label="Nimi" variant="outlined" onChange={({target}) => setPublicName(target.value)}/>
            <TextField value={publicCompany} className={classes.basicText} id="contactCompany" label="Yritys" variant="outlined" onChange={({target}) => setPublicCompany(target.value)} />

            <TextField 
            value={publicEmail}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AlternateEmailIcon />
                    </InputAdornment>
                ),
            }} className={classes.basicText} id="bookerEmail" label="Sähköposti" variant="outlined" onChange={({target}) => setPublicEmail(target.value)} 
            required/>
            <TextField 
            value={publicPhone}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <PhoneIcon />
                    </InputAdornment>
                ),
            }} className={classes.basicText} id="bookerPhone" label="Puhelinnumero" variant="outlined"  onChange={({target}) => setPublicPhone(target.value)}/>

        </div>
    )

    const initialTimetable = {
        base: [8, 16],
        weekDays: {
            mon: [8, 16],
            tue: [8, 16],
            wed: [8, 16],
            thu: [8, 16],
            fri: [8, 16],
        },
        weekEnds: {
            sat: [8, 16],
            sun: [8, 16]
        }
    }
    const creationComplete = () => {
        setLoading(true)
        
        try {
            const bookerObject = {
                bookerCreator: user.email,
                systemEmail: publicEmail,
                bookerName: systName,
                bookerAddress: webAddress,
                publicInformation:{
                    company: publicCompany,
                    name: publicName,
                    email: publicEmail,
                    phone: publicPhone
                },
                services: bookerServices,
                admins: {
                   [user.uid]: {
                    email: user.email,
                    name: user.displayName
                    }
                },
                timeTables: initialTimetable,
                specialDays: [],
                resources:[],
                images:{
                    background: 'https://firebasestorage.googleapis.com/v0/b/ajanvaraus-fs20.appspot.com/o/bookerkeilaamo%2Fimages%2Fbackground.jpg?alt=media&token=f2c3863b-b57f-4d63-9806-a0416da334fd'
                },
                siteSettings: {
                    color: '',
                    footerBorderRadius: 0,
                    footerOn: true,
                    footerColor:{
                        a:1,
                        r:255,
                        g:255,
                        b:255
                    },
                    footerTextColor:{
                        a:1,
                        b:10,
                        g:152,
                        r:205
                    },
                    navColor:{
                        a:0.59,
                        r:1,
                        g:158,
                        b:201
                    },
                    navTextColor:{
                        a:0.59,
                        r:1,
                        g:158,
                        b:201
                    },
                    navText2Color:{
                        a:0.59,
                        r:1,
                        g:158,
                        b:201
                    },
                    visibleToPublic: false,
                    
                }
            }
            
            firestore.collection(`booker${webAddress}`).doc('baseInformation').set(bookerObject).then( (response) => {
                firestore.collection(`booker${webAddress}`).doc('bookings').set({init:true})
                .then((resp) => {
                firestore.collection('userCollection').doc(user.email).set({bookers: { [webAddress]: {address: webAddress, name: systName}}}, {merge: true})
                .then((res) => {
                    firestore.collection('bookerCollection').doc(webAddress).set({active: true})
                    .then(r => {
                        setTimeout(() => {
                        setLoading(false)
                        setTimeout(() => {
                            history.push(`/${webAddress}/admin`)
                        }, 2000)
                        }, 3000)   
                    })
                    
                })
                })
            })
                
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
        
        
        
        
    }
    return (
        <div>
            {!user ?
                <Typography>Aloita kirjautumalla sisään </Typography>
                : (<div className={classes.root}>



                    <div className={classes.stepBar}>
                        <Stepper nonLinear activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepButton onClick={handleStep(index)} completed={completed[index]}>
                                        {label}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                    <div className={classes.innerForm} >
                        <Typography variant='h4' style={{ margin: 20 }}>Ajanvarausjärjestelmän luominen</Typography>
                        <Typography>____________________________________________________________________________________________________________________</Typography>

                        <div>
                            {allStepsCompleted() ? (
                                <div>
                            {loading ? (<div><Typography>Kaikki näyttää hyvältä, aloitan tiedostojen lähettämisen palvelimelle, odota hetki!</Typography><CircularProgress size={25} className={classes.success} /></div>) : (
                            <div><Typography>Tiedostojen lähettäminen onnistui, hienoa! Ohjaan sinut järjestelmän sivulle.</Typography><CheckIcon size={25} className={classes.success} /> </div>)}
                                    <Typography className={classes.instructions}>
                                        
                                        Kaikki valmiina!
                                        
            </Typography>
            
                                    <Button onClick={handleReset}>Nollaa kaikki</Button>
                                </div>
                            ) : (
                                    <div className={classes.instructions}>{getStepContent(activeStep)}</div>

                                )}
                        </div>

                        <div>
                            <Button disabled={activeStep === 0} onClick={handleBack} color="primary" className={classes.button}>
                                <ArrowBackIcon />
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                                disabled={activeStep === 2}
                            >
                                <ArrowForwardIcon />
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" className={classes.completed}>
                                        Kohta {activeStep + 1} on jo täytetty. <Button size='small' color='secondary' onClick={resetOne}>Nollaa</Button>
                                    </Typography>
                                ) : (<Typography>Kun olet valmis kohdan {activeStep + 1}: ''{getSteps()[activeStep]}'' kanssa, paina
                                    <Button disabled={(loading || (activeStep===0 && !success || systName.length < 4))} variant="contained" color="primary" style={{ margin: 8 }} onClick={handleComplete}>
                                        {isReady() ? 'Lopetus' : 'Valmis'}
                                    </Button></Typography>
                                    ))}
                        </div>
                    </div>

                </div>)
            }
        </div>
    )


}


export default NewBooker