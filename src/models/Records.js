import {getRows, getRowValue} from "@/utils/dataSet";
import {Record} from "@/models/Record";

export class Records {
  constructor(workSheet) {
    this.records = getRows(workSheet, getRowValue)
      /*
      *   skip titles
      * */
      .slice(1)
      .map(row => new Record(row[0], row[1], row[2], row[3], row[4]));
  }

  get(indx) {
    return this.records[indx];
  }

  getDistricts() {
    return this.records.map(r => r['district']);
  }

  getDistrictsUniq() {
    return [...new Set(this.getDistricts())];
  }

  getInstitutions() {
    return this.records.map(r => r['institution']);
  }

  getInstitutionUniq() {
    return [...new Set(this.getInstitutions())];
  }

  getDates() {
    return this.records.map(r => r['date']);
  }

  getServiceType() {
    return this.records.map(r => r['serviceType']);
  }

  getServiceTypeUniq() {
    return [...new Set(this.getServiceType())];
  }

  getAmounts() {
    return this.records.map(r => r['amount']);
  }

  count() {
    return this.records.length;
  }

  /*
  *   Break point
  *
  *   Добавить остальные
  * */
}