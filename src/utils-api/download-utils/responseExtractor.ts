export const responseExtractor = {
  json: async (response: Response): Promise<unknown> => {
    if (response.headers.get('Content-Type') == 'application/json') {
      try {
        return await response.json();
      } catch {
        return;
      }
    }
  },
};
