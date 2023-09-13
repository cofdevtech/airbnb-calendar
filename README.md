
## Airbnb-Calendar

**Utilities for managing, updating, checking and representing airbnb calendar methodologies for booking/reservation based calendar representation**


## Licensing

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Builds

|Branch|Build Status|
|---|---|
|Master|[![Build to use the lib](https://github.com/cofdevtech/airbnb-calendar/actions/workflows/builder.yml/badge.svg?branch=master)](https://github.com/cofdevtech/airbnb-calendar/actions/workflows/builder.yml)|
|Stag|[![Build to use the lib](https://github.com/cofdevtech/airbnb-calendar/actions/workflows/builder.yml/badge.svg?branch=stag)](https://github.com/cofdevtech/airbnb-calendar/actions/workflows/builder.yml)|
|Dev|[![Build to use the lib](https://github.com/cofdevtech/airbnb-calendar/actions/workflows/builder.yml/badge.svg?branch=dev)](https://github.com/cofdevtech/airbnb-calendar/actions/workflows/builder.yml)|

### Interfaces and Types
**Find these interfaces and type for your referrence along the codes**

```javascript
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
```

## Mock Data

```javascript
const data = [
  {
    _id: "1234560",
    check_in: "2023-10-1",
    check_out: "2023-10-5",
    status: "booked",
  },
  {
    _id: "1234563",
    check_in: "2023-10-15",
    check_out: "2023-10-20",
    status: "open",
  },
  {
    _id: "1234561",
    check_in: "2023-10-5",
    check_out: "2023-10-8",
    status: "booked",
  },
  {
    _id: "1234562",
    check_in: "2023-10-10",
    check_out: "2023-10-12",
    status: "blocked",
  },
  {
    _id: "1234564",
    check_in: "2023-10-25",
    check_out: "2023-10-28",
    status: "blocked",
  },
];
```

## Methods

`convertToDateFormat(date: string): string`\
_Returns the date in YYYY-M-D format_

`sortByDate(): void`\
_Sorts all the data in ascending form of check_in property_

`getDaysBetweenDates(startDate: moment.Moment, endDate: moment.Moment): Array<string>`\
_Returns an array of dates falling between the range of startDate and endDate including the start and end dates_

`groupDataByDate(): void`\
_Groups all the reservation objects with keys as the date which holds the reservation data object. It also marks each object with startingDay and endingDay as boolean true where two reservation join in where one reservation has its check_in date same as check_out date of the other_

`modifyDataByDateAndStatus(): void`\
_Modifies all the reservation items with startingDay: true if it is the start date of a particular reservation_\
_Modifies all the reservation items with endingDay: true if it is the end date of a particular reservation_\
_Modifies all the reservation items with selected: true if it falls between the start and end date of a particular reservation_

`addOpen(data: DefaultDataType): void | Error`\
_Adds open status based reservation data in the already available data. It throws error if a status other than 'open'._

`addBooked(data: DefaultDataType): void | Error`\
_Adds booked status based reservation data in the already available data. It throws error if a status other than 'booked'._

`addBlocked(data: DefaultDataType): void`\
_Adds blocked status based reservation data in the already available data. It throws error if a status other than 'blocked'._

`get output(): Map<string, DefaultDataType>`\
_It is a getter method to return the ouput data after the last process_

`isReserved(dateItem: string): Boolean | DefaultDataType`\
_Returns the reservation data which the particular date holds else returns false_

## Invocation

`const nativeCalendarUtils = new NativeCalendarUtils(data);`\
_data parameter above is of the mock data format mentioned above_

`nativeCalendarUtils.modifyDataByDateAndStatus();`
```javascript
const openData = {
  _id: "1234563",
  check_in: "2023-10-21",
  check_out: "2023-10-24",
  status: "open",
};
```

`nativeCalendarUtils.addOpen(openData)`

`nativeCalendarUtils.output`