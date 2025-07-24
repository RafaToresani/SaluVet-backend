export const usersServiceMock = {
  getUser: jest.fn(),
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findByEmail: jest.fn(),
  superAdminExists: jest.fn(),
  updatePassword: jest.fn(),
  changePasswordBySuperadmin: jest.fn(),
  toggleActive: jest.fn(),
  updateUserBySuperadmin: jest.fn(),
}