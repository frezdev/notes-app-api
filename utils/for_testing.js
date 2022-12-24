const palindrome = string => {
  if (typeof string === 'undefined') return;

  return string
    .split('')
    .reverse()
    .join('');
};

const average = array => {
  if (array.length === 0 || array === undefined) return 0;

  const reducer = (prev, current) => {
    return prev + current;
  };

  return array.reduce(reducer, 0) / array.length;
};

module.exports = {
  palindrome,
  average
};