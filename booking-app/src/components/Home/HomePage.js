import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../firebase'
import { Typography, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    newBooker:{
        margin: 20,
        backgroundColor: '#00c7d1',
        color: 'grey',

        '&:hover': {
            background: 'linear-gradient(#00c7d1 10%, #00d199 70%)',
            fontWeight: 'bold'
        }
        
    },
    existingBookers:{
        margin: 20,
        display: 'inline',
        backgroundColor: '#b8d4bf',
        color: 'grey',

        '&:hover': {
            background: 'linear-gradient(#b8d4bf 10%, #44d468 70%)',
        }
    }
}))


const HomePage = () => {
    const user = auth.currentUser
    const classes = useStyles()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [bookers, setBookers] = useState([])

    useEffect(() => {
        try {
            setLoading(true)
            firestore.collection('userCollection').doc(user.email).get()
                .then((response) => {
                    if (response.empty) {
                        setError(true)
                        setLoading(false)
                    }
                    console.log(response.data())
                    
                    response.data().bookers.forEach(booker => {
                        console.log(booker)
                        setBookers(bookers.concat(booker))
                        setLoading(false)
                    })
                    
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false)
                    setError(true)
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }, [])

    return (
        <div>
            {!user ?
                <Typography>Aloita kirjautumalla sisään </Typography>
                : (<div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.newBooker}
                        component={Link}
                        to='/newbooker'>
                        Luo uusi järjestelmä
                    </Button>
                    <Typography>Hei {user.displayName}, järjestelmäsi: </Typography>
                    {bookers.map(booker => (
                        <div key={booker.name}>
                        <Typography>{booker.name}: </Typography>
                        <Button className={classes.existingBookers} variant="outlined" component={Link} to={`/${booker.address}`}>Sivustolle</Button>
                        <Button className={classes.existingBookers} variant="outlined" component={Link} to={`/${booker.address}/admin`}>Admin paneeliin</Button>
                        <Typography>________________________________________________</Typography>
                        </div>
                    ))}
                    
                    
                    

                </div>)
            }
        </div>
    )


}


export default HomePage