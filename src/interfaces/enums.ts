export enum Colors {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  DEFAULT = 'default',
  GREEN = 'green',
  YELLOW = 'yellow'
}

export enum DistrictTypes {
  QUAN = 'Quận',
  HUYEN = 'Huyện',
  THANH_PHO = 'Thành phố',
  THI_XA = 'Thị xã'
}

export enum PostVerifyStatuses {
  PENDING = 1,
  APPROVED = 2,
  DENIED = 0
}

export enum PostVerifyStatusTexts {
  PENDING = 'Chờ duyệt',
  APPROVED = 'Đã duyệt',
  DENIED = 'Đã từ chối'
}

export enum UserTypes {
  ROOT = 0,
  ADMIN = 1,
  EMPLOYEE = 2
}

export enum UserTypeTexts {
  ROOT = 'ROOT',
  ADMIN = 'Quản trị viên',
  EMPLOYEE = 'Nhân viên'
}

export enum UserVerifyStatusTexts {
  VEFIRIED = 'Đã xác thực',
  UNVERIFY = 'Chưa xác thực'
}

export enum WardTypes {
  XA = 'Xã',
  PHUONG = 'Phường',
  THI_TRAN = 'Thị trấn'
}
