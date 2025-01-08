import React, { useState, useEffect } from "react";
import axios from "axios";

function Members() {
  const [role, setRole] = useState("user"); // Default to "user"
  const [members, setMembers] = useState([]);

  // Fetch members based on selected role
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/auth/members`,
          {
            params: { role }, // Pass the role as a query parameter
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );
        console.log(response);
        setMembers(response.data); // Update members list
      } catch (error) {
        console.error("Error fetching members:", error);
        alert("Failed to fetch members.");
      }
    };

    fetchMembers();
  }, [role]); // Refetch whenever the role changes

  // Delete a user
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/auth/members/${id}`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );
        // Update the list after successful deletion
        setMembers(members.filter((member) => member.id !== id));
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div>
      <h1>Members Page</h1>

      {/* Role Selector */}
      <div>
        <label htmlFor="role-select">Select Role:</label>
        <select
          id="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Members List */}
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.username}
            {role === "user" && (
              <button
                style={{ marginLeft: "10px", color: "red" }}
                onClick={() => deleteUser(member.id)}
              >
                X
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Members;
