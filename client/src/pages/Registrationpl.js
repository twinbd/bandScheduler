import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registrationpl() {
  const initialValues = {
    email: "",
    name: "",
    intro: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
      name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
      intro: Yup.string()
      .min(3, "Intro must be at least 3 characters")
      .required("Intro is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    data.baseUrl = process.env.REACT_APP_API_BASE_URL;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/signups/signup`, data)
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message); // Notify the user about signup success
          resetForm(); // Reset the form fields
        } else {
          alert("An error occurred.");
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        alert(error.response?.data?.message || "An error occurred.");
      });
  };

  return (
    <div>
      <h1>Passwordless Registration</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Email: </label>
          <ErrorMessage name="email" component="span" />
          <Field
            type="email"
            id="emailInput"
            name="email"
            placeholder="Enter your email"
          />

          <label>Name: </label>
          <ErrorMessage name="name" component="span" />
          <Field
            type="text"
            id="nameInput"
            name="name"
            placeholder="Enter your name"
          />

          <label>Short Intro.: </label>
          <ErrorMessage name="intro" component="span" />
          <Field
            type="text"
            id="introInput"
            name="intro"
            placeholder="Short introduction about yourself"
          />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registrationpl;
