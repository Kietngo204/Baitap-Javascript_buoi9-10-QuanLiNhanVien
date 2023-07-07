function Staff(
  id,
  name,
  email,
  password,
  datepicker,
  salary,
  position,
  timeWork
) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.password = password;
  this.datepicker = datepicker;
  this.salary = salary;
  this.position = position;
  this.timeWork = timeWork;
}

Staff.prototype.totalSalary = function () {
  let total = 0;
  if (this.position === "Sếp") {
    total = this.salary * 3;
  } else if (this.position === "Trưởng phòng") {
    total = this.salary * 2;
  } else {
    total = this.salary;
  }
  return total;
};

Staff.prototype.employeeRating = function () {
  let rating = "";
  if (this.timeWork >= 192) {
    rating = "Nhân viên xuất sắc";
  } else if (this.timeWork >= 176) {
    rating = "Nhân viên giỏi";
  } else if (this.timeWork >= 160) {
    rating = "Nhân viên khá";
  } else {
    rating = "Nhân viên trung bình";
  }
  return rating;
};
