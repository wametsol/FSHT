import React, { useState, useEffect } from 'react';
import { Slider, Typography, ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails, ExpansionPanelSummary, Divider, Tooltip, Button, TextField } from '@material-ui/core';
import useStyles from './useStyles'
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


const valueLabelFormat = (value) => {
    var label = ''
    if (value < 10) {
        label += '0'
    }
    if (value - Math.floor(value) === 0.75) {
        label += Math.floor(value) + '.45'
    }
    if (value - Math.floor(value) === 0.5) {
        label += Math.floor(value) + '.30'
    }
    if (value - Math.floor(value) === 0.25) {
        label += Math.floor(value) + '.15'
    }
    if (value - Math.floor(value) === 0) {
        label += value + '.00'
    }
    return label

}

const valuetext = (value) => {
    return `${value}`;
}

const initialTimetable = {
    base: [8, 16],
    mon: [8, 16],
    tue: [8, 16],
    wed: [8, 16],
    thu: [8, 16],
    fri: [8, 16],
    sat: [8, 16],
    sun: [8, 16]
}

const TimeManagement = ({ setSuccessMessage, setErrorMessage, bookerObject, fetchData }) => {
    const classes = useStyles()
    const [value, setValue] = useState(initialTimetable)

    const handleBase = (event, newValue) => {
        setValue({
            ...value,
            base: newValue
        })
    }
    const handleMon = (event, newValue) => {
        setValue({
            ...value,
            mon: newValue
        })
    }
    const handleTue = (event, newValue) => {
        setValue({
            ...value,
            tue: newValue
        })
    }
    const handleWed = (event, newValue) => {
        setValue({
            ...value,
            wed: newValue
        })
    }
    const handleThu = (event, newValue) => {
        setValue({
            ...value,
            thu: newValue
        })
    }
    const handleFri = (event, newValue) => {
        setValue({
            ...value,
            fri: newValue
        })
    }
    const handleSat = (event, newValue) => {
        setValue({
            ...value,
            sat: newValue
        })
    }
    const handleSun = (event, newValue) => {
        setValue({
            ...value,
            sun: newValue
        })
    }


    const weekendPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Viikonloppu </Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Aseta Viikonloppu</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >

                    <Slider
                        name='Yleinen'
                        value={value.base}
                        //onChange={({target}) => console.log(target)}
                        onChange={handleBase}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valueLabelFormat}
                        step={0.25}
                        min={0}
                        max={24}
                        type={'number'}
                        aria-labelledby='input-slider'
                        width='75%'


                    />
                    <Typography style={{ textAlign: 'left' }}>Yleinen: {valueLabelFormat(value.base[0])} - {valueLabelFormat(value.base[1])}</Typography>

                </div>
                <div className={classes.column} >
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Lauantai'
                            value={value.sat}
                            onChange={handleSat}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Lauantai: {valueLabelFormat(value.sat[0])} - {valueLabelFormat(value.sat[1])}</Typography>
                    </div>
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Sunnuntai'
                            value={value.sun}
                            onChange={handleSun}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Sunnuntai: {valueLabelFormat(value.sun[0])} - {valueLabelFormat(value.sun[1])}</Typography>
                    </div>



                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    <Typography variant="caption">
                        Varauksen kesto:
                                                <br />
                    </Typography>
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                <Button size="small" color="secondary">
                    Poista
                                    </Button>
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const getWeekdayTimes = () => {
        var weekdays = ''
        weekdays += `Ma: (${valueLabelFormat(value.mon[0])} - ${valueLabelFormat(value.mon[1])})`
        weekdays += `Ti: (${valueLabelFormat(value.tue[0])} - ${valueLabelFormat(value.tue[1])})`
        weekdays += `Ke: (${valueLabelFormat(value.wed[0])} - ${valueLabelFormat(value.wed[1])})`
        weekdays += `To: (${valueLabelFormat(value.thu[0])} - ${valueLabelFormat(value.thu[1])})`
        weekdays += `Pe: (${valueLabelFormat(value.fri[0])} - ${valueLabelFormat(value.fri[1])})`
        return weekdays
    }

    const weekdayPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Arkipäivät (Yleinen: {valueLabelFormat(value.base[0])} - {valueLabelFormat(value.base[1])}) </Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Aseta arkipäivät {getWeekdayTimes()}</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >

                    <Slider
                        name='Yleinen'
                        value={value.base}
                        onChange={handleBase}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valueLabelFormat}
                        step={0.25}
                        min={0}
                        max={24}
                        type={'number'}
                        aria-labelledby='input-slider'
                        width='75%'


                    />
                    <Typography style={{ textAlign: 'left' }}>Yleinen: {valueLabelFormat(value.base[0])} - {valueLabelFormat(value.base[1])}</Typography>

                </div>
                <div className={classes.column} >
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Maanantai'
                            value={value.mon}
                            onChange={handleMon}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Maanantai: {valueLabelFormat(value.mon[0])} - {valueLabelFormat(value.mon[1])}</Typography>
                    </div>
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Tiistai'
                            value={value.tue}
                            onChange={handleTue}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Tiistai: {valueLabelFormat(value.tue[0])} - {valueLabelFormat(value.tue[1])}</Typography>
                    </div>
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Keskiviikko'
                            value={value.wed}
                            onChange={handleWed}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Keskiviikko: {valueLabelFormat(value.wed[0])} - {valueLabelFormat(value.wed[1])}</Typography>
                    </div>
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Torstai'
                            value={value.thu}
                            onChange={handleThu}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Torstai: {valueLabelFormat(value.thu[0])} - {valueLabelFormat(value.thu[1])}</Typography>
                    </div>
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Perjantai'
                            value={value.fri}
                            onChange={handleFri}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'

                        />
                        <Typography style={{ textAlign: 'left' }}>Perjantai: {valueLabelFormat(value.fri[0])} - {valueLabelFormat(value.fri[1])}</Typography>
                    </div>


                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    <Typography variant="caption">
                        Varauksen kesto:
                                                <br />
                    </Typography>
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                <Button size="small" color="secondary">
                    Poista
                                    </Button>
            </ExpansionPanelActions>
        </ExpansionPanel>
    )

    const holidayPanel = () => (
        <ExpansionPanel >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1c-content"
                id="panel1c-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>Pyhät ja erikoispäivät</Typography>
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>Aseta poikkeuksia</Typography>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                <div className={classes.column} >

                    <Slider
                        name='Yleinen'
                        value={value.base}
                        onChange={handleBase}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valueLabelFormat}
                        step={0.25}
                        min={0}
                        max={24}
                        type={'number'}
                        aria-labelledby='input-slider'
                        width='75%'
                        disabled

                    />
                    <Typography style={{ textAlign: 'left' }}>Yleinen: {valueLabelFormat(value.base[0])} - {valueLabelFormat(value.base[1])}</Typography>

                </div>
                <div className={classes.column} >
                    <div style={{ margin: 20 }}>
                        <Slider
                            name='Poikkeus'
                            value={value.base}
                            onChange={handleBase}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            valueLabelFormat={valueLabelFormat}
                            step={0.25}
                            min={0}
                            max={24}
                            type={'number'}
                            aria-labelledby='input-slider'
                            disabled

                        />
                        <Typography style={{ textAlign: 'left' }}>PVM: {valueLabelFormat(value.base[0])} - {valueLabelFormat(value.base[1])}</Typography>
                    </div>



                </div>
                <div className={clsx(classes.column, classes.helper)}>
                    <Typography variant="caption">
                        Varauksen kesto:
                                                <br />
                    </Typography>
                </div>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
                <Tooltip title={`Muokkaa `} arrow><Button size='small' color='primary' >Muokkaa</Button></Tooltip>
                <Button size="small" color="secondary">
                    Poista
                                    </Button>
            </ExpansionPanelActions>
        </ExpansionPanel>
    )


    return (
        <div>

            <Typography>Aukioloajat</Typography>
            <Typography>Aseta varausjärjestelmääsi aukioloajat</Typography>
            {weekdayPanel()}
            {weekendPanel()}
            {holidayPanel()}

        </div>
    )

}

export default TimeManagement