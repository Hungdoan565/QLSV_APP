import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const Classes = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Class Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage classes and student enrollment
        </Typography>
      </Box>
      
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Class management features will be implemented based on user role
        </Typography>
      </Box>
    </Container>
  )
}

export default Classes
