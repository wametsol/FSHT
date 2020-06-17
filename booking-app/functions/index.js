const functions = require('firebase-functions')

const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const cors = require('cors')({ origin: true })
admin.initializeApp()
const gmailInfo = functions.config().gmail



const formatTimes = (value) => {
    var label = ''
    if (value < 10) {
        label += '0'
    }
    if (value - Math.floor(value) === 0.75) {
        label += Math.floor(value) + '.45'
    }
    if (value - Math.floor(value) === 0.5) {
        label += Math.floor(value) + '.30'
    }
    if (value - Math.floor(value) === 0.25) {
        label += Math.floor(value) + '.15'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0) {
        label += Math.floor(value) + '.00'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.33) {
        label += Math.floor(value) + '.20'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.67) {
        label += Math.floor(value) + '.40'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.08) {
        label += Math.floor(value) + '.05'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.17) {
        label += Math.floor(value) + '.10'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.42) {
        label += Math.floor(value) + '.25'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.58) {
        label += Math.floor(value) + '.35'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.83) {
        label += Math.floor(value) + '.50'
    }
    if ((Number((value - Math.floor(value)).toFixed(2))) === 0.92) {
        label += Math.floor(value) + '.40'
    }

    return label

}


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
        if (error) {
            console.log(error)
            return
        }
        else {
            console.log('Sent: ', data)
        }
    })

})

exports.sendNewBookingEmailToSystem = functions.region('europe-west3').firestore.document('{bookerAddress}/bookings/{yearID}/{dayID}')
    .onCreate((snap, context) => {
        const data = snap.data().bookings[Object.keys(snap.data().bookings)[0]]
        console.log(data)



        admin.firestore().collection(`${context.params.bookerAddress}`).doc(`baseInformation`).get()
            .then(doc => {

                const bookerObject = doc.data()
                const promises = []
                var systemMailOptions = {
                    from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
                    to: `${bookerObject.systemEmail}`,
                    subject: `Päivän ${data.bookingDate} ensimmäinen varaus sivustolla ${context.params.bookerAddress[6].toUpperCase() + context.params.bookerAddress.slice(7)}`,
                    html: `
        <h1>${data.service}</h1>
        <p>Varaaja: ${data.user.name}, ${data.user.email}<br/>
         ${data.deviceID === 0 ? `Työntekijä: ${data.worker}` : `Resurssi ${data.worker} ${data.deviceID}`}</p>
        <p>Ajankohta: ${data.bookingDate}, klo: ${formatTimes(data.times.start)} - ${formatTimes(data.times.end)}<br/>
        Varaustunnus: ${data.id}</p>
        `

                }
                var userMailOptions = {
                    from: `${bookerObject.publicInformation.name} <${bookerObject.publicInformation.email}>`,
                    replyTo: `${bookerObject.publicInformation.email}`,
                    to: `${data.user.email}`,
                    subject: `Varausvahvistus sivustolla ${bookerObject.bookerName} `,
                    html: `
                <h1>Hei ${data.user.name}!</h1>
                <p>Tämä on automaattinen ilmoitus varauksesi onnistumisesta</p>
                <p>${data.service}<br/>
                ${data.bookingDate}, klo: ${formatTimes(data.times.start)} - ${formatTimes(data.times.end)}<br/>
                ${data.deviceID === 0 ? `Työntekijä: ${data.worker}` : `Resurssi: ${data.worker} ${data.deviceID}`}<br/>
                Varaustunnus: ${data.id}</p>
                <br/>
                <br/>
                <p>Omien varausten tarkastelu ja peruutus onnistuu ajanvaraussivustollamme: <a href="https://ajanvaraus.web.app/${bookerObject.bookerAddress}">${bookerObject.bookerName}</a><br/>
                Huomioithan että tämän varauksen peruutusaika päättyy ${bookerObject.services.filter(a => a.service === data.service)[0].cancelTime}h ennen varauksen alkua</p>
                
                <p>Tervetuloa,<br/>
                ${bookerObject.publicInformation.name},<br/>
                ${bookerObject.bookerName}<br/>
                ${bookerObject.publicInformation.email}<br/>
                ${bookerObject.publicInformation.phone}
                </p>
                `

                }
                promises.push(transporter.sendMail(systemMailOptions, (error, data) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    else {
                        console.log('Sent: ', data)
                    }
                }))
                promises.push(transporter.sendMail(userMailOptions, (error, data) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    else {
                        console.log('Sent: ', data)
                    }
                }))



                return Promise.all(promises)
            })
            .catch(error => {
                console.log(error)
            })
    })


