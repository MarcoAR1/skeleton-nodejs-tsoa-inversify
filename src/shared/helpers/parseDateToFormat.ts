export class parseDateToFormat {
  static formatDDMMYYHHMMSS(date: Date) {
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }
}
