import React from 'react';
import { auth } from '../../firebase'
import { Typography, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    newBooker:{
        marginTop: 20,
        marginRight: '75%',
        backgroundColor: '#00c7d1',
        color: 'grey',

        '&:hover': {
            background: 'linear-gradient(#00c7d1 10%, #00d199 70%)',
            fontWeight: 'bold'
        }
        
    }
}))


const HomePage = () => {
    const user = auth.currentUser
    const classes = useStyles()

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
                    <Typography>Hei {user.displayName}</Typography>
                    

                </div>)
            }
        </div>
    )


}


export default HomePage