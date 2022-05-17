import SignUp from "./SignUp";
import Webinar from "./Webinar";

import { useState } from "react";

function App() {
  const [actualUser, setActualUser] = useState("");

  return (
    <>
      {actualUser ? (
        <Webinar actualUser={actualUser}></Webinar>
      ) : (
        <SignUp setActualUser={setActualUser}></SignUp>
      )}
    </>
  );
}

export default App;
