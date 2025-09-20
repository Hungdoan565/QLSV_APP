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
        attendanceRate: Math.floor(Math.random() * 40) + 60, // 60-100%
        totalClasses: Math.floor(Math.random() * 20) + 5, // 5-25 classes
        averageGrade: Math.floor(Math.random() * 20) + 70, // 70-90
        thisWeekAttendance: Math.floor(Math.random() * 5) + 1, // 1-6 classes this week
        gpa: Math.random() * 2 + 2.5, // 2.5-4.5 GPA
        creditsEarned: Math.floor(Math.random() * 60) + 20, // 20-80 credits
        creditsRemaining: Math.floor(Math.random() * 40) + 20 // 20-60 credits remaining
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

      const mockGrades = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
        id: i + 1,
        subject: `Môn học ${i + 1}`,
        grade_type: ['midterm', 'final', 'assignment', 'quiz'][Math.floor(Math.random() * 4)],
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
      }))

      const mockSchedule = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        subject: `Môn học ${i + 1}`,
        time: `${8 + i * 2}:00 - ${10 + i * 2}:00`,
        day: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'][i],
        location: `Phòng ${Math.floor(Math.random() * 10) + 1}`
      }))

      const mockAssignments = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
        id: i + 1,
        title: `Bài tập ${i + 1}`,
        subject: `Môn học ${Math.floor(Math.random() * 5) + 1}`,
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
