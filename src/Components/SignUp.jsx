import styled from "styled-components";
import React, { useEffect, useRef } from "react";
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
      :disabled,
      [disabled] {
        border: 1px solid #999999;
        background-color: #cccccc;
        color: #666666;
        :hover {
          cursor: wait;
        }
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

const inputsInitial = [
  {
    name: "email",
    type: "email",
    placeholder: "Correo electronico",
    validation: null,
    value: "",
  },
  {
    name: "nombre",
    type: "text",
    placeholder: "Nombre",
    validation: null,
    value: "",
    minLength: 4,
  },
];

const SignUp = ({ setActualUser }) => {
  const [inputs, setInputs] = React.useState([]);

  const usersCollectionRef = collection(db, "users");
  let buttonSignUp = useRef(null);

  useEffect(() => {
    getUsers();
    setInputs(inputsInitial);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    buttonSignUp.current.disabled = true;
    allValidation();
    const validation = checkValidation();
    if (validation.every((el) => el == true)) {
      console.log("Validacion correcta");
      createUser();
    } else {
      console.log("Validacion incorrecta");
    }
    buttonSignUp.current.disabled = false;
  };

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
  };

  const createUser = async () => {
    try {
      const userCreate = await addDoc(usersCollectionRef, {
        username: inputs[0].value,
        email: inputs[1].value,
      });
      setActualUser(inputs[1].value);
      buttonSignUp.current.disabled = false;
    } catch (error) {
      console.error(error);
    }
  };

  function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  function isNumberValid(number) {
    const regex = /^[0-9]*$/;
    return regex.test(number);
  }

  const inputChange = (e) => {
    const nameInput = e.target.name;
    const resultado = inputs.map((input) => {
      if (input.name === nameInput) {
        input.value = e.target.value;
        input = oneValidation(input);
      }
      return input;
    });

    setInputs(resultado);
  };

  const checkValidation = () => {
    return inputs.map((input) => {
      return input.validation;
    });
  };

  const allValidation = () => {
    const resultado = inputs.map((input) => {
      input = oneValidation(input);
      return input;
    });

    setInputs(resultado);
  };

  const oneValidation = (input) => {
    const value = input.value;
    if (!value) {
      input.validation = false;
    } else if (value.length < input.minLength) {
      input.validation = false;
    } else {
      switch (input.type) {
        case "text":
          input.validation = true;
          break;
        case "email":
          if (!isEmail(value)) {
            input.validation = false;
          } else {
            input.validation = true;
          }
          break;
        default:
          break;
      }
    }
    return input;
  };

  return (
    <LoginWrappper>
      <form id="signup-form">
        <h1 className="title">Registrate</h1>

        {inputs.map((input, index) => (
          <div
            className={(() => {
              if (input.validation === true) {
                return "form-control success";
              } else if (input.validation === false || null) {
                return "form-control error";
              } else {
                return "form-control";
              }
            })()}
            key={index}
          >
            <small>Error message</small>
            <input
              name={input.name}
              type={input.type}
              onChange={inputChange}
              placeholder={input.placeholder}
            />
            <i className="fas fa-check-circle"></i>
            <i className="fas fa-exclamation-circle"></i>
          </div>
        ))}

        <button type="submit" onClick={handleSubmit} ref={buttonSignUp}>
          Registrarse
        </button>
      </form>
    </LoginWrappper>
  );
};

export default SignUp;
