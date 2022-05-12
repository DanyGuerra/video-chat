import React from "react";

const ChatRoom = ({ actualUser }) => {
  const [email, setEmail] = React.useState("");
  const [contra, setContra] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const mailChange = (e) => {
    setEmail(e.target.value);
  };

  const contraChange = (e) => {
    setContra(e.target.value);
  };

  return (
    <>
      <h2>{actualUser}</h2>
      <h1>This is the Chatroom</h1>
      <>Messages</>
    </>
  );
};

export default ChatRoom;
