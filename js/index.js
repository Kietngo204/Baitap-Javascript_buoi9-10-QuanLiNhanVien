// Danh sách nhân viên
let staffs = [];

init();

// Hàm init khởi tạo danh sách nhân viên nếu có
function init() {
  staffs = JSON.parse(localStorage.getItem("staffs")) || [];

  staffs = staffs.map((value) => {
    return new Staff(
      value.id,
      value.name,
      value.email,
      value.password,
      value.datepicker,
      value.salary,
      value.position,
      value.timeWork
    );
  });

  display(staffs);
  //
}

document.getElementById("btnThem").onclick = () => {
  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("btnThemNV").style.display = "inline-block";
  resetForm();
};

// Thêm nhân viên
document.getElementById("btnThemNV").onclick = () => {
  // Gọi tới hàm validate
  let staff = validate();

  if (!staff) {
    return;
  }
  // Thêm đối tượng vào danh sách
  staffs.push(staff);
  localStorage.setItem("staffs", JSON.stringify(staffs));

  // Hiển thị ra giao diện
  display(staffs);

  // resetForm
  resetForm();
};

// Hàm hiển thị giao diện
function display(staffs) {
  let html = staffs.reduce((result, value) => {
    return (
      result +
      `
    <tr>
    <td>${value.id}</td>
    <td>${value.name}</td>
    <td>${value.email}</td>
    <td>${value.datepicker}</td>
    <td>${value.position}</td>
    <td>${value.totalSalary()}</td>
    <td>${value.employeeRating()}</td>
    <td>
    <div class = "d-flex">
    <button 
      class = "btn btn-success" 
      onclick = "selectStaff('${value.id}')" 
      data-toggle="modal" 
      data-target="#myModal"
    >Chỉnh sửa</button>
    <button 
      class = "btn btn-danger ml-2" 
      onclick = "removeStaff('${value.id}')"
      >Xoá</button>
    </div>
    </td>
    </tr>
    `
    );
  }, "");

  document.getElementById("tableDanhSach").innerHTML = html;
}

