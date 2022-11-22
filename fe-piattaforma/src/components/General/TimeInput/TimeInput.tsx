import React, { useEffect, useState } from "react";
import { Input } from "design-react-kit"
import './TimeInput.scss'
import { padStart } from "lodash";

interface TimeInputI {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean
}

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':']

const TimeInput = ({ value, disabled = false, onChange }: TimeInputI) => {

    const [intValue, setIntValue] = useState(value ? value : '')

    useEffect(() => {
        if (value !== intValue) setIntValue (value ? value : '')
    }, [value])

    useEffect(() => {
        if ((!intValue || intValue.length === 5) && intValue !== value) onChange(intValue)
    }, [intValue])

    const onValueChange = (value: string) => {
        if ([...value].every(c => digits.includes(c))) {
            const hours = value.split(':')[0]
            const minutes = value.split(':')[1]
            if ((!hours || validHours(hours)) && (!minutes || validMinutes(minutes)) && value.replace(/[^:]/g, "").length < 2) setIntValue(value)
        }
    }

    const onAutocomplete = () => {
        if (intValue) {
            let hours = intValue.split(':')[0]
            if (!hours) hours = '00'
            hours = padStart(hours, 2, "0")

            let minutes = intValue.split(':')[1]
            if (!minutes) minutes = '00'
            minutes = padStart(minutes, 2, "0")

            setIntValue([hours, minutes].join(':'))
        }
    }

    return <Input
        className="time-input"
        type="text"
        placeholder="hh:mm"
        disabled={disabled}
        maxLength={5}
        value={intValue}
        onBlur={onAutocomplete}
        onChange={(e) => onValueChange(e.target.value)}
    />
}


const validHours = (hours: string) => {
    let isValid = true;
    isValid = hours.length < 3 && isValid;
    isValid = parseInt(hours) >= 0 && parseInt(hours) <= 23 && isValid;
    return isValid;
}

const validMinutes = (minutes: string) => {
    let isValid = true;
    isValid = minutes.length < 3 && isValid;
    isValid = parseInt(minutes) >= 0 && parseInt(minutes) <= 59 && isValid;
    return isValid
}

export default TimeInput