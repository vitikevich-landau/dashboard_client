import { getRows, getRowValue } from "@/utils/dataSet";
import { Record } from "@/models/Record";

export const mergeRecords = (...records) => {
  const merged = new Records();
  records.forEach(recs => recs.records.forEach(rec => merged.records.push(rec)));

  return merged;
};

export class Records {
  constructor(workSheet) {
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
    const grouped = years
      .reduce(
        (acc, v) => {
          acc[v] = [];
          return acc;
        }, {}
      );

    this.records.forEach(r => grouped[r.date.getFullYear()].push(r));

    return grouped;
  }

  add(options) {
    Object.keys(options).forEach(key => {
      this.records.forEach(r => r[key] = options[key]);
    });
  }


  filter(callbackfn, thisArg = null) {
    return new Records(this.records.filter(callbackfn, thisArg));
  }

  count() {
    return this.records.length;
  }


}