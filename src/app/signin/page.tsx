"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Material UI imports
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Container, 
  Typography, 
  Alert,
  Paper
} from '@mui/material';
import { 
  Login as LoginIcon 
} from '@mui/icons-material';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error message from callback
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "missing_code":
          setError("Authorization code was missing from the response.");
          break;
        case "token_exchange":
          setError("Failed to exchange the authorization code for tokens.");
          break;
        case "missing_id_token":
          setError("No ID token was returned from Auth0.");
          break;
        case "invalid_token":
          setError("The ID token was invalid or could not be parsed.");
          break;
        case "server_error":
          setError("An unexpected server error occurred.");
          break;
        default:
          setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [searchParams]);

  const handleSignIn = () => {
    setLoading(true);

    // Auth0 Universal Login parameters
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    // Using a hardcoded redirect URI to match exactly what's in Auth0 dashboard
    const redirectUri = "http://localhost:3000/api/auth/callback";

    // Construct Auth0 login URL
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId || "",
      redirect_uri: redirectUri,
      scope: "openid profile email",
      state: btoa(Math.random().toString()),
    });

    // Redirect to Auth0 login page
    window.location.href = `https://${domain}/authorize?${params}`;
  };

  return (
    <Container maxWidth="sm" sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      py: 4
    }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Sign In to Shopping App
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
            >
              <strong>Error: </strong> {error}
            </Alert>
          )}
          
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSignIn}
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? "Redirecting..." : "Sign in with Auth0"}
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              You will be redirected to Auth0 for secure authentication
            </Typography>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
}
