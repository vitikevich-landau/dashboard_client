import _ from 'lodash';
import { Record } from "@/models/Record";

export class Records {
  #records;

  constructor(recordsArray) {
    if (recordsArray.some(r => r instanceof Record)) {
      this.#records = recordsArray;
    } else {
      this.#records = recordsArray
        .map(r => new Record(r[0], r[1], r[2], r[3], r[4], r[5]));
    }

  }

  /*
  *   for test
  * */
  get records() {
    return this.#records;
  }

  get years() {
    return _.uniq(this.#records.map(r => r.year)
      .sort((a, b) => a - b));
  }

  get accounts() {
    return _.uniq(this.#records.map(r => r.account));
  }

  get districts() {
    return _.uniq(this.#records.map(r => r.district));
  }

  get institutions() {
    return _.uniq(this.#records.map(r => r.institution));
  }

  get serviceTypes() {
    return _.uniq(this.#records.map(r => r.serviceType));
  }

  groupBy(fields) {
    let i = 0, len = fields.length - 1;

    const recursive = (rcs, i) =>
      i >= len
        ? _.groupBy(rcs, r => r[fields[i]])
        : _
          .mapValues(
            _.groupBy(rcs, r => r[fields[i]]),
            r => recursive(r, i + 1)
          );

    return recursive(this.#records, i);
  }

  filter(callbackfn, thisArg) {
    return new Records(this.#records.filter(callbackfn, thisArg));
  }

  count() {
    return _.values(this.#records).length;
  }
}