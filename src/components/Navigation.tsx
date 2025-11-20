'use client';

import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const customerPages = [
  { name: 'Book Appointment', path: '/customer/booking' },
  { name: 'My Route', path: '/customer/route' },
];

const managementPages = [
  { name: 'Dashboard', path: '/management/dashboard' },
  { name: 'Schedule Maintenance', path: '/management/maintenance' },
];

export default function Navigation() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleCloseNavMenu();
  };

  const isManagementPath = pathname?.startsWith('/management');
  const pages = isManagementPath ? managementPages : customerPages;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Image
              src="/they-logo.ico"
              alt="they logo"
              width={32}
              height={32}
              style={{ filter: 'brightness(0) invert(1)', marginRight: 8 }}
            />
            <RecyclingIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Recycling Center
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.path} onClick={() => handleNavigate(page.path)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <RecyclingIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Recycling
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  backgroundColor: pathname === page.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => handleNavigate(isManagementPath ? '/customer/booking' : '/management/dashboard')}
            >
              {isManagementPath ? 'Customer View' : 'Management View'}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

