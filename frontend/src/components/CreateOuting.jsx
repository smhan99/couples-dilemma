import { Stack } from '@mui/material'
import React, { useState } from 'react'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import {
  Button,
} from "@mui/material";

const CreateOuting = ({ createOuting }) => {
  const [datetime, setDatetime] = useState(dayjs());
  const [invited, setInvited] = useState("");
  const [location, setLocation] = useState("");

  const setOutingDate = (newDate) => {
    let newDatetime = dayjs(datetime).set('year', newDate.get('year'))
                                     .set('month', newDate.get('month'))
                                     .set('date', newDate.get('date'));
    setDatetime(newDatetime);
  }

  const setOutingTime = (newTime) => {
    let newDatetime = dayjs(datetime).set('hour', newTime.get('hour'))
                                     .set('minute', newTime.get('minute'));
    setDatetime(newDatetime);
  }

  return (
    <div className='createOuting'>
      <h1>Create a New Outing</h1>
      <Stack
        sx={{ marginBottom: "20px" }}
        direction={{ xs: "column", sm: "row" }}
        spacing={7}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label="Select Date"
              color="error"
              onChange={(newValue) => setOutingDate(newValue)}
              required={true}
            />
            <TimePicker 
              label="Select Time" 
              onChange={(newValue) => setOutingTime(newValue)}
              format="hh:mm a"
              required={true}
            />
          </LocalizationProvider>
          <TextField 
            id="filled-basic" 
            label="Username to Invite" 
            variant="filled" 
            required={true}
            onChange={(e) => setInvited(e.target.value)}
          />
          <TextField 
            id="filled-basic" 
            label="Location... Type an address" 
            placeholder='New York City'
            variant="filled" 
            required={true}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Stack>
        <Button
          variant="contained"
          onClick={() => createOuting(datetime, invited, location)}
        >
          Lets go
        </Button>
      </Stack>
    </div>
  )
}

export default CreateOuting