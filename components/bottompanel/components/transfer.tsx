import { Button, InputAdornment, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { NAIRA } from '../../../constant';
import { useDispatch } from 'react-redux';
import { BillPayment, errorType } from '../../../typescript/enum';
import { usePayBill, useTransfer } from '../../../functions';

export default function Transfer({open}:{open: BillPayment}) {
    const dispatch = useDispatch()
    const [phone_number, setPhone_number] = useState<string>()
    const [username_error, setUsernameError] = useState<errorType>(
        errorType.non
    );
    const [loading, setLoading] = useState<boolean>(false)
    const [username, setUsernamer] = useState<string>("")
    const [key, setKey] = useState<string>("")
    const [amount, setAmount] = useState<number>()
    const [key_error, setKey_error] = useState<errorType>(errorType.non);
    return (
        <form className={open === BillPayment.transfer? "form open": "form"} onSubmit={(e) => {
            e.preventDefault()
            useTransfer({username, amount, key,loading, setLoading, dispatch, setUsernameError, setKey_error})
          }} data-title="Transfer Form">
            <TextField
              variant="filled"
              label="username"
              className="inputBox"
              type="tel"
              required
              value={username}
              placeholder="eg troisgamer (must have a troisplay account)."
              onChange={({ target: { value } }) => {
                setUsernamer(value);
              }}
              error={username_error === errorType.fail}
              helperText={username_error === errorType.fail? "No account found with this username.": ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{"  "}</InputAdornment>
              )
            }} 
            />
            <TextField
              variant="filled"
              label="Amount"
              className="inputBox amount"
              type="number"
              required
              value={amount}
              placeholder="00.00"
              onChange={({ target: { value } }) => {
                setAmount(parseFloat(value));
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{fontFamily: "mon_bold"}}>
                    $
                  </InputAdornment>
                )
              }}
              />
            <TextField
              variant="filled"
              label="Betting Key"
              className="inputBox"
              required
              type="password"
              value={key}
              placeholder="Your 6 digit betting key"
              onChange={({ target: { value } }) => {
                if (key_error !== errorType.non) {
                  setKey_error(errorType.non);
                }
                setKey(value);
              }}
              error={key_error === errorType.error || key.length !== 6}
              helperText={key_error === errorType.error? "Incorrect betting key." :key.length !== 6 ? "Betting key should 6 digits long." : ""}
            />
            <Button type="submit" className="btn">Buy</Button>
          </form>
         )
}
