import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

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
    navigate(`/musicians/${songId}`);
  };

  return (
    <div>
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
