import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Musicians() {
  let { songId } = useParams();
  const [musicians, setMusicians] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/musicians/${songId}`).then((response) => {
      setMusicians(response.data);
    });
  }, [songId]);

  return (
    <div>
      <h1>Musicians for Song</h1>
      {musicians.map((musician) => (
        <div key={musician.id} className="musician">
          <h4>{musician.name}</h4>
          <p>Instrument: {musician.instrument}</p>
        </div>
      ))}
    </div>
  );
}

export default Musicians;
