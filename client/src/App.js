import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Events from "./pages/Events";
import Songs from "./pages/Songs";
import Musicians from "./pages/Musicians";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    admin: 0,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/auth/auth`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            admin: response.data.admin,
          });
        }
      });
    if (localStorage.getItem("accessToken")) {
      setAuthState(true);
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <MainContent authState={authState} setAuthState={setAuthState} />
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

// Separate out the main content so that useNavigate can be used inside the Router
function MainContent({ authState, setAuthState }) {
  const navigate = useNavigate(); // Initialize useNavigate inside Router

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
      admin: 0,
    });
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <>
      <div className="navbar">
        <div className="links">
          {!authState.status ? (
            <>
              <Link to="/login"> Login</Link>
              <Link to="/registration"> Registration</Link>
            </>
          ) : (
            <>
              <Link to="/"> Home Page</Link>
              <Link to="/createpost"> Create A Post</Link>
              <Link to="/events"> Events</Link>
            </>
          )}
        </div>
        <div className="loggedInContainer">
          <h1>
            {authState.status ? (
              <>
                {authState.username} {authState.admin ? "(Admin)" : "(User)"}
              </>
            ) : (
              "Please log in"
            )}
          </h1>
          {authState.status && <button onClick={logout}> Logout</button>}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/events" element={<Events />} />
        <Route path="/songs/:eventId" element={<Songs />} />
        <Route path="/musicians/:songId" element={<Musicians />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     setAuthState({
//       username: "",
//       id: 0,
//       status: false,
//       admin: 0,
//     });
//     // navigate("/home"); // doesn't work
//   };
//   return (
//     <div className="App">
//       <AuthContext.Provider value={{ authState, setAuthState }}>
//         <Router>
//           <div className="navbar">
//             <div className="links">
//               {!authState.status ? (
//                 <>
//                   <Link to="/login"> Login</Link>
//                   <Link to="/registration"> Registration</Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/"> Home Page</Link>
//                   <Link to="/createpost"> Create A Post</Link>
//                 </>
//               )}
//             </div>
//             <div className="loggedInContainer">
//               <h1>
//                 {authState.status ? (
//                   <>
//                     {authState.username}{" "}
//                     {authState.admin ? "(Admin)" : "(User)"}
//                   </>
//                 ) : (
//                   "Please log in"
//                 )}
//               </h1>
//               {authState.status && <button onClick={logout}> Logout</button>}
//             </div>
//           </div>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/createpost" element={<CreatePost />} />
//             <Route path="/post/:id" element={<Post />} />
//             <Route path="/registration" element={<Registration />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/profile/:id" element={<Profile />} />
//             <Route path="changepassword" element={<ChangePassword />} />
//             <Route path="*" element={<PageNotFound />} />
//           </Routes>
//         </Router>
//       </AuthContext.Provider>
//     </div>
//   );
// }

// export default App;
