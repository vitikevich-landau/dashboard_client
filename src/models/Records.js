import {getRows, getRowValue} from "@/utils/dataSet";
import {Record} from "@/models/Record";
import {MONTHS} from "@/configs";
import _ from 'lodash';

export const mergeRecords = (...records) => {
  const merged = new Records();
  records.forEach(
    recs => recs.records.forEach(
      rec => merged.records.push(rec)
    )
  );

  return merged;
};

const toObject = arr => _.zipObject(arr, arr.map(() => []));

export class Records {
  constructor(workSheet, /*options*/) {
    if (workSheet instanceof Array) {
      this.records = workSheet;
    } else {
      this.records = getRows(workSheet, getRowValue)
        /*
        *   skip titles if workSheet
        * */
        .slice(1)
        .map(row => new Record(row[0], row[1], row[2], row[3], row[4]));
    }
  }

  get(ind) {
    return this.records[ind];
  }

  districts() {
    return this.records.map(r => r.district);
  }

  districtsUniq() {
    return [...new Set(this.districts())];
  }

  institutions() {
    return this.records.map(r => r.institution);
  }

  institutionUniq() {
    return [...new Set(this.institutions())];
  }

  dates() {
    return this.records.map(r => r.date);
  }

  years() {
    return [...new Set(this.dates().map(r => r.getFullYear()))];
  }

  serviceTypes() {
    return this.records.map(r => r.serviceType);
  }

  amounts() {
    return this.records.map(r => r.amount);
  }

  totalAmount() {
    return this.records.reduce((p, c) => p + c.amount, 0);
  }

  groupByYears() {
    const years = [...new Set(this.records.map(r => r.date.getFullYear()))];
    const grouped = toObject(years);
    this.forEach(r => grouped[r.date.getFullYear()].push(r));

    return grouped;
  }

  groupByMonths() {
    const years = this.groupByYears();
    Object.keys(years).forEach(year => {
      const months = Object.assign(
        {},
        /*
        *   set not used months undefined
        * */
        _.zipObject(_.keys(MONTHS)),
        toObject(
          years[year].map(r => r.date.getMonth())
        )
      );
      years[year].forEach(r => months[r.date.getMonth()].push(r));
      years[year] = months;
    });

    return years;
  }

  add(options) {
    Object.keys(options).forEach(key => {
      this.forEach(r => r[key] = options[key]);
    });
  }

  /*
  *   Delegate methods
  * */
  filter(callbackfn, thisArg) {
    return new Records(this.records.filter(callbackfn, thisArg));
  }

  forEach(callbackfn, thisArg) {
    this.records.forEach(callbackfn, thisArg);
  }

  count() {
    return this.records.length;
  }


}