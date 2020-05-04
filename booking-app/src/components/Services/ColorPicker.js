import React from 'react';
import { ChromePicker } from 'react-color'
import { Typography } from '@material-ui/core';





const ColorPicker = ({title, initialColor, changeColor, color}) => {
    return (
        
    <div>    
    <Typography>{title}</Typography>
    <ChromePicker
    title='Infobar'
    color={color}
    onChange={changeColor} 
    />
    </div>

    )
    
}



export default ColorPicker