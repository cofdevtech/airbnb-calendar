import moment from "moment";

interface CalendarDateType {
  timestamp: number;
  dateString: string;
  day: number;
  month: number;
  year: number;
}

enum Status {
  BLOCKED = "blocked",
  BOOKED = "booked",
  OPEN = "open",
}

enum Colors {
  BLOCKED = "lightgrey",
  BOOKED = "pink",
  OPEN = "white",
}

interface DataType {
  [key: string]: {
    _id: string;
    check_in: string;
    check_out: string;
    selected: Boolean;
    startingDay: Boolean;
    endingDay: Boolean;
    status: string;
  };
}

interface DefaultDataType {
  _id: string;
  check_in: string;
  check_out: string;
  status: string;
  selected?: Boolean;
  endingDay?: Boolean;
  startingDay?: Boolean;
}

class NativeCalendarUtils {
  private outputData: Map<string, DefaultDataType>;
  private defaultData: Array<DefaultDataType>;

  constructor(data: Array<DefaultDataType>) {
    this.defaultData = data;
    this.sortByDate();
    this.groupDataByDate();
  }

  convertToDateFormat(date: string): string {
    return moment(date).format("YYYY-M-D");
  }

  sortByDate(): void {
    this.defaultData = this.defaultData.sort(
      (a: DefaultDataType, b: DefaultDataType): number => {
        return Number(new Date(a.check_in)) - Number(new Date(b.check_in));
      }
    );
  }

  getDaysBetweenDates(startDate: moment.Moment, endDate: moment.Moment): Array<string> {
    var now = startDate.clone(),
      dates: Array<string> = [];

    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format("YYYY-M-D"));
      now.add(1, "days");
    }
    return dates;
  }

  groupDataByDate(): void {
    let dates = new Map<string, DefaultDataType>();
    this.defaultData.forEach((bookingItem: DefaultDataType) => {
      const datesInRange: Array<string> = this.getDaysBetweenDates(
        moment(bookingItem.check_in),
        moment(bookingItem.check_out)
      );
      datesInRange.forEach((dateItem: string) => {
        let existingDateData: DefaultDataType;
        existingDateData = structuredClone(bookingItem);

        if (dates.has(dateItem)) {
          existingDateData = structuredClone(bookingItem);
          existingDateData.endingDay = true;
          existingDateData.startingDay = true;
        } else {
          existingDateData.endingDay = false;
          existingDateData.startingDay = false;
        }

        existingDateData.selected = false;

        dates.set(dateItem, existingDateData);
      });
    });
    this.outputData = dates;
  }

  modifyDataByDateAndStatus(): void {
    this.outputData.forEach(
      (
        bookingItem: DefaultDataType,
        key: string,
        map: Map<string, DefaultDataType>
      ) => {
        if (key === bookingItem.check_in) {
          map.set(key, { ...map.get(key), startingDay: true });
        }

        if (key === bookingItem.check_out) {
          map.set(key, { ...map.get(key), endingDay: true });
        }

        if (
          moment(key).isBetween(
            moment(bookingItem.check_in),
            moment(bookingItem.check_out)
          )
        ) {
          map.set(key, { ...map.get(key), selected: true });
        }
      }
    );
  }

  // update date with open status
  addOpen(data: DefaultDataType): void | Error {
    try {
      if (data.status === Status.OPEN) {
        this.defaultData.push(data);
        this.sortByDate();
        this.groupDataByDate();
        this.modifyDataByDateAndStatus();
      } else {
        throw new Error(
          `Addition of ${Status.OPEN} status is possible with data with property status ${Status.OPEN} only.`
        );
      }
    } catch (error) {
      return error;
    }
  }

  // update date with booked status
  addBooked(data: DefaultDataType): void | Error {
    try {
      if (data.status === Status.BOOKED) {
        this.defaultData.push(data);
        this.sortByDate();
        this.groupDataByDate();
        this.modifyDataByDateAndStatus();
      } else {
        throw new Error(
          `Addition of ${Status.BOOKED} status is possible with data with property status ${Status.BOOKED} only.`
        );
      }
    } catch (error) {
      return error;
    }
  }

  // update date with blocked status
  addBlocked(data: DefaultDataType): void {
    try {
      if (data.status === Status.BLOCKED) {
        this.defaultData.push(data);
        this.sortByDate();
        this.groupDataByDate();
        this.modifyDataByDateAndStatus();
      } else {
        throw new Error(
          `Addition of ${Status.BLOCKED} status is possible with data with property status ${Status.BLOCKED} only.`
        );
      }
    } catch (error) {
      return error;
    }
  }

  get output(): Map<string, DefaultDataType> {
    return this.outputData;
  }

  isReserved(dateItem: string): Boolean | DefaultDataType {
    if (!this.outputData.has(dateItem)) {
      return false;
    }
    return this.outputData.get(dateItem);
  }
}

export default NativeCalendarUtils;

//mock data

// const data = [
//   {
//     _id: "1234560",
//     check_in: "2023-10-1",
//     check_out: "2023-10-5",
//     status: "booked",
//   },
//   {
//     _id: "1234563",
//     check_in: "2023-10-15",
//     check_out: "2023-10-20",
//     status: "open",
//   },
//   {
//     _id: "1234561",
//     check_in: "2023-10-5",
//     check_out: "2023-10-8",
//     status: "booked",
//   },
//   {
//     _id: "1234562",
//     check_in: "2023-10-10",
//     check_out: "2023-10-12",
//     status: "blocked",
//   },
//   {
//     _id: "1234564",
//     check_in: "2023-10-25",
//     check_out: "2023-10-28",
//     status: "blocked",
//   },
// ];

// const nativeCalendarUtils = new NativeCalendarUtils(data);

// nativeCalendarUtils.modifyDataByDateAndStatus();

// console.log(nativeCalendarUtils.output);

// const openData = {
//   _id: "1234563",
//   check_in: "2023-10-21",
//   check_out: "2023-10-24",
//   status: "blocked",
// };

// console.log(nativeCalendarUtils.addOpen(openData));

// console.log(nativeCalendarUtils.output);
