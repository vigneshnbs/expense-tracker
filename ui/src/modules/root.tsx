import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';

const RootPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/accounts"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              Accounts
            </NavLink>
            <NavLink
              to="/categories"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              Categories
            </NavLink>
            <NavLink
              to="/transactions"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              Transactions
            </NavLink>
            <NavLink
              to="/budget"
              style={({ isActive }) => ({
                color: 'white',
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              Budget
            </NavLink>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <div data-testid="page-wrapper">
            <Outlet />
          </div>
        </Suspense>
      </Container>
    </Box>
  );
};

export default RootPage;
