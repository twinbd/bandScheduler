import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  const goToEventDetail = (eventId) => {
    navigate(`/songs/${eventId}`);
  };

  const addEvent = () => {
    axios
      .post(
        "http://localhost:3001/events",
        {
          title: title,
          year: parseInt(year),
          month: parseInt(month),
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
          setEvents([...events, response.data]); // Add new event to the list
          setTitle("");
          setYear("");
          setMonth("");
        }
      });
  };

  return (
    <div>
      {/* Input fields for adding new events */}
      <div>
        <input
          type="text"
          placeholder="Title..."
          autoComplete="off"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="number"
          placeholder="Month..."
          autoComplete="off"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
        />
        <input
          type="number"
          placeholder="Year..."
          autoComplete="off"
          value={year}
          onChange={(event) => setYear(event.target.value)}
        />

        <button onClick={addEvent}> Add Event</button>
      </div>

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
