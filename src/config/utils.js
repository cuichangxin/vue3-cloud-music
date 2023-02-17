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

export function formatTime(timer){
  let second = parseInt(timer)
  let minute = 0
  // let hour = 0
  if (second > 60) {
    minute = parseInt(second / 60)
    second = parseInt(second % 60)

    // if (minute > 60) {
    //   hour = parseInt(minute / 60)
    //   minute = parseInt(minute % 60)
    // }
  }
  let timeList = '' + (parseInt(second) < 10 ? '0' + parseInt(second) : parseInt(second))
  if (minute > 0){
    timeList = '' + (parseInt(minute) < 10 ? '0' + parseInt(minute) : parseInt(minute)) + ':' + timeList
  }
  // if (hour > 0) {
  //   timeList = '' + parseInt(hour) + '时' + timeList
  // }
  return timeList
}