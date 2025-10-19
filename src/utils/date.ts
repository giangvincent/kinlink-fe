import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

function lunarPlugin(_: unknown, DayjsClass: typeof dayjs.Dayjs, dayjsFactory: typeof dayjs) {
  DayjsClass.prototype.lunar = function () {
    const d = dayjsFactory(this.valueOf())
    return {
      day: d.date(),
      month: d.month() + 1
    }
  }
}

declare module 'dayjs' {
  interface Dayjs {
    lunar(): { day: number; month: number }
  }
}

dayjs.extend(localizedFormat)
// @ts-expect-error - local plugin intentionally diverges from types
dayjs.extend(lunarPlugin)
dayjs.extend(relativeTime)

export default dayjs
