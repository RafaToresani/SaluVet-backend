export const clinicalServicesServiceMock = {
  getClinicalServiceById: jest.fn(),
  getClinicalServices: jest.fn(),
  createClinicalService: jest.fn(),
  updateClinicalService: jest.fn(),
  deleteClinicalService: jest.fn(),
  initializeClinicalServiceUser: jest.fn(),
  initializeUserClinicalServices: jest.fn(),
  toggleUserClinicalService: jest.fn(),
  validateUserCanPerformServices: jest.fn(),
}