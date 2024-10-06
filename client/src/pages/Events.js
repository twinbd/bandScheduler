import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Events() {
  const [events, setEvents] = useState([]);
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

  return (
    <div>
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
