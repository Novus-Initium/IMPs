const parsePointer = (pointer: string) => {
    try {
      // Log the raw pointer string
      console.log('Raw Pointer String:', pointer);

      // Remove leading and trailing whitespace, including newlines
      const sanitizedPointer = pointer.trim();
      console.log('Sanitized Pointer String:', sanitizedPointer);

      // Additional sanitization: Replace single quotes with double quotes, remove trailing commas
      const cleanPointer = sanitizedPointer.replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      console.log('Clean Pointer String:', cleanPointer);

      return JSON.parse(cleanPointer);
    } catch (e) {
      console.error('Failed to parse pointer:', e);
      console.log('Invalid JSON:', pointer); // Log the invalid JSON
      return {};
    }
};

export default parsePointer;