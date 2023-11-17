import { Dropzone } from "@dropzone-ui/react";
import { useHookstate } from "@hookstate/core";
import appState from "../state/app.state";

export default function UploadFile() {
  const { step, file } = useHookstate(appState);
  return (
    <Dropzone
      onChange={(files) => {
        file.set(files[0]);
        step.set(2);
      }}
      accept="application/pdf"
      style={{
        width: "50%",
        height: "50%",
      }}
      multiple={false}
    >
      <h1>Uploading a file</h1>
    </Dropzone>
  );
}
