import React, {  useState } from 'react';
import { auth } from '../../firebase'
import { Stepper, Step, StepLabel, StepButton, Typography, Button, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Link, useHistory } from 'react-router-dom'
import CheckIcon from '@material-ui/icons/Check';
import { green } from '@material-ui/core/colors'
import clsx from 'clsx'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'

    },
    stepBar: {
        width: '100%',
    },
    innerForm: {
        marginLeft: theme.spacing(10),
        marginRight: theme.spacing(10),
        marginTop: theme.spacing(5),
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    checkBtn: {
        margin: 8,
        backgroundColor: '#b0d1b8',
        '&:hover': {
            backgroundColor: '#90ad97',
        }
    },
    success: {
        color: green[500],
    },

    buttonSuccess: {
        margin: 8,
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[600],
        }
    },
    addressSuccess: {
        color: green[500],
        backgroundColor: green[100]
    },
    addresInput: {

    },
    basicText: {
        margin: 8,
        width: '35%'
    },
    subTitle: {
        textSize: 20
    }
}))







const NewBooker = () => {
    const user = auth.currentUser
    const classes = useStyles()

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [activeStep, setActiveStep] = React.useState(0)
    const [completed, setCompleted] = React.useState({})


    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
        [classes.checkBtn]: !success,
    })

    const addressClassname = clsx({
        [classes.addressSuccess]: success,
    })

    const getSteps = () => {
        return ['Sivuston perustiedot', 'Yhteystiedot', 'Rakenne', 'Tarkistus'];
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return basicInformation()
            case 1:
                return contactInformation()
            case 2:
                return 'This is the bit I really care about!';
            default:
                return 'Unknown step';
        }
    }
    const steps = getSteps()


    const totalSteps = () => {
        return steps.length
    }

    const completedSteps = () => {
        return Object.keys(completed).length;
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


    // Doesn't re render, needs fixing.
    const resetOne = () => {
        const newReseted = completed
        newReseted[activeStep] = false
        setCompleted(newReseted)
        setActiveStep(0)
    }


    const checkAvailability = (e) => {
        e.preventDefault()

        try {
            if (!loading) {
                setSuccess(false)
                setLoading(true)
            }
            setTimeout(() => {
                setSuccess(true)
                setLoading(false)
            }, 5000);
        } catch (exception) {
            console.log(exception)
        }
        setLoading(true)

    }

    const basicInformation = () => (
        <div  >
            <Typography >Aloitetaan tulevan järjestelmän perustiedoista</Typography>
            <TextField
                id="name"
                label="Järjestelmäsi nimi"
                style={{ margin: 8 }}
                helperText="Tämä tulee sivustosi nimeksi. Esimerkiksi 'Kampaamo kaisa'"
                fullWidth
                margin="dense"
                variant='outlined'
            />
            <TextField
                id="address"
                label="Sivustosi osoite"
                style={{ margin: 8, width: '75%' }}
                placeholder="omasivustosi"
                helperText="Sivusto josta ajanvarausjärjestelmäsi löytyy luomisen jälkeen"
                margin="dense"
                className={classes.addresInput}
                onChange={() => setSuccess(false)}
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

            <Typography>____________________________________________________________________________________________________________________</Typography>
            <Typography variant='h4'>Yhteystiedot asiakkaille </Typography>
            <Typography>Voit halutessasi määritellä profiilista poikkeavat yhteystiedot, jotka näytetään asiakkaille sivustollasi.</Typography>
            <Typography>Järjestelmän ja sinun välinen kommunikaatio tapahtuu kuitenkin profiiliin talletettujen tietojen mukaan.</Typography>
            <TextField className={classes.basicText} id="contactName" label="Nimi" variant="outlined" />
            <TextField className={classes.basicText} id="contactCompany" label="Yritys" variant="outlined" />

            <TextField InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AlternateEmailIcon />
                    </InputAdornment>
                ),
            }} className={classes.basicText} id="bookerEmail" label="Sähköposti" variant="outlined" />
            <TextField InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <PhoneIcon />
                    </InputAdornment>
                ),
            }} className={classes.basicText} id="bookerPhone" label="Puhelinnumero" variant="outlined" />

        </div>
    )

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
                            >
                                <ArrowForwardIcon />
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" className={classes.completed}>
                                        Kohta {activeStep + 1} on jo täytetty. <Button size='small' color='secondary' onClick={resetOne}>Nollaa</Button>
                                    </Typography>
                                ) : (<Typography>Kun olet valmis kohdan {activeStep + 1}: ''{getSteps()[activeStep]}'' kanssa, paina
                                    <Button variant="contained" color="primary" style={{ margin: 8 }} onClick={handleComplete}>
                                        {completedSteps() === totalSteps() - 1 ? 'Lopetus' : 'Valmis'}
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