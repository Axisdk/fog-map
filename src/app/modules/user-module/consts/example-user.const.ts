import { UserInterface } from '../interfaces/user.interface';
import { IdType } from '../../../shared/types/id.type';
import { OnlineEnum } from '../enums/online.enum';

export const ExampleUserConst: UserInterface = {
  id: 1 as IdType<number>,
  avatar_url:
    'https://yandex-images.clstorage.net/97CKEt368/c557037OB526/nZf4RW-otx8dEjMC882xrmfLr2SjJFahyiotINcKsNjXI_GvLLLktup7GrBR7F2Qruy_sg6j2PTy1CtO76LZnwlSnOCL2LdOWaKXw1MMsPqmH54wgrQW1FrqO1NlfaeuUJDmKAsFQCPvnl_h4Dy8Fh14-PZZBHp11ybo6biEvKqdV_jkmstlj0jygABjz2DbxAvMk0MzVlE9XgiC5V-H38FzhpoZBcNjLZx_EXQerBXMbpgEGJZ7BzcUiUqr53yK7JWZJmgoFH7Is_PDE9yySMcbPmJDUTbgH234szc_dOyiQ5WLOLYjYV-OLVMXvC7HbtyodflkKeYVZ_j5GlXMqm3Wega5OycdaxGzYtGvkrsHi1wDYyCGkzxvm-AWP4aeskE1OAj0oJMfbm6DxP9f5p5_ykZLhloEpsUoqitl3pve9rkWOZq13niDUEKzbqCbx8j9QHCS5lAM3aiQ9Bw138EzJyppR3DDrg0_8XZ8XTV9rKpmejbrBJb3eBr6NU-brDVad2sYdn-7ArGQ8z7zaRcIzwLzIgaBf4_oQaWdFu8hQJfqivVAo15fXtIWnh43XG4L5-nlWoTXdQkbG4asiF3lKibZG-UcarGDIyKvYwvXi00xYwAEwR7f66AVjQXdAxH2OJlmANCPHX-CtH2uJK0ca8W5tBs05zfpyPml3Zh9VqsHSzsUDVuDcyCS7tNLlgs_oEGR1kP_vmrDtj427iMTRCq5p9OS_R8t0-fs7PTd76mlOidq19SX-BsrtL4a3sSqNUpJJf7ow-OCwU1xqmU4r1EzgsVBDc2J0ITNZswy8NZoO6TSs60NnIK3Ts93bm3INGhnyzXldfirm7Ueuw3kmkRqePRcCUNCgwAvA1sUK78y0OO3IW8fWFOHfITNgEO3iImF4xFMPp0xxsxdZ32eOYWYBWn0prW5qoo13ko8ZMjmGdiXrLqhA8ID3oAKl0qvANNB9qENfggAQ',
  // avatar_url: '',
  first_name: 'Roman',
  last_name: 'Ivanov',
  phone_number: '+77001231212',
  online: OnlineEnum.ONLINE,
  email: 'test123@mail.com',
  birthday: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
};
