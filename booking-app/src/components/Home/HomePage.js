import React, { useEffect, useState} from 'react';
import { auth } from '../../firebase'
import { AppBar, Tabs, Tab, Typography, Box, Paper } from '@material-ui/core';
const HomePage = () => {
    const [user, setUser] = useState(null)
    const [value, setValue] = useState(0)

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user)
            }
        })
    }, )

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return(
        <div>
        {!user ?
        <Typography>Aloita kirjautumalla sisään </Typography>
        :(<Paper>
            <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            centered
            >
                <Tab label='Varaukset' />
                <Tab label='Jotain muuta' />
                <Tab label='Muutokset' />
                <Tab label='Tilastot' />
                <Tab label='Käyttäjähallinta' />
            </Tabs>
        </Paper>)
        }
    </div>
    )


}


export default HomePage