"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Material UI imports
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Alert
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Add as AddIcon,
  PersonOutline as PersonIcon,
  Login as LoginIcon
} from '@mui/icons-material';

interface Item {
  id: number;
  name: string;
  price: number;
}

interface User {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to check for user authentication
  const checkUserAuth = () => {
    // Check for user cookie
    const cookies = document.cookie.split(';');
    console.log('Cookies:', cookies); // Debug cookies
    const userCookie = cookies.find(c => c.trim().startsWith('user='));
    
    if (userCookie) {
      try {
        const userValue = userCookie.split('=')[1];
        // The cookie might be URL encoded
        const decodedValue = decodeURIComponent(userValue);
        console.log('Decoded cookie value:', decodedValue); // Debug decoded value
        const userData = JSON.parse(decodedValue);
        console.log('User authenticated:', userData.name);
        setUser(userData);
      } catch (e) {
        console.error('Error parsing user cookie', e);
        setUser(null);
      }
    } else {
      console.log('No user cookie found');
      setUser(null);
    }
  };

  // Initialize on first render
  useEffect(() => {
    if (!isInitialized) {
      checkUserAuth();
      fetchItems();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Check auth status after any focus change (e.g., returning from auth redirect)
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, checking auth status');
      checkUserAuth();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchItems = async () => {
    setError(null);
    setItemsLoading(true);
    try {
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('Failed to fetch items');
      setItems(await res.json());
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price) }),
      });
      if (!res.ok) throw new Error('Failed to save item');
      setName('');
      setPrice('');
      await fetchItems();
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    window.location.href = '/api/auth/logout';
  };

  const isAdmin = user != null; // For demo: any logged-in user is considered admin

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <AppBar position="static" color="primary" elevation={0} sx={{ borderRadius: 2, mb: 4 }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Shopping Items
          </Typography>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                component={Link} 
                href="/profile"
                color="inherit"
                startIcon={user.picture ? (
                  <Avatar 
                    src={user.picture} 
                    alt={user.name} 
                    sx={{ width: 24, height: 24 }}
                  />
                ) : (
                  <PersonIcon />
                )}
              >
                {user.name}
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
              >
                Sign Out
              </Button>
            </Box>
          ) : (
            <Button
              component={Link}
              href="/signin"
              color="inherit"
              variant="outlined"
              startIcon={<LoginIcon />}
              sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        {itemsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} thickness={4} />
            <Typography sx={{ ml: 2, color: 'text.secondary' }}>
              Loading items...
            </Typography>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No items found.</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                divider
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{item.name}</Typography>
                {user ? (
                  <Typography fontWeight="500" color="primary.main">
                    ${item.price.toFixed(2)}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    Sign in to view price
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {isAdmin ? (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Add or Update Item
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 2 } }}>
            <TextField
              fullWidth
              label="Item Name"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Price"
              placeholder="Enter price"
              type="number"
              inputProps={{ step: "0.01" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              variant="outlined"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={<AddIcon />}
              size="large"
              sx={{ mt: 1 }}
            >
              {loading ? 'Saving...' : 'Add/Update Item'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Sign in as admin to add or update items.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
