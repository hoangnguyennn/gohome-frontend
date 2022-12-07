import {
  GoldOutlined,
  ProfileOutlined,
  TableOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { IMenuItem } from '~/interfaces'
import {
  DistrictTypes,
  PostVerifyStatuses,
  PostVerifyStatusTexts,
  UserTypes,
  UserTypeTexts,
  UserVerifyStatusTexts,
  WardTypes
} from '~/interfaces/enums'

export const DISTRICT_TYPES = [
  {
    value: DistrictTypes.QUAN,
    title: DistrictTypes.QUAN
  },
  {
    value: DistrictTypes.HUYEN,
    title: DistrictTypes.HUYEN
  },
  {
    value: DistrictTypes.THANH_PHO,
    title: DistrictTypes.THANH_PHO
  },
  {
    value: DistrictTypes.THI_XA,
    title: DistrictTypes.THI_XA
  }
]

export const POST_VERIFY_STATUSES = [
  {
    value: PostVerifyStatuses.PENDING,
    text: PostVerifyStatusTexts.PENDING
  },
  {
    value: PostVerifyStatuses.APPROVED,
    text: PostVerifyStatusTexts.APPROVED
  },
  {
    value: PostVerifyStatuses.DENIED,
    text: PostVerifyStatusTexts.DENIED
  }
]

export const WARD_TYPES = [
  {
    value: WardTypes.XA,
    title: WardTypes.XA
  },
  {
    value: WardTypes.PHUONG,
    title: WardTypes.PHUONG
  },
  {
    value: WardTypes.THI_TRAN,
    title: WardTypes.THI_TRAN
  }
]

export const USER_TYPES = [
  {
    value: UserTypes.ROOT,
    title: UserTypeTexts.ROOT
  },
  {
    value: UserTypes.ADMIN,
    title: UserTypeTexts.ADMIN
  },
  {
    value: UserTypes.EMPLOYEE,
    title: UserTypeTexts.EMPLOYEE
  }
]

export const USER_VERIFY_STATUSES = [
  {
    value: 1,
    title: UserVerifyStatusTexts.VEFIRIED
  },
  {
    value: 0,
    title: UserVerifyStatusTexts.UNVERIFY
  }
]

export const menuItems: IMenuItem[] = [
  {
    id: '5',
    title: 'Bài đăng',
    icon: TableOutlined,
    permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE],
    children: [
      {
        id: '5_1',
        title: 'Danh sách',
        link: '/posts',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE]
      },
      {
        id: '5_2',
        title: 'Danh sách (đã thuê)',
        link: '/posts/rented',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE]
      },
      {
        id: '5_3',
        title: 'Thêm mới',
        link: '/posts/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN, UserTypes.EMPLOYEE]
      }
    ]
  },
  {
    id: '1',
    title: 'Loại nhà đất',
    icon: GoldOutlined,
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '1_1',
        title: 'Danh sách',
        link: '/categories',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      },
      {
        id: '1_2',
        title: 'Thêm mới',
        link: '/categories/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  },
  {
    id: '2',
    title: 'Quận huyện',
    icon: ProfileOutlined,
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '2_1',
        title: 'Danh sách',
        link: '/districts',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      },
      {
        id: '2_2',
        title: 'Thêm mới',
        link: '/districts/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  },
  {
    id: '3',
    title: 'Xã phường',
    icon: ProfileOutlined,
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '3_1',
        title: 'Danh sách',
        link: '/wards',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      },
      {
        id: '3_2',
        title: 'Thêm mới',
        link: '/wards/create',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  },
  {
    id: '4',
    title: 'Người dùng',
    icon: UserOutlined,
    permissions: [UserTypes.ROOT, UserTypes.ADMIN],
    children: [
      {
        id: '4_1',
        title: 'Danh sách',
        link: '/users',
        permissions: [UserTypes.ROOT, UserTypes.ADMIN]
      }
    ]
  }
]

export const ITEMS_PER_PAGE_DEFAULT = 10

export const SHOW_HIDE_OPTIONS = [
  {
    text: 'Tất cả',
    value: -1
  },
  {
    text: 'Ẩn',
    value: 1
  },
  {
    text: 'Hiện',
    value: 0
  }
]
