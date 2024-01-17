import moment from 'moment';

export function formatCurrency(val: string | number): string {
  if (val !== undefined && val !== null) {
    return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  } else {
    return '-';
  }
}

export function formatterPrice(value: string | number) {
  let result: string = '';
  value = value != null || value != undefined ? value.toString() : '';

  switch (value.length) {
    case 4:
      result = `${value[0]}K`;
      break;
    case 5:
      result = `${value.slice(0, 2)}K`;
      break;
    case 6:
      result = `${value.slice(0, 3)}K`;
      break;
    case 7:
      if (value[1] == '0') {
        result = `${value[0]}JT`;
      } else {
        result = `${value[0]},${value[1]}JT`;
      }
      break;
    case 8:
      if (value[2] == '0') {
        result = `${value.slice(0, 2)}JT`;
      } else {
        result = `${value[0]}${value[1]},${value[2]}JT`;
      }
      break;
    case 9:
      if (value[3] == '0') {
        result = `${value.slice(0, 3)}JT`;
      } else {
        result = `${value[0]}${value[1]}${value[2]},${value[3]}JT`;
      }
      break;
    case 10:
      if (value[1] == '0') {
        result = `${value[0]}M`;
      } else {
        result = `${value[0]},${value[1]}M`;
      }
      break;
    case 11:
      if (value[2] == '0') {
        result = `${value.slice(0, 2)}M`;
      } else {
        result = `${value[0]}${value[2]},${value[3]}M`;
      }
      break;
    case 12:
      if (value[3] == '0') {
        result = `${value.slice(0, 3)}M`;
      } else {
        result = `${value[0]}${value[1]}${value[2]},${value[3]}M`;
      }
      break;
    case 13:
      if (value[1] == '0') {
        result = `${value[0]}B`;
      } else {
        result = `${value[0]},${value[1]}B`;
      }
      break;
    default:
      break;
  }

  return result;
}

export function handleNull(val: string): boolean {
  if (val == null || val == 'null') return false;
  return true;
}

export function handleNullToString(val: string): string {
  if (val == null || val == 'null' || val == '') return '-';
  return val;
}

export function isNumber(val: string | number): boolean {
  const pattern = /^\d+\.?\d*$/;
  return pattern.test(val.toString());
}

export function isEmailValid(val: string): boolean {
  // const pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/;
  /* eslint-disable */
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return pattern.test(val);
}

export function formatDate(val: any, format: any) {
  moment.locale('id');
  if (val) {
    return moment(val).format(format);
  }
  return '';
}

export function convertEpochToDate(val: any) {
  if (val) {
    const myDate = new Date(val * 1000);
    return myDate;
  }
  return 0;
}

export function convertDateToEpoch(val: string) {
  const date = new Date(val);
  return date.getTime() / 1000.0;
}

export function epochToDateTime(val: number, format?: string) {
  if (val) {
    const convertedEpoch = convertEpochToDate(val);
    return formatDate(convertedEpoch, format ? format : 'DD MMMM YYYY, HH:mm');
  }
  return '';
}

export function goToLink(link: any) {
  if (link == '' || link == undefined || link == null) {
    return false;
  } else if (!link.includes('http')) {
    window.open('http://' + link, '_blank');
  } else {
    window.open(link, '_blank');
  }
}

export function getLocalStorage(key: any) {
  return JSON.parse(window.localStorage.getItem(key) as string);
}

export function setLocalStorage(key: any, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function validateEmail(email: any) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function nFormatter(num: any) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
  }
  return num;
}

export function nFormatterZero(num: any) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(0).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
  }
  return num;
}
