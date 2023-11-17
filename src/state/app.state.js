import { hookstate } from "@hookstate/core";

const appState = hookstate({
  step: 1,
  file: null,
});

export default appState;
