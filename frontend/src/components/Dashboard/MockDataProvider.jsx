import React, { createContext, useContext, useState, useEffect } from 'react'

const MockDataContext = createContext()

export const useMockData = () => {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }
  return context
}

export const MockDataProvider = ({ children, user }) => {
  const [mockData, setMockData] = useState({
    statistics: {
      attendanceRate: 0,
      totalClasses: 0,
      averageGrade: 0,
      thisWeekAttendance: 0,
      gpa: 0,
      creditsEarned: 0,
      creditsRemaining: 0
    },
    attendanceRecords: [],
    recentGrades: [],
    classSchedule: [],
    assignments: []
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Generate mock data based on user
      const mockStatistics = {
        attendanceRate: Math.floor(Math.random() * 20) + 75, // 75-95%
        totalClasses: 5, // 5 môn học cố định
        averageGrade: Math.floor(Math.random() * 15) + 80, // 80-95 (hệ 100)
        thisWeekAttendance: Math.floor(Math.random() * 3) + 3, // 3-5 tiết trong tuần
        gpa: (Math.random() * 1.5 + 3.0).toFixed(2), // 3.0-4.5 GPA
        creditsEarned: Math.floor(Math.random() * 20) + 45, // 45-65 tín chỉ
        creditsRemaining: Math.floor(Math.random() * 15) + 20 // 20-35 tín chỉ còn lại
      }

      const mockAttendanceRecords = Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
        id: i + 1,
        session: {
          session_name: `Buổi học ${i + 1}`,
          location: `Phòng ${Math.floor(Math.random() * 10) + 1}`
        },
        check_in_time: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late'
      }))

      const realSubjects = [
        'Lập trình Python',
        'Phát triển phần mềm mã nguồn mở',
        'Lịch sử Đảng cộng sản Việt Nam',
        'Lập trình thiết bị di động',
        'Pháp luật về công nghệ thông tin'
      ]
      
      const mockGrades = Array.from({ length: Math.floor(Math.random() * 8) + 5 }, (_, i) => ({
        id: i + 1,
        subject: realSubjects[i % realSubjects.length],
        grade_type: ['midterm', 'final', 'assignment', 'quiz'][Math.floor(Math.random() * 4)],
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
      }))

      const mockSchedule = [
        {
          id: 1,
          subject: 'Lập trình Python',
          time: '07:00 - 11:00',
          day: 'Thứ 2',
          location: 'Phòng 14-02 (Phòng máy 8)'
        },
        {
          id: 2,
          subject: 'Phát triển phần mềm mã nguồn mở',
          time: '07:00 - 11:00',
          day: 'Thứ 4',
          location: 'Phòng 15-03 (Phòng máy 15)'
        },
        {
          id: 3,
          subject: 'Lịch sử Đảng cộng sản Việt Nam',
          time: '06:45 - 08:15',
          day: 'Thứ 5',
          location: 'Phòng D4-04 (Hội trường Khu D)'
        },
        {
          id: 4,
          subject: 'Lập trình thiết bị di động',
          time: '07:00 - 11:00',
          day: 'Thứ 6',
          location: 'Phòng 14-02 (Phòng máy 8)'
        },
        {
          id: 5,
          subject: 'Pháp luật về công nghệ thông tin',
          time: '06:45 - 08:15',
          day: 'Thứ 7',
          location: 'Phòng T4-05 (Học đường)'
        }
      ]

      const mockAssignments = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
        id: i + 1,
        title: `Bài tập ${i + 1}`,
        subject: realSubjects[Math.floor(Math.random() * realSubjects.length)],
        dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)]
      }))

      setMockData({
        statistics: mockStatistics,
        attendanceRecords: mockAttendanceRecords,
        recentGrades: mockGrades,
        classSchedule: mockSchedule,
        assignments: mockAssignments
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user])

  const value = {
    mockData,
    isLoading,
    refreshData: () => {
      setIsLoading(true)
      // Trigger refresh
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  )
}
