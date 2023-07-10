// Danh sách nhân viên
let staffs = [];

// Biến kiểm tra xem form đã submit hay chưa
let isSubmitted = false;
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
}

// Thêm nhân viên
document.getElementById("btnThemNV").onclick = () => {
  isSubmitted = true;

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
  document.getElementById("tknv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "";
  document.getElementById("gioLam").value = "";

  document.getElementById("tbNgay").value = "";
  isSubmitted = false;
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
  document.getElementById("btnThemNV").disabled = true;
}

// Cập nhật nhân viên
document.getElementById("btnCapNhat").onclick = () => {
  isSubmitted = true;

  let staff = validate();
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
  if (isNaN(value)) {
    return false;
  }
  if (value.length < 4 || value.length > 6) {
    return false;
  }
  return true;
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
function validate() {
  let id = document.getElementById("tknv").value;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let datepicker = document.getElementById("datepicker").value;
  let salary = document.getElementById("luongCB").value;
  let position = document.getElementById("chucvu").value;
  let timeWork = document.getElementById("gioLam").value;

  let isValid = true;

  let spanID = document.getElementById("tbTKNV");
  if (!isRequired(id)) {
    isValid = false;
    spanID.style.display = "inline-block";
    spanID.innerHTML = "Tài khoản không được để trống";
  } else if (!isID(id)) {
    isValid = false;
    spanID.style.display = "inline-block";
    spanID.innerHTML = "Tài khoản phải là số và dài 4 -6 kí tự";
  }

  let spanName = document.getElementById("tbTen");
  if (!isRequired(name)) {
    isValid = false;
    spanName.style.display = "inline-block";
    spanName.innerHTML = "Tên nhân viên không được để trống";
  } else if (!isName(name)) {
    isValid = false;
    spanName.style.display = "inline-block";
    spanName.innerHTML = "Tên nhân viên không hợp lệ";
  }

  let spanEmail = document.getElementById("tbEmail");
  if (!isRequired(email)) {
    isValid = false;
    spanEmail.style.display = "inline-block";
    spanEmail.innerHTML = "Email không được để trống";
  } else if (!isEmail(email)) {
    isValid = false;
    spanEmail.style.display = "inline-block";
    spanEmail.innerHTML = "Email không hợp lệ";
  }

  let spanPw = document.getElementById("tbMatKhau");
  if (!isRequired(password)) {
    isValid = false;
    spanPw.style.display = "inline-block";
    spanPw.innerHTML = "Mật khẩu không được để trống";
  } else if (!isPassWord(password)) {
    isValid = false;
    spanPw.style.display = "inline-block";
    spanPw.innerHTML =
      "Mật khẩu bao gồm ít nhất 1 kí tự in hoa, 1 kí tự số và 1 kí tự đặc biệt";
  }

  let spanDate = document.getElementById("tbNgay");
  if (!isRequired(datepicker)) {
    isValid = false;
    spanDate.style.display = "inline-block";
    spanDate.innerHTML = "Ngày làm không được để trống";
  } else if (!isDate(datepicker)) {
    isValid = false;
    spanDate.style.display = "inline-block";
    spanDate.innerHTML = "Ngày làm không hợp lệ";
  }

  let spanSalary = document.getElementById("tbLuongCB");
  if (!isRequired(salary)) {
    isValid = false;
    spanSalary.style.display = "inline-block";
    spanSalary.innerHTML = "Tiền lương không được để trống";
  } else if (!isSalary(+salary)) {
    isValid = false;
    spanSalary.style.display = "inline-block";
    spanSalary.innerHTML =
      "Mức lương phải nằm trong khoảng từ 1.000.000 đến 20.000.000";
  }

  if (!isRequired(position)) {
    isValid = false;
    document.getElementById("tbChucVu").style.display = "inline-block";
    document.getElementById("tbChucVu").innerHTML = "Vui lòng chọn chức vụ";
  }

  let spanTimeWork = document.getElementById("tbGiolam");
  if (!isRequired(timeWork)) {
    isValid = false;
    spanTimeWork.style.display = "inline-block";
    spanTimeWork.innerHTML = "Giờ làm không được để trống";
  } else if (!isTimeWork(+timeWork)) {
    isValid = false;
    spanTimeWork.style.display = "inline-block";
    spanTimeWork.innerHTML =
      "Số giờ làm trong tháng phải từ 80 giờ đến 200 giờ";
  }

  if (isValid) {
    // form hợp lệ
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
  // Form không hợp lệ => Không tạo đối tượng
  return undefined;
}

document.getElementById("tknv").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanId = document.getElementById("tbTKNV");
  if (isRequired(event.target.value)) {
    spanId.innerHTML = "";
  } else {
    spanId.innerHTML = "Tài khoản không được để trống";
  }
};
document.getElementById("name").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanName = document.getElementById("tbTen");
  if (isRequired(event.target.value)) {
    spanName.innerHTML = "";
  } else {
    spanName.innerHTML = "Tên nhân viên không được để trống";
  }
};
document.getElementById("email").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanEmail = document.getElementById("tbEmail");
  if (isRequired(event.target.value)) {
    spanEmail.innerHTML = "";
  } else {
    spanEmail.innerHTML = "Email không được để trống";
  }
};
document.getElementById("password").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanPw = document.getElementById("tbMatKhau");
  if (isRequired(event.target.value)) {
    spanPw.innerHTML = "";
  } else {
    spanPw.innerHTML = "Mật khẩu không được để trống";
  }
};
document.getElementById("datepicker").oninput = (event) => {
  // if (!isSubmitted) {
  //   return;
  // }

  let spanDate = document.getElementById("tbNgay");
  if (isRequired(event.target.value)) {
    spanDate.innerHTML = "";
  } else {
    spanDate.innerHTML = "Ngày làm không được để trống";
  }
};
document.getElementById("luongCB").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanSalary = document.getElementById("tbLuongCB");
  if (isRequired(event.target.value)) {
    spanSalary.innerHTML = "";
  } else {
    spanSalary.innerHTML = "Tiền lương không được để trống";
  }
};
document.getElementById("chucvu").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanPosition = document.getElementById("tbChucVu");
  if (isRequired(event.target.value)) {
    spanPosition.innerHTML = "";
  } else {
    spanPosition.innerHTML = "Vui lòng chọn chức vụ";
  }
};
document.getElementById("gioLam").oninput = (event) => {
  if (!isSubmitted) {
    return;
  }

  let spanTimeWork = document.getElementById("tbGiolam");
  if (isRequired(event.target.value)) {
    spanTimeWork.innerHTML = "";
  } else {
    spanTimeWork.innerHTML = "Giờ làm không được để trống";
  }
};

document.getElementById("SapXepTang").onclick = () => {
  document.querySelector("th.nowrap").classList.toggle("change");
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

  staffs = staffs.sort(function (id1, id2) {
    return id1.id - id2.id;
  });
  display(staffs);
};

document.getElementById("SapXepGiam").onclick = () => {
  document.querySelector("th.nowrap").classList.toggle("change");
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

  staffs = staffs.sort(function (id1, id2) {
    return id2.id - id1.id;
  });
  display(staffs);
};