exports.sendEmailToSystemOnDayEdit = functions.region('europe-west3').firestore.document('{bookerAddress}/bookings/{yearID}/{dayID}')
    .onWrite((change, context) => {
        const data = change.after.data()
        const earlierData = change.before.data()
        console.log('Data: ', data)
        console.log('Before: ', change.before.data())

        admin.firestore().collection(`${context.params.bookerAddress}`).doc(`baseInformation`).get()
            .then(doc => {

                const bookerObject = doc.data()

                console.log('BookerObject: ', bookerObject)


                var mailOptions = []
                const promises = []

                if (Object.keys(data.bookings).length > Object.keys(earlierData.bookings).length) {

                    const object = data.bookings[Object.keys(data.bookings).filter(x => !Object.keys(earlierData.bookings).includes(x))[0]]

                    console.log(object)
                    mailOptions[0] = {
                        from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
                        to: `${bookerObject.systemEmail}`,
                        subject: `Uusi varaus sivustolla ${bookerObject.bookerName}  `,
                        html: `
            <h1>${object.service}</h1>
            <p>Varaaja: ${object.user.name}, ${object.user.email}<br/>
            ${object.deviceID === 0 ? `Työntekijä: ${object.worker}` : `Resurssi: ${object.worker} ${object.deviceID}`}</p>
            <p>Ajankohta: ${object.bookingDate}, klo: ${formatTimes(object.times.start)} - ${formatTimes(object.times.end)}</p>
            <p>Varaustunnus: ${object.id}</p>
            `
                    }
                    mailOptions[1] = {
                        from: `${bookerObject.publicInformation.name} <${bookerObject.publicInformation.email}>`,
                        replyTo: `${bookerObject.publicInformation.email}`,
                        to: `${object.user.email}`,
                        subject: `Varausvahvistus sivustolla ${bookerObject.bookerName} `,
                        html: `
                        <h1>Hei ${object.user.name}!</h1>
                        <p>Tämä on automaattinen ilmoitus varauksesi onnistumisesta</p>
                <p>${object.service}, ${object.bookingDate}, klo: ${formatTimes(object.times.start)} - ${formatTimes(object.times.end)}<br/>
                ${object.deviceID === 0 ? `Työntekijä: ${object.worker}` : `Resurssi: ${object.worker} ${object.deviceID}`}<br/>
                Varaustunnus: ${object.id}</p>
                <br/>
                <br/>
                <p>Omien varausten tarkastelu ja peruutus onnistuu ajanvaraussivustollamme: <a href="https://ajanvaraus.web.app/${bookerObject.bookerAddress}">${bookerObject.bookerName}</a><br/>
                Huomioithan että tämän varauksen peruutusaika päättyy ${bookerObject.services.filter(a => a.service === object.service)[0].cancelTime}h ennen varauksen alkua</p>

                <p>Tervetuloa,<br/>
                ${bookerObject.publicInformation.name},<br/>
                ${bookerObject.bookerName}<br/>
                ${bookerObject.publicInformation.email}<br/>
                ${bookerObject.publicInformation.phone}
                </p>
                `
                    }


                }
                else if (Object.keys(data.bookings).length === Object.keys(earlierData.bookings).length) {

                    if (data.bookings[Object.keys(data.bookings).filter(a => !data.bookings[a].active && earlierData.bookings[a].active)[0]]) {
                        const object = data.bookings[Object.keys(data.bookings).filter(a => !data.bookings[a].active && earlierData.bookings[a].active)[0]]

                        console.log('Cancel: ', object)
                        mailOptions[0] = {
                            from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
                            to: `${bookerObject.systemEmail}`,
                            subject: `Varauksen peruutus sivustolla ${bookerObject.bookerName}  `,
                            html: `
            <h1>Varaus ${object.id} on peruttu</h1>
            <p>Palvelu: ${object.service}</p>
            <p>Peruttu: ${object.cancelled.date}</p>
            ${object.deviceID === 0 ? `Työntekijä: ${object.worker}` : `Resurssi ${object.worker} ${object.deviceID}`}</p>
            <p>Ajankohta: ${object.bookingDate}, klo: ${formatTimes(object.times.start)} - ${formatTimes(object.times.end)}</p>
            <p>Varaaja: ${object.user.name}, ${object.user.email}</p>
            <p>Varaustunnus: ${object.id}</p>
            <p>Selite: ${object.cancelled.reason}<br/>
            `
                        }
                        mailOptions[1] = {
                            from: `${bookerObject.bookerName} <${gmailInfo.email}>`,
                            replyTo: `${bookerObject.publicInformation.email}`,
                            to: `${object.user.email}`,
                            subject: `Varauksesi sivustolla ${bookerObject.bookerName} on peruttu `,
                            html: `
                <h1>Hei ${object.user.name}, olemme peruneet varauksesi ${object.bookingDate}, klo: ${formatTimes(object.times.start)} - ${formatTimes(object.times.end)}</h1>
                <p>Palvelu: ${object.service}</p>
                <p>Peruttu: ${object.cancelled.date}</p>
                <p>Varaustunnus: ${object.id}</p>
                <p>Selite: ${object.cancelled.reason}</p>

                <br/>
                <p>Terveisin,<br/>
                ${bookerObject.publicInformation.name},<br/>
                ${bookerObject.bookerName}<br/>
                ${bookerObject.publicInformation.email}<br/>
                ${bookerObject.publicInformation.phone}
                </p>
                `
                        }

                    } else if (data.bookings[Object.keys(data.bookings).filter(a => data.bookings[a].worker !== earlierData.bookings[a].worker)[0]]) {
                        const object = data.bookings[Object.keys(data.bookings).filter(a => data.bookings[a].worker !== earlierData.bookings[a].worker)[0]]
                        const earlierBooking = earlierData.bookings[object.id]
                        console.log('Transfer: ', object)

                        mailOptions[0] = {
                            from: `Anton Ajanvaraaja <${gmailInfo.email}>`,
                            to: `${bookerObject.systemEmail}`,
                            subject: `Varauksen siirto sivustolla ${bookerObject.bookerName}  `,
                            html: `
            <h1>Varaus ${object.id} on siirretty henkilöltä ${earlierBooking.worker} -> ${object.worker}</h1>
            <p>Palvelu: ${object.service}</p>
            <p>Peruttu: ${object.transferred.date}</p>
            <p>Ajankohta: ${object.bookingDate}, klo: ${formatTimes(object.times.start)} - ${formatTimes(object.times.end)}</p>
            <p>Varaaja: ${object.user.name}, ${object.user.email}</p>
            <p>Varaustunnus: ${object.id}</p>
            <p>Selite: ${object.transferred.reason}<br/>
            `
                        }
                        mailOptions[1] = {
                            from: `${bookerObject.bookerName} <${gmailInfo.email}>`,
                            replyTo: `${bookerObject.publicInformation.email}`,
                            to: `${object.user.email}`,
                            subject: `Ilmoitus koskien varaustasi sivustolla ${bookerObject.bookerName}`,
                            html: `
                <h1>Hei ${object.user.name}, olemme siirtäneet varauksesi ${object.service}, ${object.bookingDate}, klo: ${formatTimes(object.times.start)} - ${formatTimes(object.times.end)} toiselle työntekijälle</h1>
                <p>Uusi työntekijä: ${object.worker}</p>
                <p>Siirretty: ${object.transferred.date}</p>
                <p>Varaustunnus: ${object.id}</p>
                <p>Selite: ${object.transferred.reason}</p>

                <br/>
                <p>Terveisin,<br/>
                ${bookerObject.publicInformation.name},<br/>
                ${bookerObject.bookerName}<br/>
                ${bookerObject.publicInformation.email}<br/>
                ${bookerObject.publicInformation.phone}
                </p>
                `
                        }
                    }
                }



                promises.push(transporter.sendMail(mailOptions[0], (error, data) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    else {
                        console.log('Sent: ', data)
                    }
                }))
                promises.push(transporter.sendMail(mailOptions[1], (error, data) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    else {
                        console.log('Sent: ', data)
                    }
                }))



                return Promise.all(promises)
            })
            .catch(error => {
                console.log(error)
            })
    })