// Hàm resetForm
function resetForm() {
  document.querySelectorAll(".sp-thongbao").forEach((e) => {
    e.style.display = "none";
  });
  document.getElementById("tknv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";

  document.getElementById("tbNgay").value = "";
  document.getElementById("tknv").disabled = false;
}

// Tìm loại nhân viên
document.getElementById("btnTimNV").onclick = () => {
  let search = document.getElementById("searchName").value;
  search = search.trim().toLowerCase();
  let newStaffs = staffs.filter((value) => {
    let rating = value.employeeRating().trim().toLowerCase();
    return rating.includes(search);
  });
  // Hiển thị
  display(newStaffs);
};

// Hàm xoá nhân viên
function removeStaff(staffId) {
  // let index = staffs.findIndex((value) => {
  //   return value.id === staffId;
  // });
  // if (index !== -1) {
  //   staffs.splice(index, 1);
  // }

  staffs = staffs.filter((value) => {
    return value.id !== staffId;
  });
  localStorage.setItem("staffs", JSON.stringify(staffs));

  display(staffs);
}

// Hàm chỉnh sửa nhân viên
function selectStaff(staffId) {
  resetForm();
  document.getElementById("btnCapNhat").style.display = "inline-block";
  let staff = staffs.find((value) => {
    return value.id === staffId;
  });

  document.getElementById("tknv").value = staff.id;
  document.getElementById("name").value = staff.name;
  document.getElementById("email").value = staff.email;
  document.getElementById("password").value = staff.password;
  document.getElementById("datepicker").value = staff.datepicker;
  document.getElementById("luongCB").value = staff.salary;
  document.getElementById("chucvu").value = staff.position;
  document.getElementById("gioLam").value = staff.timeWork;

  //Disable id and button add
  document.getElementById("tknv").disabled = true;
  document.getElementById("btnThemNV").style.display = "none";
}

// Cập nhật nhân viên
document.getElementById("btnCapNhat").onclick = () => {
  let staff = validate((isUpdate = true));
  console.log(staff);
  if (!staff) {
    return;
  }

  // Tìm index phần tử staffs cần cập nhật và thay thế cho index
  let index = staffs.findIndex((value) => {
    return value.id === staff.id;
  });

  staffs[index] = staff;
  localStorage.setItem("staffs", JSON.stringify(staffs));

  // Hiển thị
  display(staffs);

  document.getElementById("tknv").disabled = false;
  document.getElementById("btnThemNV").disabled = false;

  // resetForm
  resetForm();
};

// Hàm kiểm tra giá trị rỗng
function isRequired(value) {
  if (!value.trim()) {
    return false;
  }
  return true;
}

// Hàm kiểm tra tài khoản
function isID(value) {
  let regex = /^[a-z0-9_.]+$/;

  if (value.length < 4 || value.length > 6) {
    return false;
  }
  return regex.test(value);
}

// Check id tồn tại
function checkIdExist(id) {
  let vs = staffs.find((value) => {
    return value.id == id;
  });
  return vs !== undefined;
}
// Hàm kiểm tra tên nhân viên
function isName(value) {
  regex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
  return regex.test(value);
}

// Hàm kiểm tra lương
function isSalary(value) {
  if (isNaN(value)) {
    return false;
  }
  if (value < 1e6 || value > 2e7) {
    return false;
  }
  return true;
}

// Hàm kiểm tra ngày làm
function isDate(value) {
  let regex =
    /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)[0-9]{2})$/;
  if (regex.test(value)) {
    try {
      console.log(value);
      let arrStr = value.split("/");

      let date = Number.parseInt(arrStr[1]);
      let month = Number.parseInt(arrStr[0]) - 1;
      let year = Number.parseInt(arrStr[2]);

      let dt = new Date(year, month, date);

      if (
        dt.getDate() != date ||
        dt.getMonth() != month ||
        dt.getFullYear() != year
      ) {
        return false;
      }
      console.log(dt);
      return true;
    } catch (ex) {
      return false;
    }
  }
  return regex.test(value);
}

// Hàm kiểm tra giờ làm
function isTimeWork(value) {
  if (isNaN(value)) {
    return false;
  }
  if (value < 80 || value > 200) {
    return false;
  }
  return true;
}

// Hàm kiểm tra email
function isEmail(value) {
  let regex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  return regex.test(value);
}

// Hàm kiểm tra mật khẩu
function isPassWord(value) {
  let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,10}$/;
  return regex.test(value);
}

// Hàm kiểm tra thông tin của staff có hợp lệ hay không
function validate(isUpdate = false) {
  let id = validateID(isUpdate);
  let name = validateName();
  let email = validateEmail();
  let password = validatePassword();
  let datepicker = validateDate();
  let salary = validateSalary();
  let position = validatePosition();
  let timeWork = validateTimeWork();
  if (id === "") return undefined;

  if (name === "") {
    return undefined;
  }

  if (email === "") {
    return undefined;
  }

  if (password === "") {
    return undefined;
  }

  if (datepicker === "") {
    return undefined;
  }

  if (salary === "") {
    return undefined;
  }

  if (position === "") {
    return undefined;
  }

  if (timeWork === "") {
    return undefined;
  }

  let staff = new Staff(
    id,
    name,
    email,
    password,
    datepicker,
    +salary,
    position,
    +timeWork
  );
  return staff;
}

// validation

