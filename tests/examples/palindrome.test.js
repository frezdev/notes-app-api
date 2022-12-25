const { palindrome } = require('../../utils/for_testing.js');

describe.skip('Palindrome', () => {
  test('palindrome of carlos', () => {
    const result = palindrome('carlos');
    expect(result).toBe('solrac');
  });

  test('palindrome of empty string', () => {
    const result = palindrome('');
    expect(result).toBe('');
  });

  test('palindrome of carlos', () => {
    const result = palindrome();
    expect(result).toBeUndefined();
  });
});