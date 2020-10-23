import { Button, InputAdornment, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { NAIRA } from '../../../constant';
import { useDispatch } from 'react-redux';
import { BillPayment, errorType } from '../../../typescript/enum';
import { usePayBill } from '../../../functions';

export default function Data({open}: {open: BillPayment}) {
    const dispatch = useDispatch()
    const [phone_number, setPhone_number] = useState<string>()
    const [phone_number_error, setPhone_number_error] = useState<errorType>(
        errorType.non
    );
    const [loading, setLoading] = useState<boolean>(false)
    const [key, setKey] = useState<string>("")
    const [amount, setAmount] = useState<number>()
    const [key_error, setKey_error] = useState<errorType>(errorType.non);
    return (
      <form
        className={open === BillPayment.data ? "form open" : "form"}
        onSubmit={(e) => {
          e.preventDefault();
          usePayBill({
            phone_number,
            amount,
            key,
            loading,
            setLoading,
            dispatch,
          });
        }}
        data-title="Data Form"
      >
        <TextField
          variant="filled"
          label="Phone Number"
          className="inputBox"
          type="tel"
          required
          value={phone_number}
          placeholder="Country code include."
          onChange={({ target: { value } }) => {
            if (phone_number_error !== errorType.non) {
              setPhone_number_error(errorType.non);
            }
            setPhone_number(value);
          }}
          error={
            phone_number_error === errorType.warning ||
            phone_number_error === errorType.error
          }
          helperText={
            phone_number_error === errorType.warning
              ? "No account found with this number."
              : phone_number_error === errorType.error
              ? "Invalid phone number."
              : ""
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{"  "}</InputAdornment>
            ),
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
              <InputAdornment
                position="start"
                style={{ fontFamily: "mon_bold" }}
              >
                MB
              </InputAdornment>
            ),
          }}
        />
        <TextField
          variant="filled"
          label="Pin (Betting Key)"
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
          helperText={
            key_error === errorType.error
              ? "Incorrect betting key."
              : key.length !== 6
              ? "Betting key should 6 digits long."
              : ""
          }
        />
        <Button type="submit" className="btn">
          Buy
        </Button>
      </form>
    );
}
