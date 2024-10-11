import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

function Songs() {
  let { eventId } = useParams();
  const [songs, setSongs] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/songs/${eventId}`).then((response) => {
      setSongs(response.data);
    });
  }, [eventId]);

  const goToSongDetail = (songId) => {
    console.log(songId);
    navigate(`/musicians/${songId}`, { state: { eventId } });
  };

  const deleteEvent = (id) => {
    axios
      .delete(`http://localhost:3001/events/${eventId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/events");
      });
  };

  // Validation schema with Yup for the songs form
  const songSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    artist: Yup.string().required("Artist is required"),
    link: Yup.string().required("Link is required"),
    // Use this line of code for actual production
    // link: Yup.string().url("Invalid URL").required("Link is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    axios
      .post(
        "http://localhost:3001/songs",
        {
          title: data.title,
          artist: data.artist,
          link: data.link,
          EventId: eventId,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setSongs([...songs, response.data]); // Add new song to the list
          resetForm(); // Reset form after submission
        }
      });
  };

  return (
    <div>
      <button onClick={() => navigate(`/events`)}>Back to Events</button>
      <button onClick={deleteEvent}>Delete this event</button>

      <h1>Add New Song</h1>
      <Formik
        initialValues={{ title: "", artist: "", link: "" }} // Initial values
        onSubmit={onSubmit} // Form submission handler
        validationSchema={songSchema} // Attach validation schema
      >
        <Form className="formContainer">
          {/* Title input field */}
          <label>Title: </label>
          <ErrorMessage name="title" component="span" className="error" />{" "}
          {/* Error message */}
          <Field name="title" placeholder="Song Title" className="inputField" />
          {/* Artist input field */}
          <label>Artist: </label>
          <ErrorMessage name="artist" component="span" className="error" />{" "}
          {/* Error message */}
          <Field name="artist" placeholder="Artist" className="inputField" />
          {/* Link input field */}
          <label>Link: </label>
          <ErrorMessage name="link" component="span" className="error" />{" "}
          {/* Error message */}
          <Field name="link" placeholder="Link" className="inputField" />
          <button type="submit">Add Song</button>
        </Form>
      </Formik>

      <h1>Songs for Event</h1>
      {songs.map((song) => (
        <div
          key={song.id}
          className="song"
          onClick={() => goToSongDetail(song.id)}
        >
          <h3>{song.title}</h3>
          <p>Artist: {song.artist}</p>
          <p>Link: {song.link}</p>
        </div>
      ))}
    </div>
  );
}

export default Songs;
