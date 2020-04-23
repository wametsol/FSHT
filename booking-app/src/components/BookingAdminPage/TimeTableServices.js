

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
        case 0:
            return getFormattedTimes(timetables.weekDays.mon)
        case 1:
            return getFormattedTimes(timetables.weekDays.tue)
        case 2:
            return getFormattedTimes(timetables.weekDays.wed)
        case 3:
            return getFormattedTimes(timetables.weekDays.thu)
        case 4:
            return getFormattedTimes(timetables.weekDays.fri)
        case 5:
            return getFormattedTimes(timetables.weekEnds.sat)
        case 6:
            return getFormattedTimes(timetables.weekEnds.sun)
        default:
            return 'Unknown step';
    }
}

export const getSingleDayTimes = (day, timetables) => {
    return getDayContent(day, timetables)
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
    if (value - Math.floor(value) === 0) {
        label += value + '.00'
    }
    return label

}

export const valuetext = (value) => {
    return `${value}`;
}
