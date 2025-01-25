import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Loginpl() {
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    data.baseUrl = process.env.REACT_APP_API_BASE_URL;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/auth/loginpl`, data)
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message); // Notify the user about the login link
          resetForm(); // Reset the form fields
        } else {
          alert("An error occurred.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert(error.response?.data?.message || "An error occurred.");
      });
  };

  return (
    <div>
      <h1>Passwordless Login</h1>
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

          <button type="submit">Send Login Link</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Loginpl;
