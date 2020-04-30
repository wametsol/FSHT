import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
    singleService: {
        marginTop: 20,

        '&:hover': {
            fontWeight: 'bold'
        }

    },
    addButton: {
        color: green[500],
        '&:hover': {
            color: green[600],
        }
    },
    green:{
        color:green[500]
    },
    adminListObject: {
        display: 'inline',
        margin: 8
    },
    removeAdmin: {
        color: 'red',
    },
    root: {
        width: '100%',
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
        flexBasis: '33.33%',
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
    errorMessage: {
        color: 'red'
    },
    sliderInner: {
        marginLeft: 20,
        marginRight: 20
    },
    sliderOuter: {
        margin: 20,
        border: 'solid 1px'
    },
    adminDatepicker: {
        display: 'flex',
        //marginLeft: 20,
        justifyContent: 'center'
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
    weekBtn:{

    },
    dayBtn:{

    },
    footer: {
        margin: 'auto',
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
}))

export default useStyles