import styled from "styled-components";
import React, { useEffect } from "react";
import { db } from "../firebase.config";
import { addDoc, collection, getDocs } from "firebase/firestore";

const LoginWrappper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  box-sizing: border-box;

  form {
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 297px;
    height: 263px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    padding: 20px 0px 39px 0px;

    h1 {
      font-weight: 700;
      font-size: 20px;
      font-style: normal;
      line-height: 23px;
      margin-bottom: 30px;
    }
    button,
    input {
      width: 212px;
      height: 35px;
      font-weight: 400;
      font-family: "Roboto", sans-serif;
      font-size: 15px;
    }

    input {
      background: rgba(196, 196, 196, 0.15);
      border: 1px solid #a9a9a9;
      border-radius: 0px;
      margin-bottom: 25px;
      font-family: "Roboto", sans-serif;
    }

    button {
      height: 35px;
      border: 1px solid #0c6dce;
      box-sizing: border-box;
      background: #ffffff;
      font-style: normal;
      font-weight: 700;
      font-size: 15px;
      color: #0c6dce;
      :hover {
        cursor: pointer;
        background-color: #0c6dce;
        color: white;
      }
    }

    .form-control.error {
      input {
        border: 2px red solid;
      }
      i.fa-exclamation-circle {
        visibility: visible;
      }
    }
    .form-control.success {
      input {
        border: 2px green solid;
      }
      i.fa-check-circle {
        visibility: visible;
      }
    }

    .form-control {
      position: relative;
      small {
        position: absolute;
        bottom: 10px;
        visibility: hidden;
      }
      i {
        position: absolute;
        top: 10px;
        right: 5px;
        visibility: hidden;
      }
      .fa-check-circle {
        color: green;
      }
      .fa-exclamation-circle {
        color: red;
      }
    }
  }
`;

const SignUp = ({ setActualUser }) => {
  const [email, setEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [errors, setErrors] = React.useState(0);

  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    console.log(data.docs.map((doc) => ({ ...doc.data() })));
  };

  const createUser = async () => {
    try {
      const userCreate = await addDoc(usersCollectionRef, {
        username: userName,
        email: email,
      });
      setActualUser(userName);
    } catch (error) {
      console.error(error);
    }
  };

  const mailChange = (e) => {
    setEmail(e.target.value);
    inputValidation(e);
  };

  const userNameChange = (e) => {
    setUserName(e.target.value);
    inputValidation(e);
  };

  function inputValidation(e) {
    const input = e.target;
    const value = e.target.value;
    let isValid = false;

    if (value === "" || null) {
      setErrorFor(input, `${input.getAttribute("placeholder")} is required`);
    } else {
      const minLength = input.getAttribute("minlength");
      const maxLength = input.getAttribute("maxLength");
      const size = input.getAttribute("size");
      switch (input.getAttribute("type")) {
        case "text":
          setSuccessFor(input);
          isValid = true;
          break;
        case "password":
          if (minLength && value.length < minLength) {
            setErrorFor(
              input,
              `${input.getAttribute(
                "placeholder"
              )} length must be at least ${minLength}`
            );
          } else if (size && value.length != Number(size)) {
            setErrorFor(
              input,
              `${input.getAttribute("placeholder")} length must be ${size}`
            );
          } else {
            setSuccessFor(input);
            isValid = true;
          }
          break;
        case "tel":
          if (!isNumberValid(value)) {
            setErrorFor(
              input,
              `${input.getAttribute("placeholder")} must be a number`
            );
          } else if (minLength && value.length < minLength) {
            setErrorFor(
              input,
              `${input.getAttribute(
                "placeholder"
              )} length must be at least ${minLength}`
            );
          } else if (size && value.length != Number(size)) {
            setErrorFor(
              input,
              `${input.getAttribute("placeholder")} length must be ${size}`
            );
          } else {
            setSuccessFor(input);
            isValid = true;
          }
          break;
        case "email":
          if (!isEmail(value)) {
            setErrorFor(
              input,
              `${input.getAttribute("placeholder")} is not valid`
            );
          } else {
            setSuccessFor(input);
            isValid = true;
          }
          break;
        default:
          break;
      }
    }

    return isValid;
  }

  function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  function isNumberValid(number) {
    const regex = /^[0-9]*$/;
    return regex.test(number);
  }

  function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");
    formControl.className = "form-control error";
    small.innerText = message;
  }

  function setSuccessFor(input) {
    const formControl = input.parentElement;
    console.log(formControl);
    formControl.className = "form-control success";
  }

  return (
    <LoginWrappper>
      <form id="signup-form">
        <h1 className="title">Registrate</h1>
        <div className="form-control">
          <small>Error message</small>
          <input type="email" onChange={mailChange} placeholder="Correo" />
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div className="form-control">
          <small>Error message</small>
          <input type="text" onChange={userNameChange} placeholder="Nombre" />
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <button type="submit" onClick={handleSubmit}>
          Registrarse
        </button>
      </form>
    </LoginWrappper>
  );
};

export default SignUp;
