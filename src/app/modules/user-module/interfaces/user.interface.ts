import { IdType } from '../../../shared/types/id.type';
import { OnlineEnum } from '../enums/online.enum';

export interface UserInterface {
  id: IdType<number>;
  avatar_url: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  phone_number: string;
  online: OnlineEnum;
  created_at: Date;
  updated_at: Date;
}
