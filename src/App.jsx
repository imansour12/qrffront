import { useHookstate } from "@hookstate/core";
import appState from "./state/app.state";
import { Button, Typography } from "@mui/material";
import { useState } from "react";

import UploadFile from "./components/UploadFile";
import FillInfo from "./components/FillInfo";
import axios from "axios";

function App() {
  const { step, file } = useHookstate(appState);
  const [userdata, setuserdata] = useState(null);

  if (window.location.search.includes("?id=")) {
    axios
      .get(
        import.meta.env.VITE_BASE_URL +
          "/getinfo?id=" +
          window.location.search.replace("?id=", "")
      )
      .then((res) => {
        console.log(res.data);
        setuserdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#242424",
          color: "white",
          flexDirection: "column",
        }}
      >
        {userdata ? (
          <>
            <Typography textAlign={"center"} variant="h3">
              {userdata}
            </Typography>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242424",
        color: "white",
        flexDirection: "column",
      }}
    >
      {step.get() === 1 ? (
        <UploadFile />
      ) : step.get() == 2 ? (
        <FillInfo />
      ) : (
        <h1>Step 3</h1>
      )}
      {step.get() != 1 ? (
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: "1.2rem",
          }}
          onClick={() => {
            step.set(step.get() - 1);
          }}
        >
          Go back
        </Button>
      ) : null}
    </div>
  );
}

export default App;
