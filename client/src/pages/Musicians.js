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

  // filter musicians based on status
  const rejectedMusicians = musicians.filter(
    (musician) => musician.status === 2
  );
  const requestedMusicians = musicians.filter(
    (musician) => musician.status === 0
  );
  const acceptedMusicians = musicians.filter(
    (musician) => musician.status === 1
  );

  const pendingRequest = musicians.filter(
    (musician) => musician.status === 0 && musician.requesterId === authState.id
  );

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
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/musicians/${songId}`).then((response) => {
      setMusicians(response.data);
    });

    axios.get("${process.env.REACT_APP_API_BASE_URL}/auth/allusers").then((response) => {
      setUsers(response.data);
    });

    if (!authState.admin) {
      setName(authState.username); // Pre-fill with the logged-in user's name
    }
  }, [songId, authState]);

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
    if (!!authState.admin && !userExists) {
      alert("Please select a valid user from the dropdown.");
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/musicians`,
        {
          name: name,
          instrument: instrument,
          status: !!authState.admin ? 1 : 0,
          requesterId: authState.id,
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
          if (!!authState.admin) {
            setName("");
          }
          setInstrument("Guitar"); // Reset the dropdown to default
        }
      });
  };

  // Function to handle musician status update (accept/reject/undo)
  const updateMusicianStatus = (musicianId, newStatus) => {
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/musicians/status/${musicianId}`,
        { status: newStatus },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        setMusicians(
          musicians.map((musician) =>
            musician.id === musicianId
              ? { ...musician, status: newStatus }
              : musician
          )
        );
      })
      .catch((error) => {
        console.error("Error updating musician status:", error);
      });
  };

  const deleteMusician = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/musicians/${id}`, {
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
      .delete(`${process.env.REACT_APP_API_BASE_URL}/songs/${songId}`, {
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
          placeholder={
            !!authState.admin ? "Search for a user..." : "Your username"
          }
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)} // Handle input change
          onBlur={validateName} // Validate the name when the user clicks away
          disabled={!authState.admin} // Disable input for non-admins
        />

        {/* Datalist for user suggestions (Only used for admin users) */}
        {!!authState.admin && (
          <datalist id="usernames">
            {users.map((user) => (
              <option key={user.id} value={user.username} />
            ))}
          </datalist>
        )}

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

        <button onClick={() => addMusician()}>
          {" "}
          {!!authState.admin ? "Add Musician" : "Request to Sign Up"}
        </button>
      </div>

      {/* Flex container for Rejected, Requested, and Accepted musicians */}
      {!!authState.admin && (
        <div className="musicians-container">
          {/* Rejected Musicians */}
          <div className="rejected-musicians">
            <h2>Rejected Musicians:</h2>
            {rejectedMusicians.map((musician) => (
              <div key={musician.id} className="musician">
                <h3>{musician.name}</h3>
                <p>Instrument: {musician.instrument}</p>
                <button
                  className="accept-button"
                  onClick={() => updateMusicianStatus(musician.id, 0)}
                >
                  Undo
                </button>
                <button
                  className="reject-button"
                  onClick={() => deleteMusician(musician.id)}
                >
                  Permanently DELETE
                </button>
              </div>
            ))}
          </div>

          {/* Requested Musicians */}
          <div className="requested-musicians">
            <h2>Requested Musicians:</h2>
            {requestedMusicians.map((musician) => (
              <div key={musician.id} className="musician">
                <h3>{musician.name}</h3>
                <p>Instrument: {musician.instrument}</p>
                <button
                  className="accept-button"
                  onClick={() => updateMusicianStatus(musician.id, 1)}
                >
                  Accept
                </button>
                <button
                  className="reject-button"
                  onClick={() => updateMusicianStatus(musician.id, 2)}
                >
                  Reject
                </button>
              </div>
            ))}
          </div>

          {/* Accepted Musicians */}
          <div className="accepted-musicians">
            <h2>Accepted Musicians:</h2>
            {acceptedMusicians.map((musician) => (
              <div key={musician.id} className="musician">
                <h3>{musician.name}</h3>
                <p>Instrument: {musician.instrument}</p>
                <button
                  className="reject-button"
                  onClick={() => updateMusicianStatus(musician.id, 0)}
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-admin View */}
      {!authState.admin && (
        <div className="musicians-container">
          {/* Pending Request */}
          {pendingRequest.length > 0 && (
            <div className="pending-request">
              <h2>Your Pending Requests:</h2>
              <p
                style={{ fontSize: "12px", fontStyle: "italic", color: "#555" }}
              >
                If your request doesn't show up here anymore, it has been either
                accepted or rejected.
              </p>
              {pendingRequest.map((musician) => (
                <div key={musician.id} className="musician">
                  <h4>{musician.name}</h4>
                  <p>Instrument: {musician.instrument}</p>
                </div>
              ))}
            </div>
          )}

          {/* Accepted Musicians */}
          <div className="accepted-musicians">
            <h2>Accepted Musicians:</h2>
            {acceptedMusicians.map((musician) => (
              <div key={musician.id} className="musician">
                <h4>{musician.name}</h4>
                <p>Instrument: {musician.instrument}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Musicians;
