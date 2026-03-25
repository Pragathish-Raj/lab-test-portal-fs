import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Common/Layout";

// Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import TestList from "./components/Tests/TestList";
import BookAppointment from "./components/Appointments/BookAppointment";
import AppointmentList from "./components/Appointments/AppointmentList";
import ResultList from "./components/Results/ResultList";
import ResultDetail from "./components/Results/ResultDetail";
import ManageResults from "./components/Admin/ManageResults"; // 🆕 ADDED

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <PatientDashboard />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <TestList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment/:testId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <ResultDetail />
            </ProtectedRoute>
          }
        />

        
        
      </Routes>
    </Router>
  );
}

export default function WrappedApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}
