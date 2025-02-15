import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Account } from './account.entity';
import { Vehicle } from '../../../renting-management/domain/entities/vehicle.entity';
import { RentingOrderItem } from '../../../renting-management/domain/entities/renting-order-item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  userName: string;

  @Column('text')
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text', {
    select: false,
  })
  roles: string[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profile: Profile;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
    eager: true,
  })
  account: Account;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
  vehicles: Vehicle[];

  @OneToMany(() => RentingOrderItem, (rentingItem) => rentingItem.requester)
  rentingOrderItems: RentingOrderItem[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