function validateID(isUpdate = false) {
  let id = document.getElementById("tknv").value;
  let spanID = document.getElementById("tbTKNV");
  if (!isRequired(id)) {
    spanID.style.display = "inline-block";
    spanID.innerHTML = "Tài khoản không được để trống";
    return "";
  } else if (!isID(id)) {
    spanID.style.display = "inline-block";
    spanID.innerHTML = "Tài khoản không hợp lệ";
    return "";
  }

  if (!isUpdate && checkIdExist(id)) {
    spanID.style.display = "inline-block";
    spanID.innerHTML = "Tài khoản đã tồn tại";
    return "";
  }

  return id;
}
function validateName() {
  let name = document.getElementById("name").value;
  let spanName = document.getElementById("tbTen");
  if (!isRequired(name)) {
    spanName.style.display = "inline-block";
    spanName.innerHTML = "Tên nhân viên không được để trống";
    return "";
  } else if (!isName(name)) {
    spanName.style.display = "inline-block";
    spanName.innerHTML = "Tên nhân viên không hợp lệ";
    return "";
  }
  return name;
}
function validateEmail() {
  let email = document.getElementById("email").value;
  let spanEmail = document.getElementById("tbEmail");
  if (!isRequired(email)) {
    spanEmail.style.display = "inline-block";
    spanEmail.innerHTML = "Email không được để trống";
    return "";
  } else if (!isEmail(email)) {
    spanEmail.style.display = "inline-block";
    spanEmail.innerHTML = "Email không hợp lệ";
    return "";
  }
  return email;
}
function validatePassword() {
  let password = document.getElementById("password").value;
  let spanPw = document.getElementById("tbMatKhau");
  if (!isRequired(password)) {
    spanPw.style.display = "inline-block";
    spanPw.innerHTML = "Mật khẩu không được để trống";
    return "";
  } else if (!isPassWord(password)) {
    spanPw.style.display = "inline-block";
    spanPw.innerHTML =
      "Mật khẩu bao gồm ít nhất 1 kí tự in hoa, 1 kí tự số và 1 kí tự đặc biệt";
    return "";
  }
  return password;
}
function validateDate() {
  let datepicker = document.getElementById("datepicker").value;
  let spanDate = document.getElementById("tbNgay");
  if (!isRequired(datepicker)) {
    spanDate.style.display = "inline-block";
    spanDate.innerHTML = "Ngày làm không được để trống";
  } else if (!isDate(datepicker)) {
    spanDate.style.display = "inline-block";
    spanDate.innerHTML = "Ngày làm không hợp lệ";
  }
  return datepicker;
}
function validateSalary() {
  let salary = document.getElementById("luongCB").value;
  let spanSalary = document.getElementById("tbLuongCB");
  if (!isRequired(salary)) {
    spanSalary.style.display = "inline-block";
    spanSalary.innerHTML = "Tiền lương không được để trống";
    return "";
  } else if (!isSalary(+salary)) {
    spanSalary.style.display = "inline-block";
    spanSalary.innerHTML =
      "Mức lương phải nằm trong khoảng từ 1.000.000 đến 20.000.000";
    return "";
  }
  return salary;
}
function validatePosition() {
  let position = document.getElementById("chucvu").value;
  if (position == "") {
    document.getElementById("tbChucVu").style.display = "inline-block";
    document.getElementById("tbChucVu").innerHTML = "Vui lòng chọn chức vụ";
  }

  return position;
}
function validateTimeWork() {
  let timeWork = document.getElementById("gioLam").value;
  let spanTimeWork = document.getElementById("tbGiolam");
  if (!isRequired(timeWork)) {
    spanTimeWork.style.display = "inline-block";
    spanTimeWork.innerHTML = "Giờ làm không được để trống";
  } else if (!isTimeWork(+timeWork)) {
    spanTimeWork.style.display = "inline-block";
    spanTimeWork.innerHTML =
      "Số giờ làm trong tháng phải từ 80 giờ đến 200 giờ";
  }
  return timeWork;
}

// OnInput

document.getElementById("tknv").oninput = (event) => {
  let spanId = document.getElementById("tbTKNV");
  if (isRequired(event.target.value)) {
    spanId.innerHTML = "";
    spanId.style.display = "none";
  } else {
    spanId.style.display = "inline-block";
    spanId.innerHTML = "Tài khoản không được để trống";
  }
};

