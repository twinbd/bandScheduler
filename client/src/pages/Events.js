import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AuthContext } from "../helpers/AuthContext";

function Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/events").then((response) => {
      setEvents(response.data);
    });
  }, []);

  // Validation schema with Yup
  const eventSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    year: Yup.number()
      .required("Year is required")
      .min(2008, "Year must be after 2008")
      .max(2100, "You don't need to plan for that far future"),
    month: Yup.number()
      .required("Month is required")
      .min(1, "Month must be between 1 and 12")
      .max(12, "Month must be between 1 and 12"),
  });

  const onSubmit = (data, { resetForm }) => {
    axios
      .post(
        "http://localhost:3001/events",
        {
          title: data.title,
          year: parseInt(data.year),
          month: parseInt(data.month),
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setEvents([...events, response.data]); // Add new event to the list
        resetForm(); // Reset form after submission
      });
  };

  const goToEventDetail = (eventId) => {
    navigate(`/songs/${eventId}`);
  };

  return (
    <div>
      <h1>Add New Event</h1>
      <Formik
        initialValues={{ title: "", year: "", month: "" }} // Set initial values
        onSubmit={onSubmit} // Form submission handler
        validationSchema={eventSchema} // Attach validation schema
      >
        <Form className="formContainer">
          {/* Title input field */}
          <label>Title: </label>
          <ErrorMessage name="title" component="span" className="error" />{" "}
          {/* Display error */}
          <Field
            name="title"
            placeholder="Event Title"
            className="inputField"
          />
          {/* Month input field */}
          <label>Month: </label>
          <ErrorMessage name="month" component="span" className="error" />{" "}
          {/* Display error */}
          <Field
            name="month"
            placeholder="Event Month"
            className="inputField"
          />
          {/* Year input field */}
          <label>Year: </label>
          <ErrorMessage name="year" component="span" className="error" />{" "}
          {/* Display error */}
          <Field name="year" placeholder="Event Year" className="inputField" />
          <button type="submit">Add Event</button>
        </Form>
      </Formik>

      <h1>Events</h1>
      {events.map((event) => (
        <div
          key={event.id}
          className="event"
          onClick={() => goToEventDetail(event.id)}
        >
          <h2>{event.title}</h2>
          <p>
            {event.year}-{event.month}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Events;
