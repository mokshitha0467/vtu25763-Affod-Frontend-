import React from "react";
import { Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import "./App.css";

function App() {
  const mockData = [
    { id: 1, title: "Google hiring drive tomorrow", notification_type: "Placement", timestamp: "2024-06-17T10:30:00Z" },
    { id: 2, title: "Amazon internship shortlist", notification_type: "Placement", timestamp: "2024-06-17T08:30:00Z" },
    { id: 3, title: "Infosys campus drive", notification_type: "Placement", timestamp: "2024-06-16T10:30:00Z" },
    { id: 4, title: "TCS hiring open", notification_type: "Placement", timestamp: "2024-06-15T10:30:00Z" },
    { id: 5, title: "Semester results released", notification_type: "Result", timestamp: "2024-06-17T09:30:00Z" },
    { id: 6, title: "Internal marks published", notification_type: "Result", timestamp: "2024-06-17T07:30:00Z" },
    { id: 7, title: "Revaluation results out", notification_type: "Result", timestamp: "2024-06-10T10:30:00Z" },
    { id: 8, title: "Semester timetable updated", notification_type: "Result", timestamp: "2024-06-09T10:30:00Z" }
  ];

  const [list, setList] = React.useState(mockData);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [type, setType] = React.useState("All");
  const [clicked, setClicked] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [logged, setLogged] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(function() {
    setLoading(true);
    fetch("http://4.224.186.213/evaluation-service/notifications?limit=" + limit + "&page=" + page)
      .then(r => r.json())
      .then(d => setList(d.notifications || mockData))
      .catch(() => setList(mockData))
      .finally(() => setLoading(false));
  }, [limit, page]);

  const sorted = list.sort(function(a, b) {
    const rank = function(t) { return t === "Placement" ? 3 : t === "Result" ? 2 : 1; };
    if (rank(a.notification_type) !== rank(b.notification_type)) {
      return rank(b.notification_type) - rank(a.notification_type);
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const filtered = type === "All" ? sorted : sorted.filter(n => n.notification_type === type);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);
  const totalPages = Math.ceil(filtered.length / limit);

  function clickCard(id) {
    if (!clicked.includes(id)) {
      setClicked([...clicked, id]);
    }
  }

  function submitLogin() {
    if (user === "mokshitha" && pass === "1234") {
      setLogged(true);
      setError("");
    } else {
      setError("Wrong username or password");
    }
  }

  if (!logged) {
    return (
      <div className="loginPage">
        <div className="loginBox">
          <h1>Student Login</h1>
          <label>User name</label>
          <input value={user} onChange={function(e) { setUser(e.target.value); }} />
          <label>Password</label>
          <input type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} />
          {error ? <div className="loginError">{error}</div> : null}
          <button className="loginButton" onClick={submitLogin}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashContainer">
      <div className="dashSidebar">
        <h2>Notifications</h2>
        <div className="dashStats">
          <div className="dashStatCard">
            <span className="dashStatNum">4</span>
            <span className="dashStatLabel">Placements</span>
          </div>
          <div className="dashStatCard">
            <span className="dashStatNum">4</span>
            <span className="dashStatLabel">Results</span>
          </div>
        </div>
        <FormControl fullWidth size="small" sx={{ marginBottom: "15px" }}>
          <InputLabel>Filter</InputLabel>
          <Select value={type} label="Filter" onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Per Page</InputLabel>
          <Select value={limit} label="Per Page" onChange={(e) => { setLimit(e.target.value); setPage(1); }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="dashMain">
        <div className="dashTopBar">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Campus Notifications</h1>
            <button onClick={function() { setLogged(false); setUser(""); setPass(""); }}>Logout</button>
          </div>
        </div>

        <div className="dashFeed">
          {loading ? <div className="dashLoading">Loading...</div> : null}
          {!loading && paged.length === 0 ? <div className="dashEmpty">No notifications</div> : null}
          {!loading && paged.length > 0 ? (
            <div className="dashCardList">
              {paged.map(function(item) {
                return (
                  <div key={item.id} className={clicked.includes(item.id) ? "dashCard opened-card" : "dashCard new-card"} onClick={function() { clickCard(item.id); }}>
                    <div className="dashCardHeader">
                      <h3>{item.title}</h3>
                      <span className="dashTag">{item.notification_type}</span>
                    </div>
                    <div className="dashCardStatus">{clicked.includes(item.id) ? "Viewed" : "New"}</div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {!loading && filtered.length > 0 ? (
          <div className="dashPagination">
            <Button variant="contained" onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }} disabled={page === 1}>Previous</Button>
            <span className="dashPageInfo">Page {page} of {totalPages}</span>
            <Button variant="contained" onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }} disabled={page === totalPages}>Next</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