document.getElementById("name").oninput = (event) => {
  let spanName = document.getElementById("tbTen");
  if (isRequired(event.target.value)) {
    spanName.innerHTML = "";
    spanName.style.display = "none";
  } else {
    spanName.style.display = "inline-block";
    spanName.innerHTML = "Tên nhân viên không được để trống";
  }
};
document.getElementById("email").oninput = (event) => {
  let spanEmail = document.getElementById("tbEmail");
  if (isRequired(event.target.value)) {
    spanEmail.innerHTML = "";
    spanEmail.style.display = "none";
  } else {
    spanEmail.style.display = "inline-block";
    spanEmail.innerHTML = "Email không được để trống";
  }
};
document.getElementById("password").oninput = (event) => {
  let spanPw = document.getElementById("tbMatKhau");
  if (isRequired(event.target.value)) {
    spanPw.innerHTML = "";
    spanPw.style.display = "none";
  } else {
    spanPw.style.display = "inline-block";
    spanPw.innerHTML = "Mật khẩu không được để trống";
  }
};
document.getElementById("datepicker").oninput = (event) => {
  let spanDate = document.getElementById("tbNgay");
  if (isRequired(event.target.value)) {
    spanDate.innerHTML = "";
    spanDate.style.display = "none";
  } else {
    spanDate.style.display = "inline-block";
    spanDate.innerHTML = "Ngày làm không được để trống";
  }
};
document.getElementById("luongCB").oninput = (event) => {
  let spanSalary = document.getElementById("tbLuongCB");
  if (isRequired(event.target.value)) {
    spanSalary.innerHTML = "";
    spanSalary.style.display = "none";
  } else {
    spanSalary.style.display = "inline-block";
    spanSalary.innerHTML = "Tiền lương không được để trống";
  }
};
document.getElementById("chucvu").oninput = (event) => {
  let spanPosition = document.getElementById("tbChucVu");
  if (isRequired(event.target.value)) {
    spanPosition.innerHTML = "";
    spanPosition.style.display = "none";
  } else {
    spanPosition.style.display = "inline-block";
    spanPosition.innerHTML = "Vui lòng chọn chức vụ";
  }
};
document.getElementById("gioLam").oninput = (event) => {
  let spanTimeWork = document.getElementById("tbGiolam");
  if (isRequired(event.target.value)) {
    spanTimeWork.innerHTML = "";
    spanTimeWork.style.display = "none";
  } else {
    spanTimeWork.style.display = "inline-block";
    spanTimeWork.innerHTML = "Giờ làm không được để trống";
  }
};

// Onchange
document.getElementById("datepicker").onchange = (event) => {
  let spanDate = document.getElementById("tbNgay");
  if (isRequired(event.target.value)) {
    spanDate.innerHTML = "";
    spanDate.style.display = "none";
  } else {
    spanDate.style.display = "inline-block";
    spanDate.innerHTML = "Ngày làm không được để trống";
  }
};

// OnfocusOut
document.getElementById("tknv").onfocusout = (event) => {
  validateID();
};
document.getElementById("name").onfocusout = (event) => {
  validateName();
};
document.getElementById("email").onfocusout = (event) => {
  validateEmail();
};
document.getElementById("password").onfocusout = (event) => {
  validatePassword();
};
document.getElementById("datepicker").onfocusout = (event) => {
  validateDate();
};
document.getElementById("luongCB").onfocusout = (event) => {
  validateSalary();
};
document.getElementById("chucvu").onfocusout = (event) => {
  validatePosition();
};
document.getElementById("gioLam").onfocusout = (event) => {
  validateTimeWork();
};

// KeyDown

var invalidChars = ["-", "+", "e", "E", "D", "d"];

$("input[type = 'number']").bind("keydown", (event) => {
  if (invalidChars.includes(event.key)) {
    event.preventDefault();
  }
});

// Sắp xếp tăng giảm
document.getElementById("SapXepTang").onclick = () => {
  document.querySelector("th.nowrap").classList.toggle("change");
  staffs = staffs.sort(function (id1, id2) {
    return id1.id.localeCompare(id2.id);
  });
  display(staffs);
};

document.getElementById("SapXepGiam").onclick = () => {
  document.querySelector("th.nowrap").classList.toggle("change");
  staffs = staffs.sort(function (id1, id2) {
    return id2.id.localeCompare(id1.id);
  });
  display(staffs);
};
