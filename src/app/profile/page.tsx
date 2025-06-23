"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Material UI imports
import { 
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  VpnKey as KeyIcon,
  AdminPanelSettings as AdminIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

interface User {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user cookie
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((c) => c.trim().startsWith("user="));

    if (userCookie) {
      try {
        const userValue = userCookie.split("=")[1];
        // The cookie might be URL encoded
        const decodedValue = decodeURIComponent(userValue);
        const userData = JSON.parse(decodedValue);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user cookie", e);
        router.push("/signin");
      }
    } else {
      // Redirect to sign in if no user cookie found
      router.push("/signin");
    }
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    window.location.href = "/api/auth/logout";
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return null; // This shouldn't show as the useEffect will redirect
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" fontWeight="bold">
              User Profile
            </Typography>
          }
          action={
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{ borderRadius: 2 }}
            >
              Sign Out
            </Button>
          }
          sx={{ pb: 0 }}
        />

        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            {user.picture ? (
              <Avatar
                src={user.picture}
                alt={user.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            ) : (
              <Avatar
                sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}
              >
                <Typography variant="h3">{user.name?.[0]?.toUpperCase()}</Typography>
              </Avatar>
            )}
            <Typography variant="h5" fontWeight="500" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Chip 
              label="Admin" 
              color="primary" 
              icon={<AdminIcon />} 
              sx={{ mt: 1 }} 
            />
          </Box>

          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="h6" fontWeight="500" gutterBottom>
            Account Details
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <KeyIcon />
              </ListItemIcon>
              <ListItemText primary="User ID" secondary={user.sub} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Name" secondary={user.name} />
            </ListItem>
          </List>

          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              href="/"
              variant="contained"
              fullWidth
              startIcon={<ArrowBackIcon />}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Back to Items
            </Button>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
}
