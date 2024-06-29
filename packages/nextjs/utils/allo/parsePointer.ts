const parsePointer = (pointer: string) => {
    try {
      // Log the raw pointer string

      // Remove leading and trailing whitespace, including newlines
      const sanitizedPointer = pointer.trim();

      // Additional sanitization: Replace single quotes with double quotes, remove trailing commas
      const cleanPointer = sanitizedPointer.replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

      return JSON.parse(cleanPointer);
    } catch (e) {
      console.error('Failed to parse pointer:', e);
      console.log('Invalid JSON:', pointer); // Log the invalid JSON
      return {};
    }
};

export default parsePointer;