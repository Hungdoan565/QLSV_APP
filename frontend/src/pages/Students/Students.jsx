import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const Students = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Student Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage student information and records
        </Typography>
      </Box>
      
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Student management features will be implemented based on user role
        </Typography>
      </Box>
    </Container>
  )
}

export default Students