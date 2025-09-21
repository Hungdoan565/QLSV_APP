import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Badge
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Computer as ComputerIcon,
  Chair as ChairIcon,
  Wifi as WifiIcon,
  Tv as TvIcon
} from '@mui/icons-material'

const RoomManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [roomDialogOpen, setRoomDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Mock data for rooms
  const mockRooms = [
    {
      id: 1,
      name: 'Phòng 14-02',
      building: 'Phòng máy 8',
      type: 'Phòng máy tính',
      capacity: 42,
      equipment: ['Máy tính', 'Máy chiếu', 'Wifi'],
      status: 'available', // available, occupied, maintenance
      currentClass: null,
      nextClass: {
        subject: 'Lập trình Python',
        teacher: 'Đặng Mạnh Huy',
        time: '07:00-11:00',
        day: 'Thứ 2'
      },
      weeklySchedule: [
        { day: 'Thứ 2', time: '07:00-11:00', subject: 'Lập trình Python', teacher: 'Đặng Mạnh Huy' },
        { day: 'Thứ 3', time: '13:00-17:00', subject: 'Cơ sở dữ liệu', teacher: 'Nguyễn Văn A' },
        { day: 'Thứ 4', time: '08:00-12:00', subject: 'Mạng máy tính', teacher: 'Trần Thị B' },
        { day: 'Thứ 5', time: '14:00-18:00', subject: 'Trí tuệ nhân tạo', teacher: 'Lê Văn C' }
      ],
      maintenance: null
    },
    {
      id: 2,
      name: 'Phòng 15-01',
      building: 'Tòa nhà A',
      type: 'Phòng lý thuyết',
      capacity: 40,
      equipment: ['Bảng trắng', 'Máy chiếu', 'Wifi', 'TV'],
      status: 'occupied',
      currentClass: {
        subject: 'Cơ sở dữ liệu',
        teacher: 'Nguyễn Văn A',
        time: '13:00-17:00',
        day: 'Thứ 3'
      },
      nextClass: {
        subject: 'Mạng máy tính',
        teacher: 'Trần Thị B',
        time: '08:00-12:00',
        day: 'Thứ 4'
      },
      weeklySchedule: [
        { day: 'Thứ 3', time: '13:00-17:00', subject: 'Cơ sở dữ liệu', teacher: 'Nguyễn Văn A' },
        { day: 'Thứ 4', time: '08:00-12:00', subject: 'Mạng máy tính', teacher: 'Trần Thị B' }
      ],
      maintenance: null
    },
    {
      id: 3,
      name: 'Phòng 16-03',
      building: 'Tòa nhà B',
      type: 'Phòng thực hành',
      capacity: 35,
      equipment: ['Máy tính', 'Máy chiếu', 'Wifi', 'Thiết bị mạng'],
      status: 'maintenance',
      currentClass: null,
      nextClass: null,
      weeklySchedule: [],
      maintenance: {
        reason: 'Nâng cấp hệ thống mạng',
        startDate: '2024-12-15',
        endDate: '2024-12-20',
        technician: 'Nguyễn Văn D'
      }
    },
    {
      id: 4,
      name: 'Phòng 17-01',
      building: 'Tòa nhà C',
      type: 'Phòng hội thảo',
      capacity: 60,
      equipment: ['Máy chiếu', 'Wifi', 'TV', 'Hệ thống âm thanh'],
      status: 'available',
      currentClass: null,
      nextClass: null,
      weeklySchedule: [],
      maintenance: null
    }
  ]

  const availableRooms = mockRooms.filter(r => r.status === 'available')
  const occupiedRooms = mockRooms.filter(r => r.status === 'occupied')
  const maintenanceRooms = mockRooms.filter(r => r.status === 'maintenance')

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success'
      case 'occupied': return 'warning'
      case 'maintenance': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Trống'
      case 'occupied': return 'Đang sử dụng'
      case 'maintenance': return 'Bảo trì'
      default: return 'Không xác định'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Phòng máy tính': return <ComputerIcon />
      case 'Phòng lý thuyết': return <SchoolIcon />
      case 'Phòng thực hành': return <AssignmentIcon />
      case 'Phòng hội thảo': return <TvIcon />
      default: return <RoomIcon />
    }
  }

  const handleCreateRoom = () => {
    setSelectedRoom(null)
    setRoomDialogOpen(true)
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setRoomDialogOpen(true)
  }

  const handleScheduleRoom = (room) => {
    setSelectedRoom(room)
    setScheduleDialogOpen(true)
  }

  const handleDeleteRoom = (roomId) => {
    // Handle delete room
    console.log('Delete room:', roomId)
  }

  const RoomCard = ({ room }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: getStatusColor(room.status) }}>
              {getTypeIcon(room.type)}
            </Avatar>
            <Box>
              <Typography variant="h6">{room.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {room.building} - {room.type}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  label={getStatusText(room.status)} 
                  color={getStatusColor(room.status)}
                  size="small"
                />
                <Chip 
                  label={`${room.capacity} chỗ`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              onClick={() => handleScheduleRoom(room)}
              disabled={room.status === 'maintenance'}
            >
              <ScheduleIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleEditRoom(room)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDeleteRoom(room.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        
        {/* Equipment */}
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Thiết bị:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {room.equipment.map((item, index) => (
              <Chip key={index} label={item} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>

        {/* Current Status */}
        {room.currentClass && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Đang sử dụng:</strong> {room.currentClass.subject} - {room.currentClass.teacher}
              <br />
              <strong>Thời gian:</strong> {room.currentClass.time} ({room.currentClass.day})
            </Typography>
          </Alert>
        )}

        {room.nextClass && !room.currentClass && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Lịch tiếp theo:</strong> {room.nextClass.subject} - {room.nextClass.teacher}
              <br />
              <strong>Thời gian:</strong> {room.nextClass.time} ({room.nextClass.day})
            </Typography>
          </Alert>
        )}

        {room.maintenance && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Bảo trì:</strong> {room.maintenance.reason}
              <br />
              <strong>Thời gian:</strong> {room.maintenance.startDate} - {room.maintenance.endDate}
              <br />
              <strong>Kỹ thuật viên:</strong> {room.maintenance.technician}
            </Typography>
          </Alert>
        )}

        {/* Weekly Schedule */}
        {room.weeklySchedule.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Lịch tuần:
            </Typography>
            <List dense>
              {room.weeklySchedule.map((schedule, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={`${schedule.day}: ${schedule.time}`}
                    secondary={`${schedule.subject} - ${schedule.teacher}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  )

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Quản lý phòng học
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem lịch trống, sắp lớp và quản lý phòng học
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab 
              label={`Tất cả (${mockRooms.length})`} 
              icon={<RoomIcon />}
            />
            <Tab 
              label={`Trống (${availableRooms.length})`} 
              icon={<CheckCircleIcon />}
            />
            <Tab 
              label={`Đang sử dụng (${occupiedRooms.length})`} 
              icon={<WarningIcon />}
            />
            <Tab 
              label={`Bảo trì (${maintenanceRooms.length})`} 
              icon={<InfoIcon />}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateRoom}
          >
            Thêm phòng học mới
          </Button>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={2}>
            {mockRooms.map((room) => (
              <Grid item xs={12} md={6} key={room.id}>
                <RoomCard room={room} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Grid container spacing={2}>
            {availableRooms.map((room) => (
              <Grid item xs={12} md={6} key={room.id}>
                <RoomCard room={room} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Grid container spacing={2}>
            {occupiedRooms.map((room) => (
              <Grid item xs={12} md={6} key={room.id}>
                <RoomCard room={room} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          <Grid container spacing={2}>
            {maintenanceRooms.map((room) => (
              <Grid item xs={12} md={6} key={room.id}>
                <RoomCard room={room} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Room Dialog */}
      <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRoom ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên phòng"
                placeholder="VD: Phòng 14-02"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tòa nhà"
                placeholder="VD: Phòng máy 8"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Loại phòng</InputLabel>
                <Select>
                  <MenuItem value="maytinh">Phòng máy tính</MenuItem>
                  <MenuItem value="lythuyet">Phòng lý thuyết</MenuItem>
                  <MenuItem value="thuchanh">Phòng thực hành</MenuItem>
                  <MenuItem value="hoithao">Phòng hội thảo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sức chứa"
                type="number"
                placeholder="VD: 42"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thiết bị (cách nhau bởi dấu phẩy)"
                placeholder="VD: Máy tính, Máy chiếu, Wifi"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoomDialogOpen(false)}>Hủy</Button>
          <Button variant="contained">
            {selectedRoom ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Room Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Sắp lịch cho {selectedRoom?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn thời gian và lớp học để sắp lịch sử dụng phòng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Lớp học</InputLabel>
                <Select>
                  <MenuItem value="python">Lập trình Python - DH22TIN06</MenuItem>
                  <MenuItem value="law">Pháp luật về công nghệ thông tin - DH22TIN07</MenuItem>
                  <MenuItem value="mobile">Lập trình thiết bị di động - DH22TIN08</MenuItem>
                  <MenuItem value="history">Lịch sử Đảng cộng sản Việt Nam - DH22TIN09</MenuItem>
                  <MenuItem value="opensource">Phát triển phần mềm mã nguồn mở - DH22TIN10</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Giảng viên</InputLabel>
                <Select>
                  <MenuItem value="huy">Đặng Mạnh Huy</MenuItem>
                  <MenuItem value="tam">Trần Minh Tâm</MenuItem>
                  <MenuItem value="trung">Đoàn Chí Trung</MenuItem>
                  <MenuItem value="tin">Đinh Cao Tín</MenuItem>
                  <MenuItem value="vinh">Võ Thanh Vinh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Thứ trong tuần</InputLabel>
                <Select>
                  <MenuItem value={2}>Thứ 2</MenuItem>
                  <MenuItem value={3}>Thứ 3</MenuItem>
                  <MenuItem value={4}>Thứ 4</MenuItem>
                  <MenuItem value={5}>Thứ 5</MenuItem>
                  <MenuItem value={6}>Thứ 6</MenuItem>
                  <MenuItem value={7}>Thứ 7</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Giờ bắt đầu"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Giờ kết thúc"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Hủy</Button>
          <Button variant="contained">Sắp lịch</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default RoomManagement
