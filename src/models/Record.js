import XLSX from "xlsx";

export class Record {
  constructor(district, institution, date, serviceType, amount) {
    this.district = district;
    this.institution = institution;
    this.date_value = date;
    this.date = this._toJsDate();
    this.serviceType = serviceType;
    this.amount = amount;
  }

  getHumanDate() {
    return this._toHumanDate(this._toJsDate());
  }

  _toJsDate() {
    const date = XLSX.SSF.parse_date_code(this.date_value);
    return new Date(date.y, date.m - 1, date.d);
  }

  _toHumanDate(jsDate) {
    let dd = jsDate.getDate(),
      mm = jsDate.getMonth() + 1,
      yyyy = jsDate.getFullYear() % 100;

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (yyyy < 10) {
      yyyy = '0' + yyyy;
    }

    return `${ dd }.${ mm }.${ yyyy }`;
  }
}