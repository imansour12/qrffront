import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useHookstate } from "@hookstate/core";
import appState from "../state/app.state";
import QRCode, { QRCodeCanvas } from "qrcode.react";

export default function FillInfo() {
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [resid, setresid] = useState(null);
  const { file } = useHookstate(appState);

  const [formData, setFormData] = useState({
    reference: "",
    date: null,
    subject: "",
    sender: "",
    receiver: "",
  });

  const handleChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAutoFill = async () => {
    try {
      console.log(import.meta.env.VITE_BASE_URL + "/upload");
      const formBB = new FormData();
      formBB.append("file", file.get().file);
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "/upload",
        formBB,
        {
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );
      console.log(response.data);
      setFormData({
        reference: response.data.Reference,
        date: new Date(response.data.Date),
        subject: response.data.Subject,
        sender: response.data.Sender,
        receiver: response.data.Receiver,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    if (
      formData.reference.length > 0 &&
      formData.date &&
      formData.subject.length > 0 &&
      formData.sender.length > 0 &&
      formData.receiver.length > 0
    ) {
      let res = await axios.post(
        import.meta.env.VITE_BASE_URL + "/uploadinfo",
        {
          reference: formData.reference,
          date: formData.date,
          subject: formData.subject,
          sender: formData.sender,
          receiver: formData.receiver,
        }
      );
      setresid(res.data.id);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const inputStyles = {
    marginBottom: "20px",
    width: "300px",
    background: "#8f8f8f", // Dark background color
  };

  const buttonStyles = {
    marginBottom: "10px",
    color: "white",
    backgroundColor: "#4caf50", // Green color for buttons
    marginRight: "10px", // Added margin between buttons
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ color: "white", marginTop: "20px" }}
    >
      <TextField
        label="Reference"
        variant="outlined"
        value={formData.reference}
        onChange={(e) => handleChange("reference")(e.target.value)}
        margin="normal"
        style={inputStyles}
        InputLabelProps={{
          style: { color: "white" },
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          inputFormat="MM/dd/yyyy"
          value={formData.date}
          onChange={(value) => handleChange("date")(value)}
          sx={{ color: "white", backgroundColor: "#8f8f8f", width: "300px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              style={{ color: "white" }}
              sx={{ color: "white" }}
              InputLabelProps={{
                sx: { color: "white" },
              }}
            />
          )}
        />
      </LocalizationProvider>
      <TextField
        label="Subject"
        variant="outlined"
        value={formData.subject}
        onChange={(e) => handleChange("subject")(e.target.value)}
        style={inputStyles}
        margin="normal"
        InputLabelProps={{
          style: { color: "white" },
        }}
      />
      <TextField
        label="Sender"
        variant="outlined"
        value={formData.sender}
        onChange={(e) => handleChange("sender")(e.target.value)}
        style={inputStyles}
        margin="normal"
        InputLabelProps={{
          style: { color: "white" },
        }}
      />
      <TextField
        label="Receiver"
        variant="outlined"
        value={formData.receiver}
        onChange={(e) => handleChange("receiver")(e.target.value)}
        style={inputStyles}
        margin="normal"
        InputLabelProps={{
          style: { color: "white" },
        }}
      />
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          onClick={handleAutoFill}
          style={buttonStyles}
          disabled={autofillLoading}
        >
          Try to Autofill
        </Button>
        <Button variant="contained" onClick={handleSubmit} style={buttonStyles}>
          Submit
        </Button>
      </Box>
      {resid ? (
        <>
          <Typography variant="h5" textAlign={"center"} mb={2}>
            Add the below qr code to your document !
          </Typography>
          <QRCodeCanvas
            style={{ marginBottom: 20 }}
            value={window.location.origin + "?id" + resid}
          />
        </>
      ) : null}
    </Box>
  );
}
