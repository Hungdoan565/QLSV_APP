import React, { useState, useEffect } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
  Collapse,
  Chip,
  alpha,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Class,
  Grade,
  EventAvailable,
  AccountCircle,
  Logout,
  ChevronLeft,
  Settings,
  Notifications,
  ExpandLess,
  ExpandMore,
  Home,
  School,
  AssignmentTurnedIn,
  Assessment,
  AdminPanelSettings,
  Person,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { motion } from 'framer-motion'

const drawerWidth = 280

// Menu items based on user roles
const getMenuItems = (userRole) => {
  const baseItems = [
    { 
      text: 'Tổng quan', 
      icon: <Dashboard />, 
      path: '/dashboard',
      roles: ['admin', 'teacher', 'student']
    },
  ]

  const adminItems = [
    { 
      text: 'Quản lý sinh viên', 
      icon: <People />, 
      path: '/students',
      roles: ['admin'],
      subItems: [
        { text: 'Danh sách sinh viên', path: '/students', icon: <Person /> },
        { text: 'Thêm sinh viên', path: '/students/add', icon: <Person /> },
      ]
    },
    { 
      text: 'Quản lý lớp học', 
      icon: <School />, 
      path: '/classes',
      roles: ['admin']
    },
    { 
      text: 'Quản lý điểm số', 
      icon: <Assessment />, 
      path: '/grades',
      roles: ['admin', 'teacher']
    },
    { 
      text: 'Điểm danh', 
      icon: <AssignmentTurnedIn />, 
      path: '/attendance',
      roles: ['admin', 'teacher'],
      badge: 'new'
    },
    { 
      text: 'Trạng thái hệ thống', 
      icon: <Settings />, 
      path: '/system-status',
      roles: ['admin']
    },
  ]

  const teacherItems = [
    { 
      text: 'Lớp của tôi', 
      icon: <Class />, 
      path: '/classes',
      roles: ['teacher']
    },
    { 
      text: 'Nhập điểm', 
      icon: <Grade />, 
      path: '/grades',
      roles: ['teacher']
    },
    { 
      text: 'Điểm danh', 
      icon: <EventAvailable />, 
      path: '/attendance',
      roles: ['teacher']
    },
  ]

  const studentItems = [
    { 
      text: 'Lớp học', 
      icon: <Class />, 
      path: '/classes',
      roles: ['student']
    },
    { 
      text: 'Điểm số của tôi', 
      icon: <Assessment />, 
      path: '/grades',
      roles: ['student']
    },
    { 
      text: 'Lịch sử điểm danh', 
      icon: <AssignmentTurnedIn />, 
      path: '/attendance',
      roles: ['student']
    },
  ]

  // Combine and filter items based on user role
  const allItems = [...baseItems, ...adminItems, ...teacherItems, ...studentItems]
  return allItems.filter(item => item.roles.includes(userRole || 'student'))
}

const Layout = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [expandedItems, setExpandedItems] = useState({})
  const [notifications] = useState(3) // Mock notifications

  // Get menu items based on user role
  const menuItems = getMenuItems(user?.role)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleProfileMenuClose()
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleExpandClick = (itemText) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }))
  }

  // Auto-expand active parent menu
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(subItem => 
          location.pathname === subItem.path
        )
        if (hasActiveChild) {
          setExpandedItems(prev => ({
            ...prev,
            [item.text]: true
          }))
        }
      }
    })
  }, [location.pathname])

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <School sx={{ color: 'primary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Quản Lý SV
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      
      {/* User info in drawer */}
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40 }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap fontWeight={600}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Chip 
              label={user?.role === 'admin' ? 'Admin' : 'Giảng viên'}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path || 
                    (item.subItems && item.subItems.some(sub => location.pathname === sub.path))}
                  onClick={() => {
                    if (item.subItems) {
                      handleExpandClick(item.text)
                    } else {
                      handleNavigation(item.path)
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }}
                  />
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small" 
                      color="secondary"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                  {item.subItems && (
                    expandedItems[item.text] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
            
            {/* Sub-items */}
            {item.subItems && (
              <Collapse in={expandedItems[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <motion.div
                      key={subItem.text}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItemButton
                        selected={location.pathname === subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        sx={{
                          pl: 6,
                          borderRadius: 2,
                          mx: 2,
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontSize: '0.85rem'
                          }}
                        />
                      </ListItemButton>
                    </motion.div>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hệ thống quản lý sinh viên
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Thông báo">
              <IconButton color="inherit">
                <Badge badgeContent={notifications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Settings */}
            <Tooltip title="Cài đặt">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>
            
            {/* User greeting - hidden on mobile */}
            <Typography 
              variant="body2" 
              sx={{ 
                mr: 2, 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500
              }}
            >
              Xin chào, {user?.first_name}
            </Typography>
            
            {/* Profile menu */}
            <Tooltip title="Tài khoản">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                <Avatar sx={{ width: 36, height: 36 }}>
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="primary-search-account-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                  },
                },
              }}
            >
              {/* User info header */}
              <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              
              <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>Hồ sơ cá nhân</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={() => { handleNavigation('/settings'); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cài đặt</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default Layout
