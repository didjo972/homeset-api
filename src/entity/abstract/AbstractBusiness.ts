import {ManyToOne} from 'typeorm';
import AbstractEntity from './AbstractEntity';
import {User} from '../user/User';

abstract class AbstractBusiness extends AbstractEntity {
  @ManyToOne(() => User, {eager: true})
  public owner: User;

  // FIXME Find a solution
  // @ManyToOne(() => Group)
  // public group: Group;

  constructor(id?: number) {
    super(id);
  }
}

export default AbstractBusiness;
