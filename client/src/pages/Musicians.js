import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Musicians() {
  let { songId } = useParams();
  const [musicians, setMusicians] = useState([]);
  const [name, setName] = useState("");
  const [instrument, setInstrument] = useState("Guitar");
  const { authState } = useContext(AuthContext);

  const { state } = useLocation();
  const eventId = state ? state.eventId : null;

  let navigate = useNavigate();

  // List of available instruments for the dropdown
  const instrumentOptions = [
    "E. Guitar",
    "B. Guitar",
    "Keyboard",
    "Drums",
    "Vocal",
    "Violin",
    "Trumpet",
    "Flute",
    "Saxophone",
    "Cello",
    "Clarinet",
  ];

  useEffect(() => {
    console.log(songId); //  This is printing undefined
    axios.get(`http://localhost:3001/musicians/${songId}`).then((response) => {
      setMusicians(response.data);
    });
  }, [songId]);

  const addMusician = () => {
    axios
      .post(
        "http://localhost:3001/musicians",
        {
          name: name,
          instrument: instrument,
          SongId: songId,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"), // Authorization token
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setMusicians([...musicians, response.data]); // Add new musician to the list
          setName("");
          setInstrument("Guitar"); // Reset the dropdown to default
        }
      });
  };

  const deleteMusician = (id) => {
    axios
      .delete(`http://localhost:3001/musicians/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setMusicians(
          musicians.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deleteSong = () => {
    axios
      .delete(`http://localhost:3001/songs/${songId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate(`/songs/${eventId}`);
      });
  };

  return (
    <div>
      <button onClick={() => deleteSong(songId)}> Delete this song</button>
      <h1>Musicians for Song</h1>

      {/* Form to add a new musician */}
      <div className="addMusicianContainer">
        <input
          type="text"
          placeholder="Name..."
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)} // Handle name input
        />

        <select
          value={instrument}
          onChange={(event) => setInstrument(event.target.value)} // Handle instrument selection
        >
          {/* Create dropdown options for instruments */}
          {instrumentOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button onClick={addMusician}>Add Musician</button>
      </div>

      {musicians.map((musician) => (
        <div key={musician.id} className="musician">
          <h4>{musician.name}</h4>
          <p>Instrument: {musician.instrument}</p>
          <button onClick={() => deleteMusician(musician.id)}>X</button>
        </div>
      ))}
    </div>
  );
}

export default Musicians;
