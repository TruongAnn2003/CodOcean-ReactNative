const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

//số điện thoại có 10 chữ số
const validatePhoneNumber = (phoneNumber) => {
  const regex = /^\d{10}$/;
  return regex.test(phoneNumber);
};

// Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái, một số và một ký tự đặc biệt
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
export { validateEmail, validatePassword, validatePhoneNumber };
