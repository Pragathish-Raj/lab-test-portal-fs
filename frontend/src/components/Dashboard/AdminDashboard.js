import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Admin Panel
        </Typography>
        <Typography>
          This is the admin dashboard. You can manage tests, appointments, and
          results from here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
