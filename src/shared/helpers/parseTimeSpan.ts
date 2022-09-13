export const parseTimeSpanToSeconds = (timeSpan: string): number => {
  const timeSpanToArray = timeSpan.split(':')
  const Hours = 0
  const Minutes = 1
  const seconds = timeSpanToArray.reduce((acc, current, index) => {
    if (index === Hours) {
      return acc + +current * 60 * 60
    }
    if (index === Minutes) {
      return acc + +current * 60
    }
    return acc + +current.split('.')[0]
  }, 0)

  return seconds || -1
}

export const parseTimeSpanToMiliseconds = (timeSpan: string): number => {
  const timeSpanToArray = timeSpan.split(':')

  const seconds = timeSpanToArray.reduce((acc, current, index) => {
    if (index === 0) {
      return acc + +current * 60 * 60
    }
    if (index === 1) {
      return acc + +current * 60
    }
    const miliseconds = +current.split('.')[1].slice(0, 3)
    const seconds = acc + +current.split('.')[0]

    return seconds * 1000 + miliseconds
  }, 0)

  return seconds
}

const AddZeroIfLessThanTen = (number: number): string => {
  return number < 10 ? `0${number}` : number.toString()
}

export const parseSecondsToTimeSpan = (seconds: number): string => {
  const ONEHOUR = 3600
  const ONEMINUTE = 60
  const hours = seconds > ONEHOUR ? Math.floor(seconds / ONEHOUR) : 0
  const minutes = seconds > ONEMINUTE ? Math.floor((seconds - hours * ONEHOUR) / ONEMINUTE) : 0
  const sec = seconds - hours * ONEHOUR - minutes * ONEMINUTE || 0
  return `${AddZeroIfLessThanTen(hours)}:${AddZeroIfLessThanTen(minutes)}:${AddZeroIfLessThanTen(sec)}`
}
