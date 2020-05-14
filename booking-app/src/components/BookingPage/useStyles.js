import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '60%',
        margin: 'auto',
        marginBottom: '15vh',
        minHeight: '80vh',
        [theme.breakpoints.down('sm')]:{
            maxWidth: '90%',
        },
        [theme.breakpoints.down('xs')]:{
            maxWidth: '100%',
        }

    },
    menuButton: {
        marginRight: theme.spacing(2),
        padding: 5,
        border: '1px solid',
        borderRadius: 5,
        '&:hover': {
            background: 'rgb(255,255,255,0.5)',
            borderRadius: 10
        }
    },
    homeButton: {
        flexGrow: 0,
        fontSize: 20,
        padding: 5,
        '&:hover': {
            background: 'rgb(255,255,255,0.5)',
            border: '1px',
            borderRadius: 5
        }
    },
    bookingTopbar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    media: {
        height: '25vh',
        margin: 'auto'
    },
    footer: {
        margin: 'auto',
        minHeight: '15vh',
        maxWidth: '60%',
        position:'fixed',
        bottom:0,
        left: 0,
        right: 0,
        [theme.breakpoints.down('sm')]:{
            maxWidth: '90%',
        },
        [theme.breakpoints.down('xs')]:{
            maxWidth: '100%',
        }

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
    specialInfo: {
        position: 'relative',
        alignSelf: 'center',
        marginTop: '1%',
        backgroundColor: '#ffe4a1',
        padding: 20
    },
    specialTimeBox: {
        padding: 5,
        flexBasis: '40%',
        maxWidth: '400px',
        border: '1px solid lightgrey',
        borderRadius: 4
    },
    titleBox: {
        flexBasis: '60%'
    },
    cardTitleBox: {
        display:'flex'
    },
    weekBtn:{
        marginTop: '10px',
        alignSelf: 'center'

    },
    dayBtn:{
        marginTop: '10px',
        alignSelf: 'center'
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
    pastIcon:{
        color: 'orange'
    },
    profileBox:{
        flexBasis: '50%',
        backgroundColor: 'white',
        textAlign: 'left',
        margin: 20,
        padding: 10
    },
    upperBox: {
        display: 'flex',
        backgroundColor: '#fffbf0'
    },
    lowerBox: {
        padding: 20,
        backgroundColor: '#fffbf0'
    },
    innerBox: {
        minHeight: 150
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
}))

export default useStyles