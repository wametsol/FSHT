

export const sameAsBase = (value) => {
    for (let [key, val] of Object.entries(value.weekDays)) {
        if (val[0] !== value.base[0] || val[1] !== value.base[1]) {
            return false
        }
    }
    return true
}

export const getFormattedTimes = (times) => {
    if(isClosed(times)){
        return 'suljettu'
    } else {
        return `(${valueLabelFormat(times[0])} - ${valueLabelFormat(times[1])})`
    }
}



export const isClosed = (times) => {
    if(times[0]===times[1]){
        return true
    } else {
        return false
    }
}

export const getWeekdayTimes = (value) => {
    var weekdays = ''
    weekdays += `Ma: ${getFormattedTimes(value.weekDays.mon)} `
    weekdays += `Ti: ${getFormattedTimes(value.weekDays.tue)} `
    weekdays += `Ke: ${getFormattedTimes(value.weekDays.wed)} `
    weekdays += `To: ${getFormattedTimes(value.weekDays.thu)} `
    weekdays += `Pe: ${getFormattedTimes(value.weekDays.fri)} `
    return weekdays
}

const getDayContent = (day, timetables) => {
    switch (day) {
        case 1:
            return timetables.weekDays.mon
        case 2:
            return timetables.weekDays.tue
        case 3:
            return timetables.weekDays.wed
        case 4:
            return timetables.weekDays.thu
        case 5:
            return timetables.weekDays.fri
        case 6:
            return timetables.weekEnds.sat
        case 0:
            return timetables.weekEnds.sun
        default:
            return 'Unknown step';
    }
}

export const getNumberArray = (amount, step) => {
    var numberArray = new Array(amount)
    var i

    for (i = 0; i <= amount; i += step) {
        numberArray[i] = i
    }
    return numberArray
}

export const getSingleDayTimes = (day, timetables) => {
    return getDayContent(day, timetables)
}

export const getSingleDayTimesText = (day, timetables) => {
    return getFormattedTimes(getDayContent(day, timetables))
}
export const valueLabelFormat = (value) => {
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
    if ((Number((value-Math.floor(value)).toFixed(2))) === 0) {
        label += Math.floor(value) + '.00'
    }
    if ((Number((value-Math.floor(value)).toFixed(2))) === 0.33) {
        label += Math.floor(value) + '.20'
    }
    if ((Number((value-Math.floor(value)).toFixed(2))) === 0.67) {
        label += Math.floor(value) + '.40'
    }
    return label

}

export const valuetext = (value) => {
    return `${value}`;
}
