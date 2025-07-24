export const appointmentServiceMock = {
    createAppointment: jest.fn(),
    getAppointmentsByDate: jest.fn(),
    getAppointmentsByPetId: jest.fn(),
    getAppointmentsByVetId: jest.fn(),
    rescheduleAppointment: jest.fn(),
    updateAppointmentStatus: jest.fn(),
}