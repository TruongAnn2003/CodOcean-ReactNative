import moment from 'moment';

/**
 * Chuyển đổi một ngày từ định dạng string thành ISO 8601 (với giờ là 00:00:00).
 * @param {string} date - Ngày cần chuyển đổi (ví dụ: '2024-10-19').
 * @returns {string} - Ngày đã được chuyển đổi về định dạng ISO 8601 (ví dụ: '2024-10-19T00:00:00.000Z').
 */
export const formatDateToISO = (date) => {
  return moment(date).startOf('day').toISOString();
};

/**
 * Kiểm tra xem một chuỗi có phải là ngày hợp lệ hay không.
 * @param {string} date - Ngày cần kiểm tra.
 * @returns {boolean} - True nếu là ngày hợp lệ, false nếu không.
 */
export const isValidDate = (date) => {
  return moment(date, 'YYYY-MM-DD', true).isValid();
};

/**
 * Chuyển đổi ngày từ ISO 8601 về định dạng 'YYYY-MM-DD'.
 * @param {string} date - Ngày cần chuyển đổi (ISO 8601).
 * @returns {string} - Ngày đã được chuyển đổi về định dạng 'YYYY-MM-DD'.
 */
export const formatISOToDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Lấy ngày hiện tại với định dạng ISO 8601.
 * @returns {string} - Ngày hiện tại theo định dạng ISO 8601 (với giờ là 00:00:00).
 */
export const getCurrentDateISO = () => {
  return moment().startOf('day').toISOString();
};
