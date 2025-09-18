import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Stack,
  alpha,
  Avatar,
} from '@mui/material'
import {
  School,
  Login,
  PersonAdd,
  Menu as MenuIcon,
  Close,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/homePageData'

const Navigation = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
  const theme = useTheme()

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <School sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            EduAttend
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} size="small">
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 2 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={Link} 
              to={item.path}
              sx={{ 
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.light', color: 'primary.main' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <School />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            component={Link} 
            to="/login"
            sx={{ 
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}><Login /></ListItemIcon>
            <ListItemText primary="Đăng nhập" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/register"
            sx={{ 
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.light' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}><PersonAdd /></ListItemIcon>
            <ListItemText primary="Đăng ký" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      {/* Professional AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'white',
          borderBottom: `1px solid ${alpha('#6366f1', 0.1)}`,
          backdropFilter: 'blur(20px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', 
                mr: 1.5, 
                width: 40, 
                height: 40 
              }}>
                <School />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                EduAttend
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    aria-label={`Navigate to ${item.text}`}
                    sx={{
                      mx: 1,
                      color: 'text.primary',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.1),
                        color: '#6366f1',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Auth Buttons */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={<Login />}
                  aria-label="Đăng nhập vào hệ thống"
                  sx={{
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#6366f1',
                      color: 'white',
                      borderColor: '#6366f1',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  startIcon={<PersonAdd />}
                  aria-label="Đăng ký tài khoản miễn phí"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #db2777 100%)',
                      boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                color: '#6366f1'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navigation
