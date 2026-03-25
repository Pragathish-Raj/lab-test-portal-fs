import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { testsAPI } from "../../services/api";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    const filtered = tests.filter(
      (test) =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTests(filtered);
  }, [searchTerm, tests]);

  const fetchTests = async () => {
    try {
      const response = await testsAPI.getAll();
      setTests(response.data);
      setFilteredTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading tests...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Lab Tests
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search tests by name, description, or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredTests.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No tests found matching your search.</Typography>
          </Grid>
        ) : (
          filteredTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {test.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {test.description}
                  </Typography>
                  <Box sx={{ mt: "auto" }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      ₹{test.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Category: {test.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Duration: {test.duration} minutes
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to={`/book-appointment/${test._id}`}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default TestList;
