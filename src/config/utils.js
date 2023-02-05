export function requestUnit(num) {
  let unit = '';
  var k = 10000,
    sizes = ['次', '万', '亿', '万亿'],
    i;
  if (num > k) {
    i = Math.floor(Math.log(num) / Math.log(k));
    num = (num / Math.pow(k, i)).toFixed(0);
    unit = sizes[i];
  } else {
    num = parseInt(num);
    unit = sizes[0];
  }
  return {
    num: parseFloat(num),
    unit: unit
  };
}