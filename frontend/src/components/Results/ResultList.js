import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { resultsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultsAPI.getByPatient(user.id);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading results...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Lab Results
      </Typography>

      {results.length === 0 ? (
        <Typography>No results available.</Typography>
      ) : (
        results.map((result) => (
          <Card key={result._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6">{result.test?.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Test Date: {new Date(result.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Reported On:{" "}
                    {new Date(result.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  component={Link}
                  to={`/results/${result._id}`}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ResultList;
