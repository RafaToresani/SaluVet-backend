export const prismaMock = {
  pet: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  owner: {
    findUnique: jest.fn(),
  },
};

export type PrismaMockType = typeof prismaMock;