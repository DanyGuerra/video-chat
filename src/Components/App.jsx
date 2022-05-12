import SignUp from "./SignUp";
import ChatRoom from "./ChatRoom";
import { useState } from "react";

function App() {
  const [actualUser, setActualUser] = useState("");

  return (
    <>
      {actualUser ? (
        <ChatRoom actualUser={actualUser}></ChatRoom>
      ) : (
        <SignUp setActualUser={setActualUser}></SignUp>
      )}
    </>
  );
}

export default App;
