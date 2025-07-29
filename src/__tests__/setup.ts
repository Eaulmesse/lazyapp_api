// Configuration globale pour les tests

// Mock global pour console.log pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Configuration des timeouts
jest.setTimeout(10000); 