import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        margin: 'auto',
        marginBottom: 'auto',
        minHeight: '85vh',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        padding: 5,
        border: '1px solid',
        borderRadius: 5,
        '&:hover': {
            background: 'linear-gradient(#3f51b5 60%, #2e91bf 120%)',
            borderRadius: 10
        }
    },
    bookingTopbar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    media: {
        height: 140,
        margin: 'auto'
    },
    footer: {
        margin: 'auto',
        backgroundColor: '#03a5fc',
        minHeight: '15vh',
        maxWidth: '50%',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,

    },
    singleService: {
        textAlign: 'left',
        margin: 20
    },
    footerObject: {
        marginLeft: '5%',
        marginTop: 'auto',
        flexBasis: '33.33%',
    },
    footerContent: {
        display: 'flex',
        textAlign: 'left!important'
    },
    selectorLine: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: ' #f2f2f2'

    },
    selector: {
        margin: 20
    },
    selectEmpty: {

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    datePickerTitle: {
        margin: 20,
        marginTop: 16,
        marginBottom: 8,
        alignSelf: 'flex-end'
    },
    currentDayTitle: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
        padding: 20,
    },
    closedInfo: {
        position: 'relative',
        alignSelf: 'center',
        marginTop: '1%',
        backgroundColor: '#ffebe6',
        padding: 20
    },
    weekBtn:{
        alignSelf: 'center'

    },
    dayBtn:{
        alignSelf: 'center'
    },
    homeButton: {
        flexGrow: 0,
        fontSize: 20,
        '&:hover': {
            background: 'linear-gradient(#3f51b5 60%, #2e91bf 120%)',
            borderRadius: 5
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '25%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    green:{
        color:green[500]
    },
    errorMessage: {
        color: 'red'
    },
}))

export default useStyles