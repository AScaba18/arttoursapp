
export const formatDateDayMonth = (date) => {
  //2021-04-23
  const day = date.substr(8, 2)
  const mo = date.substr(5, 2)
  //const year = date.substr(0, 4)
  const moonthLong = (mo) => {
  switch (mo) {
    case '01':
      return 'January';
    case '02':
      return 'February';
    case '03':
      return 'March';
    case '04':
      return 'April';
    case '05':
      return 'May';
    case '06':
      return 'June';
    case '07':
      return 'July';    
    case '08':
      return 'August';
    case '09':
      return 'September';
    case '10':
      return 'October';
    case '11':
      return 'November';
    case '12':
      return 'December';
  
    default:
      return
  }
  }
  const month = moonthLong(mo)

  //console.log('month', month);
  //console.log('date \n', day, mo, year);
  
  return day + ' ' + month
}


export const formatDateHours = (date) => {
  const time = date.substr(11, 5)
  return time
}  