import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { testsAPI, appointmentsAPI, resultsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const [tests, setTests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [testsRes, appointmentsRes, resultsRes] = await Promise.all([
        testsAPI.getAll(),
        appointmentsAPI.getByUser(user.id),
        resultsAPI.getByPatient(user.id),
      ]);

      setTests(testsRes.data.slice(0, 4));
      setAppointments(appointmentsRes.data.slice(0, 3));
      setResults(resultsRes.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tests Available
              </Typography>
              <Typography variant="h5">{tests.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Your Appointments
              </Typography>
              <Typography variant="h5">{appointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Results Available
              </Typography>
              <Typography variant="h5">{results.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="contained" component={Link} to="/tests">
                Book New Test
              </Button>
              <Button variant="outlined" component={Link} to="/appointments">
                View Appointments
              </Button>
              <Button variant="outlined" component={Link} to="/results">
                View Results
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Appointments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Appointments
              </Typography>
              {appointments.length === 0 ? (
                <Typography color="textSecondary">
                  No appointments found
                </Typography>
              ) : (
                appointments.map((appointment) => (
                  <Box
                    key={appointment._id}
                    sx={{
                      mb: 2,
                      p: 1,
                      border: "1px solid #eee",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {appointment.test?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date:{" "}
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {appointment.status}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Results
              </Typography>
              {results.length === 0 ? (
                <Typography color="textSecondary">
                  No results available
                </Typography>
              ) : (
                results.map((result) => (
                  <Box
                    key={result._id}
                    sx={{
                      mb: 2,
                      p: 1,
                      border: "1px solid #eee",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {result.test?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(result.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      size="small"
                      component={Link}
                      to={`/results/${result._id}`}
                    >
                      View Details
                    </Button>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;
