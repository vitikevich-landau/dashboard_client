import XLSX from "xlsx";

export class Record {
  constructor(district, institution, date, serviceType, amount, accountingSection) {
    this.district = district;
    this.institution = institution;
    this.dateValue = date;
    this.serviceType = serviceType;
    this.amount = amount;
    this.account = accountingSection;

    this.date = toJSDate(date);
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();


    function toJSDate(dateValue) {
      const date = XLSX.SSF.parse_date_code(dateValue);
      return new Date(date.y, date.m - 1, date.d);
    }
  }

  toHumanDate() {
    let dd = this.date.getDate(),
      mm = this.month + 1,
      yyyy = this.year % 100;

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