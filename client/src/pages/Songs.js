import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Songs() {
  let { eventId } = useParams();
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
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

  const addSong = () => {
    axios
      .post(
        "http://localhost:3001/songs",
        {
          title: title,
          artist: artist,
          link: link,
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
          setTitle("");
          setArtist("");
          setLink("");
        }
      });
  };

  return (
    <div>
      <button onClick={() => deleteEvent(eventId)}> Delete this event</button>
      <div>
        <input
          type="text"
          placeholder="Title..."
          autoComplete="off"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="text"
          placeholder="Artist..."
          autoComplete="off"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />
        <input
          type="text"
          placeholder="Link..."
          autoComplete="off"
          value={link}
          onChange={(event) => setLink(event.target.value)}
        />
        <button onClick={addSong}> Add Song</button>
      </div>

      <h1>Songs for Event</h1>
      {songs.map((song) => (
        <div
          key={song.id}
          className="song"
          onClick={() => goToSongDetail(song.id)}
        >
          <h3>{song.title}</h3>
          <p>Artist: {song.artist}</p>
        </div>
      ))}
    </div>
  );
}

export default Songs;
