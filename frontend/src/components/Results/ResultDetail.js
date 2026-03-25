import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { resultsAPI } from "../../services/api";

const ResultDetail = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultDetails();
  }, [id]);

  const fetchResultDetails = async () => {
    try {
      const response = await resultsAPI.get(id);
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching result details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "success";
      case "abnormal":
        return "warning";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading result details...</Typography>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container>
        <Typography>Result not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Lab Test Report
          </Typography>
          <Typography variant="h5" color="primary">
            {result.test?.name}
          </Typography>
        </Box>

        {/* Patient Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Typography>
                <strong>Name:</strong> {result.patient?.name}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {result.patient?.gender}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong>{" "}
                {new Date(result.patient?.dateOfBirth).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Report Date:</strong>{" "}
                {new Date(result.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Appointment Information */}
        {result.appointment && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Information
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Typography>
                  <strong>Appointment ID:</strong> {result.appointment?._id}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    result.appointment?.appointmentDate
                  ).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Time:</strong> {result.appointment?.appointmentTime}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {result.appointment?.status}
                </Typography>
                <Typography>
                  <strong>Payment:</strong> {result.appointment?.paymentStatus}
                </Typography>
                <Typography>
                  <strong>Amount:</strong> ₹{result.appointment?.amount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Parameter</strong>
                </TableCell>
                <TableCell>
                  <strong>Value</strong>
                </TableCell>
                <TableCell>
                  <strong>Unit</strong>
                </TableCell>
                <TableCell>
                  <strong>Normal Range</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.results.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.parameter}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.normalRange}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Findings and Recommendations */}
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Findings
              </Typography>
              <Typography>
                {result.findings || "No specific findings noted."}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <Typography>
                {result.recommendations || "No specific recommendations."}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tested/Verified by and Report File */}
        <Box sx={{ mt: 3 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Laboratory
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>
                  <strong>Tested By:</strong>{" "}
                  {result.testedBy
                    ? `${result.testedBy.name} (${result.testedBy.email})`
                    : "-"}
                </Typography>
                <Typography>
                  <strong>Verified By:</strong>{" "}
                  {result.verifiedBy
                    ? `${result.verifiedBy.name} (${result.verifiedBy.email})`
                    : "-"}
                </Typography>
                {result.reportFile && (
                  <Typography>
                    <strong>Report File:</strong>{" "}
                    <a
                      href={
                        result.reportFile.startsWith("http")
                          ? result.reportFile
                          : `/uploads/${result.reportFile}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            borderTop: "1px solid #ccc",
            pt: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            This is an electronically generated report. No signature required.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            For any queries, please contact the laboratory.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResultDetail;
