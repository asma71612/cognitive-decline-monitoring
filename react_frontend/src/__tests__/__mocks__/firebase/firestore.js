export const doc = jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue({ data: jest.fn().mockReturnValue({}) }),
  });
  
  export const onSnapshot = jest.fn().mockImplementation((docRef, callback) => {
    // Simulate a snapshot callback
    callback({ data: () => ({}) });
    return () => {}; // Return an unsubscribe function
  });
  
  export const collection = jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue({ docs: [] }),
  });
  