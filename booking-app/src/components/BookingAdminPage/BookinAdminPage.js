import React, { useState} from 'react';
import { auth } from '../../firebase'
import { Tabs, Tab, Typography,  Paper } from '@material-ui/core';
const BookingAdminPage = () => {
    const [value, setValue] = useState(0)
    const user = auth.currentUser
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return(
        <div>
        {!user ?
        <Typography>Aloita luomalla ajanvarausjärjstelmä! </Typography>
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


export default BookingAdminPage