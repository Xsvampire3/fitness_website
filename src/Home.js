import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./styles.css";
import {
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import { Chip } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [numResults, setNumResults] = useState(6);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to make API call with debounce
    let debounceTimeout;

    const fetchVideos = async () => {
      // Check if searchQuery is empty
      if (!searchQuery) {
        setVideos([]); // Clear previous results
        setError(null); // Clear previous errors
        return; // Exit early, don't make an API request
      }

      try {
        const response = await fetch(
          `https://asia-south1-socialboat-dev.cloudfunctions.net/assignmentVideos?q=${searchQuery}&numResults=${numResults}`
        );
        if (response.ok) {
          const data = await response.json();
          if (
            data.status === "success" &&
            data.results &&
            data.results.length > 0
          ) {
            setVideos(data.results);
          } else {
            setError("No videos found.");
          }
        } else {
          setError("Error fetching data. Please try again later.");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
        console.error("Error fetching data:", error);
      }
    };

    // Debounce the API call
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchVideos();
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery, numResults]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNumResultsChange = (event) => {
    setNumResults(event.target.value);
  };

  return (
    <Container className="background-image" maxWidth="lg">
      <header>
        <Navbar />
        <Grid
          container
          spacing={2}
          alignItems="center"
          marginTop="10px"
          marginBottom="10px"
          justifyContent="center"
        >
          <Grid item xs={6}>
            {/* Search bar */}
            <TextField
              fullWidth
              variant="outlined"
              label="Search videos..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              style={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            {/* Number of Results Dropdown */}
            <Select
              label="Results"
              value={numResults}
              onChange={handleNumResultsChange}
              style={{ background: "white" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </header>

      {/* Results */}
      <div className="results">
        {error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : Array.isArray(videos) && videos.length > 0 ? (
          <Grid container spacing={2}>
            {videos.map((video, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <CardMedia component="video" src={video.video} controls />
                  <CardContent>
                    <Typography variant="h6">{video.heading}</Typography>
                    <div>
                      {video.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          variant="outlined"
                          color="primary"
                          size="small"
                          style={{ marginRight: "4px", marginBottom: "4px" }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div style={{ paddingBottom: "100vh" }}>
            <div className="banner">
              <h1>Welcome to Fitness Videos</h1>
              <p>Get fit and healthy with our workout videos</p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Home;
