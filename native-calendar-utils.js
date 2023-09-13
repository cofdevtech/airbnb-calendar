"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
var Status;
(function (Status) {
    Status["BLOCKED"] = "blocked";
    Status["BOOKED"] = "booked";
    Status["OPEN"] = "open";
})(Status || (Status = {}));
var Colors;
(function (Colors) {
    Colors["BLOCKED"] = "lightgrey";
    Colors["BOOKED"] = "pink";
    Colors["OPEN"] = "white";
})(Colors || (Colors = {}));
class NativeCalendarUtils {
    constructor(data) {
        this.defaultData = data;
        this.sortByDate();
        this.groupDataByDate();
    }
    convertToDateFormat(date) {
        return (0, moment_1.default)(date).format("YYYY-M-D");
    }
    sortByDate() {
        this.defaultData = this.defaultData.sort((a, b) => {
            return Number(new Date(a.check_in)) - Number(new Date(b.check_in));
        });
    }
    getDaysBetweenDates(startDate, endDate) {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format("YYYY-M-D"));
            now.add(1, "days");
        }
        return dates;
    }
    groupDataByDate() {
        let dates = new Map();
        this.defaultData.forEach((bookingItem) => {
            const datesInRange = this.getDaysBetweenDates((0, moment_1.default)(bookingItem.check_in), (0, moment_1.default)(bookingItem.check_out));
            datesInRange.forEach((dateItem) => {
                let existingDateData;
                existingDateData = structuredClone(bookingItem);
                if (dates.has(dateItem)) {
                    existingDateData = structuredClone(bookingItem);
                    existingDateData.endingDay = true;
                    existingDateData.startingDay = true;
                }
                else {
                    existingDateData.endingDay = false;
                    existingDateData.startingDay = false;
                }
                existingDateData.selected = false;
                dates.set(dateItem, existingDateData);
            });
        });
        this.outputData = dates;
    }
    modifyDataByDateAndStatus() {
        this.outputData.forEach((bookingItem, key, map) => {
            if (key === bookingItem.check_in) {
                map.set(key, Object.assign(Object.assign({}, map.get(key)), { startingDay: true }));
            }
            if (key === bookingItem.check_out) {
                map.set(key, Object.assign(Object.assign({}, map.get(key)), { endingDay: true }));
            }
            if ((0, moment_1.default)(key).isBetween((0, moment_1.default)(bookingItem.check_in), (0, moment_1.default)(bookingItem.check_out))) {
                map.set(key, Object.assign(Object.assign({}, map.get(key)), { selected: true }));
            }
        });
    }
    // update date with open status
    addOpen(data) {
        try {
            if (data.status === Status.OPEN) {
                this.defaultData.push(data);
                this.sortByDate();
                this.groupDataByDate();
                this.modifyDataByDateAndStatus();
            }
            else {
                throw new Error(`Addition of open status is possible with data with property status open only.`);
            }
        }
        catch (error) {
            return error;
        }
    }
    // update date with booked status
    addBooked(data) { }
    // update date with blocked status
    addBlocked(data) { }
    get output() {
        return this.outputData;
    }
    isReserved(dateItem) {
        if (!this.outputData.has(dateItem)) {
            return false;
        }
        return this.outputData.get(dateItem);
    }
}
//mock data
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
const nativeCalendarUtils = new NativeCalendarUtils(data);
nativeCalendarUtils.modifyDataByDateAndStatus();
console.log(nativeCalendarUtils.output);
const openData = {
    _id: "1234563",
    check_in: "2023-10-21",
    check_out: "2023-10-24",
    status: "blocked",
};
console.log(nativeCalendarUtils.addOpen(openData));
console.log(nativeCalendarUtils.output);
