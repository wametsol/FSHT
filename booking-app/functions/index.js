const functions = require('firebase-functions')

const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const cors = require('cors')({origin:true})
admin.initializeApp()
const gmailInfo = functions.config().gmail


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailInfo.email,
        pass: gmailInfo.password
    }
})

exports.getSubCollections = functions.region('europe-west3').https.onCall(async (data, context) => {

    const docPath = data.docPath;

    const collections = await admin.firestore().doc(docPath).listCollections();

    const collectionIds = collections.map(col => col.id);

    return { collections: collectionIds };

});

exports.sendMail = functions.region('europe-west3').https.onRequest((req, res) => {
        const dest = req.query.dest

        const mailOptions = {
            from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
            to: `${gmailInfo.email}`,
            subject: 'Testi',
            html: `
            <h1>Testataan toiminnallisuutta</h1>
            <p>Asd</p>
            `

        }

        return transporter.sendMail(mailOptions, (error, data) => {
            if(error){
                console.log(error)
                return
            }
            else {
                console.log('Sent: ', data)
            }
        })

})

exports.sendNewBookingEmailToSystem = functions.region('europe-west3').firestore.document('{bookerAddress}/bookings/{dayID}/{bookingID}')
.onCreate((snap, context) => {
    const data = snap.data()
    var mailOptions = {
        from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
        to: `${gmailInfo.email}`,
        subject: 'Uusi varaus sivustolla',
        html: `
        <h1>${data.service}</h1>
        <p>Asd</p>
        `

    }
    return transporter.sendMail(mailOptions, (error, data) => {
        if(error){
            console.log(error)
            return
        }
        else {
            console.log('Sent: ', data)
        }
    })
})

exports.sendNewBooking = functions.region('europe-west3').firestore.document('{bookerAddress}/bookings')
.onUpdate((change, context) => {

    console.log(change)
    const prevData = change.before.data()
    const data = change.after.data()

    Object.keys(data).map(k => console.log(data[k]))

    console.log(prevData)
    console.log(data)
    var mailOptions = {
        from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
        to: `${gmailInfo.email}`,
        subject: 'Uusi varaus sivustolla',
        html: `
        <h1>${data.service}</h1>
        <p>Asd</p>
        `

    }
    return transporter.sendMail(mailOptions, (error, data) => {
        if(error){
            console.log(error)
            return
        }
        else {
            console.log('Sent: ', data)
        }
    })
})


exports.sendEditOnBookingsToSystem = functions.region('europe-west3').firestore.document('{bookerAddress}/bookings/{yearID}/{bookingID}')
.onWrite((change, context) => {
    const data = change.after.data()
    const previousData = change.before.data()
    var mailOptions = {
        from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
        to: `${gmailInfo.email}`,
        subject: 'Ensimmäinen varaus päivälle',
        html: `
        <h1>Testi</h1>
        <p>Asd</p>
        `

    }

    if(Boolean(data) && Boolean(!previousData)){
        mailOptions = {
            from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
            to: `${gmailInfo.email}`,
            subject: 'Ensimmäinen varaus päivälle',
            html: `
            <h1>Testi</h1>
            <p>Asd</p>
            `

        }
    }
    if(data.length > previousData.length){
        mailOptions = {
            from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
            to: `${gmailInfo.email}`,
            subject: 'Uusi varaus',
            html: `
            <h1>test</h1>
            <p>Asd</p>
            `

        }
    }
    if(data.length === previousData.length){
        mailOptions = {
            from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
            to: `${gmailInfo.email}`,
            subject: 'Varausta muokattiin',
            html: `
            <h1>test</h1>
            <p>Asd</p>
            `

        }
    }
    return transporter.sendMail(mailOptions, (error, data) => {
        if(error){
            console.log(error)
            return
        }
        else {
            console.log('Sent: ', data)
        }
    })
})

/*
exports.sendMail = functions.region('europe-west3').https.onRequest((req, res) => {
    cors(req, res, () => {
        const dest = req.query.dest

        const mailOptions = {
            from: 'Anton Ajanvaraaja <ajanvaraus@gmail.com>',
            to: 'ajanvaraus@gmail.com',
            subject: 'Testi',
            html: `
            <h1>Testataan toiminnallisuutta</h1>
            <p>Asd</p>
            `

        }

        return transporter.sendMail(mailOptions, (error, data) => {
            if(error){
                console.log(error)
                return
            }
            else {
                console.log('Sent: ', data)
            }
        })
    })

})
*/