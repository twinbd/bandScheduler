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

  const requestedSongs = songs.filter((song) => song.status === 0);
  const acceptedSongs = songs.filter((song) => song.status === 1);
  // Check if the user has already requested a song
  const userRequestedSong = songs.find(
    (song) => song.requesterId === authState.id
  );

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
          status: authState.admin ? 1 : 0,
          EventId: eventId,
          requesterId: authState.id,
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

      <h1>{authState.admin ? "Add New Song" : "Request New Song"}</h1>

      {/* Only show the form if the user hasn't requested a song yet */}
      {!authState.admin && userRequestedSong ? (
        <div className="official-message">
          <p>
            You have already requested a Song for this Event!
            <br />
            If this was a mistake, please contact the admin
          </p>
        </div>
      ) : (
        <Formik
          initialValues={{ title: "", artist: "", link: "" }} // Initial values
          onSubmit={onSubmit} // Form submission handler
          validationSchema={songSchema} // Attach validation schema
        >
          <Form className="formContainer">
            <label>Title: </label>
            <ErrorMessage name="title" component="span" className="error" />
            <Field
              name="title"
              placeholder="Song Title"
              className="inputField"
            />

            <label>Artist: </label>
            <ErrorMessage name="artist" component="span" className="error" />
            <Field name="artist" placeholder="Artist" className="inputField" />

            <label>Link: </label>
            <ErrorMessage name="link" component="span" className="error" />
            <Field name="link" placeholder="Link" className="inputField" />

            <button type="submit">
              {authState.admin ? "Add Song" : "Request Song"}
            </button>
          </Form>
        </Formik>
      )}

      {/* Flex container for Requested and Accepted songs */}
      {!!authState.admin && (
        <div className="songs-container">
          {/* Requested Songs */}
          <div className="requested-songs">
            <h2>Requested Songs:</h2>
            {requestedSongs.map((song) => (
              <div key={song.id} className="song">
                <h3>{song.title}</h3>
                <p>Artist: {song.artist}</p>
                <p>Status: Requested</p>
              </div>
            ))}
          </div>

          {/* Accepted Songs */}
          <div className="accepted-songs">
            <h2>Accepted Songs:</h2>
            {acceptedSongs.map((song) => (
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
        </div>
      )}
      {/* Non-admin view: Accepted Songs in the center */}
      {!authState.admin && (
        <div className="centered-accepted-songs">
          <h2>Accepted Songs</h2>
          {acceptedSongs.map((song) => (
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
      )}
    </div>
  );
}

export default Songs;
