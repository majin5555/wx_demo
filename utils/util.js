const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
  }
  
  const format = (value, fmt) => {
    let date = ''
    if (value.length === 0) {
      date = new Date()
    } else { //把 - 转化成 /
      const times = value.indexOf('-') >= -1 ? value.replace("-", "/").replace("-", "/") : value
      date = new Date(times);
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  
    switch (fmt.toUpperCase()) {
      case 'YYYY':
        return year;
      case 'YYYY-MM':
        return year + "-" + month;
      case 'YYYY/MM':
        return year + "/" + month;
      case 'YYYY-MM-DD':
        return year + "-" + month + "-" + day;
      case 'YYYY/MM/DD':
        return year + "/" + month + "/" + day;
      case 'HH:MM':
        return hours + ":" + minutes;
      case 'HH:MM:SS':
        return hours + ":" + minutes + ":" + seconds;
      case 'YYYY-MM-DD HH:MM:SS':
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }
  }
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
  }
  
  module.exports = {
    formatTime,
    format
  }