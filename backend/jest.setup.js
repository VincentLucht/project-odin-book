beforeEach(() => {
  jest.spyOn(console, 'error');
  console.error.mockImplementation(() => null);
});

afterEach(() => {
  console.error.mockRestore();
});
