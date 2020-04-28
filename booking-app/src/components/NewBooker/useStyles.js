import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

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
    error:{
        color: '#FF0000'
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
    },
    inlineIcons: {
        margin: 0
    },
}))

export default useStyles