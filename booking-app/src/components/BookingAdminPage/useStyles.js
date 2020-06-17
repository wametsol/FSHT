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
        minWidth: 0,
        marginTop: '5px',
        color: green[500],
        '&:hover': {
            color: green[600],
        }
    },
    cancelButton: {
        minWidth: 0,
        marginTop: '5px',
        color: 'red',
        '&:hover': {
            color: 'darkred',
        }
    },
    addServiceButton: {
        minWidth: 0,
        marginTop: '15px',
        color: green[500],
        '&:hover': {
            color: green[600],
        }
    },
    cancelServiceButton: {
        minWidth: 0,
        marginTop: '15px',
        color: 'red',
        '&:hover': {
            color: 'darkred',
        }
    },
    green: {
        color: green[500]
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
    halfColumn: {
        flexBasis: '50%'
    },
    threeFourthColumn: {
        flexBasis: '75%',
    },
    oneFourthColumn: {
        marginLeft: 'auto',
        marginRight: 'auto',
        alignSelf: 'flex-start'
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
    dateInput: {
        textAlign: 'center',
    },
    dayBtn: {
        marginTop: '10px'
    },
    weekBtn: {
        marginTop: '10px'
    },
    footer: {
        margin: 'auto',
        minHeight: '15vh',
        maxWidth: '75%',

    },
    singleService2: {
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
    bookingTopbar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    BGbookingTopbar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxHeight: '36px!important',
        minHeight: '36px!important',
    },
    BGmenuButton: {
        marginRight: theme.spacing(2),
        padding: 2,
        fontSize: 10,
        border: '0.5px solid',
        borderRadius: 5,
        '&:hover': {
            background: 'rgb(255,255,255,0.5)',
            borderRadius: 7
        }
    },
    BGhomeButton: {
        flexGrow: 0,
        fontSize: 13,
        padding: 2,
        '&:hover': {
            background: 'rgb(255,255,255,0.5)',
            border: '1px',
            borderRadius: 5
        }
    },
    basicText: {
        margin: 8,
        width: '30%'
    },
    holidayAddForm: {
        marginLeft: '15%',
        marginRight: '15%',
        backgroundColor: 'rgb(255,213,158,0.5)',
        display: 'flex',
        //flexDirection: 'column',
        alignItems: 'center',
    },
    halfDiv: {
        flexBasis: '50%',
        alignSelf: 'flex-start'
    },
    specialTextfield: {
        marginTop: 15,
        marginBottom: 15
    },
    specialDays: {
        display: 'flex',
        margin: 20
    },
    specialDay: {
        flexBasis: '25%',
        margin: 'auto'

    },
    specialText: {
        width: '50%',
    },
    floatingErrorBox: {
        alignSelf: 'center',
        position: 'fixed',
        width: '74%',
        height: '20%',
        left: '13%',
        textAlign: 'center',
        backgroundColor: 'grey',
        opacity: 0.8,
        borderRadius: 5,
    },
    addServiceForm: {
        margin: '20px',
        backgroundColor: '#fffdf7',
        padding: '20px',
        borderRadius: '5px',
        border: 'solid 1px lightgrey'
    },
    priceInput: {
        marginTop: '0px !important',
        marginBottom: '0px !important'
    },
    serviceHoursInput: {
        minWidth: '50px !important'
    },
    visibilityBar: {
        minHeight: '40px',
        backgroundColor: 'seashell',
        alignItems: 'center',
        padding: '10px'
    },
    innerVisibilityBox: {
        display: 'flex',
        justifyContent: 'center'
    },
    visibilityButtons: {
        flexBasis: '33%'
    },
    toSiteButton: {
        backgroundColor: green[200],
        padding: '2px !important',
        marginLeft: '5px',
        '&:hover': {
            backgroundColor: green[300],
        }
    },
    hideVisibilityBtn: {
        padding: '2px !important',
        marginLeft: '5px',
        backgroundColor: '#ffe6e6',
        '&:hover': {
            backgroundColor: '#ffb3b3',
        }
    },
    publishVisibilityBtn: {
        padding: '2px !important',
        marginLeft: '5px',
        backgroundColor: green[100],
        '&:hover': {
            backgroundColor: green[300],
        }
    },
    media: {
        height: '12.5vh',
        margin: 'auto'
    },
    switchBase: {
        color: 'lightblue',
        '&$checked': {
            color: 'pink',
        },
        '&$checked + $track': {
            backgroundColor: 'pink',
            color: 'pink'

        },
        '& + $track': {
            backgroundColor: 'lightblue',
            color: 'lightblue'
        }
    },
    checked: {
    },
    track: {
    },
    humanBox: {
        borderRadius: 5,
        padding: 7,
        color: 'white',
        fontWeight: 'bold'
    },
    serviceListPaper: {
        minWidth: 230,
        minHeight: 250
    },

    contactInfoBox: {
        margin: 'auto',
        maxWidth: '30%',
        padding: 20,
        backgroundColor: 'lightgrey',
        borderRadius: '5px',
        textAlign: 'left'
    },
    contactInfoEditBox: {
        margin: 'auto',
        maxWidth: '80%',
        padding: 20,
        backgroundColor: '#ededed',
        borderRadius: '5px',
    },
    boldText: {
        fontWeight: 600
    }
}))

export default useStyles