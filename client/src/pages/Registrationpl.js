import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registrationpl() {
  const initialValues = {
    email: "",
    name: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
  });

  const onSubmit = (data, { resetForm }) => {
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
            id="inputCreatePost"
            name="email"
            placeholder="Enter your email"
          />

          <label>Name: </label>
          <ErrorMessage name="name" component="span" />
          <Field
            type="text"
            id="inputCreatePost"
            name="name"
            placeholder="Enter your name"
          />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registrationpl;
