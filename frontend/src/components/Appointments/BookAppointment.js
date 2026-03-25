import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
} from "@mui/material";
import { testsAPI, appointmentsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const BookAppointment = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test, setTest] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestDetails();
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      const response = await testsAPI.getById(testId);
      setTest(response.data);
    } catch (error) {
      setError("Test not found");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const appointmentData = {
        patient: user.id,
        test: testId,
        ...formData,
      };

      await appointmentsAPI.create(appointmentData);
      navigate("/appointments");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!test) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {test.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {test.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Price: ₹{test.price} | Duration: {test.duration} minutes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="appointmentDate"
                label="Appointment Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="appointmentTime"
                label="Appointment Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.appointmentTime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="notes"
                label="Additional Notes (Symptoms, Medical History, etc.)"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/tests")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookAppointment;
