import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Musicians() {
  let { songId } = useParams();
  const [musicians, setMusicians] = useState([]);
  const [name, setName] = useState("");
  const [instrument, setInstrument] = useState("Guitar");
  const [users, setUsers] = useState([]); // Store all users
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

    axios.get("http://localhost:3001/auth/allusers").then((response) => {
      setUsers(response.data);
    });
  }, [songId]);

  // Check if the selected name exists in the users list
  const validateName = () => {
    const userExists = users.some((user) => user.username === name);
    if (!userExists) {
      setName(""); // Reset name if invalid
      // alert("Please select a valid user from the list.");
    }
  };

  const addMusician = () => {
    // Ensure a valid user is selected
    const userExists = users.some((user) => user.username === name);
    if (!userExists) {
      alert("Please select a valid user from the dropdown.");
      return;
    }

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
      <button onClick={() => navigate(`/songs/${eventId}`)}>
        Back to Songs
      </button>
      <button onClick={() => deleteSong(songId)}> Delete this song</button>
      <h1>Musicians for Song</h1>

      {/* Form to add a new musician */}
      <div className="addMusicianContainer">
        <input
          type="text"
          list="usernames" // Use datalist for dropdown in input
          placeholder="Search for a user..."
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)} // Handle input change
          onBlur={validateName} // Validate the name when the user clicks away
        />

        {/* Datalist for user suggestions */}
        <datalist id="usernames">
          {users.map((user) => (
            <option key={user.id} value={user.username} />
          ))}
        </datalist>

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
