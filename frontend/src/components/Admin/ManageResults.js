import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Alert,
} from "@mui/material";
import { resultsAPI } from "../../services/api";

const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await resultsAPI.getAll();
      setResults(res.data || []);
    } catch (err) {
      console.error("Error loading results:", err);
      setMessage("❌ Failed to load results");
    }
  };

  const togglePublished = async (result) => {
    try {
      // attempt to update publish status; fallback to refetch
      if (resultsAPI.update) {
        await resultsAPI.update(result._id, {
          ...result,
          published: !result.published,
        });
      } else if (resultsAPI.publish) {
        await resultsAPI.publish(result._id, { published: !result.published });
      }
      setMessage(`✅ Result ${result._id} updated`);
      fetchResults();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating result:", err);
      setMessage("❌ Failed to update result");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Lab Results
      </Typography>

      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Patient</strong>
                </TableCell>
                <TableCell>
                  <strong>Test</strong>
                </TableCell>
                <TableCell>
                  <strong>Published</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r._id} hover>
                  <TableCell>{r._id}</TableCell>
                  <TableCell>{r.patient?.name || "-"}</TableCell>
                  <TableCell>{r.test?.name || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.published ? "Yes" : "No"}
                      color={r.published ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => togglePublished(r)}
                      >
                        {r.published ? "Unpublish" : "Publish"}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ManageResults;
