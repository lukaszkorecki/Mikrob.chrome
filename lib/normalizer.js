function NormalizePolishChars(string) {
  var charMap = {
    'ą' : 'a',
    'ż' : 'z',
    'ź' : 'z',
    'ń' : 'n',
    'ó' : 'o',
    'ę' : 'e',
    'ć' : 'c',
    'ł' : 'l'
  };

  var normalized_string = string;

  for(var letter in charMap) {
    normalized_string = normalized_string.replace(letter, charMap[letter]);
  }
  return normalized_string;
}
