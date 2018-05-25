/**
 * NEVER import like this - import { MyAwesomeFunction, MyAwesomeClass } from ".."; OR import { MyAwesomeFunction, MyAwesomeClass } from ".";
 * ALWAYS import like this - import { MyAwesomeClass } from '../my.awesome.class'; import { MyAwesomeFunction } from '../my.awesome.function';
 * AVOID ".." OR "." import destinations as this confuses typescript. Search and replace "." OR ".." for absolute destinations. Note double quotes were used here to make your search easier
 */
import { Component, BadRequestException } from '@nestjs/common';
import {
  User,
  UserToken,
  UserPassword,
  UserPasswordToken,
  Role,
  Message,
} from 'database';
import { IndexSet, RepoAllType, StitchSet } from '../core/core.database.util';
import { InjectRepo } from '../core/core.database.provider';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GenericEntityService } from './generic.entity.service';
import { CryptoService } from '../auth/crypto.service';

@Component()
export class UserService extends GenericEntityService<User> {
  constructor(
    @InjectRepo(UserToken) private readonly userRepository: Repository<User>,
    @InjectRepo(UserPasswordToken)
    private readonly userPasswordRepository: Repository<UserPassword>,
    private readonly cryptoService: CryptoService,
  ) {
    super('user', 'username');
  }
  fillWithRoles(
    users: User | User[] | Map<number, User>,
    indexedRoles: Map<number, Role>,
  ) {
    StitchSet(users, indexedRoles, u => [u.role.id], (u, r) => (u.role = r[0]));
  }

  fillWithMessages(
    users: User | User[] | Map<number, User>,
    indexedMessages: Map<number, Message>,
  ) {
    StitchSet(
      users,
      indexedMessages,
      u => u.messages.map(v => v.id),
      (u, m) => (u.messages = m),
    );
  }

  /**
   * A note about userRepository.find(). If you look at the user entity object, you will notice
   * that for the userPassword relation, the @JoinColumn decorator is used. This
   * means that a field exists user_password_id inside the user table.
   * Now since find() retrieves all columns available by default, it should also get user_password_id
   * We access this through the user.userPassword.id
   *
   * Generally however, find() will not populate subobjects unless specified using createQueryBuilder()
   * syntax. So don't look at this code and expect that find() will automatically retrieve relations and subobjects.
   * You need to be specific if you want that information.
   */

  //dedicated create function
  async create(user: User, password: string): Promise<number> {
    //Check for duplicates
    if (await this.existsByName(user.username)) {
      throw new BadRequestException('user already exists');
    }

    //Create user password first and save it
    let userPassword = new UserPassword();
    userPassword.hash = await this.cryptoService.hashPassword(password);
    await this.userPasswordRepository.save(userPassword);

    //Create user - this creates the user and creates the relationship between the userPassword object
    user.userPassword = userPassword;
    await this.userRepository.save(user);

    return user.id;
  }

  //dedicated update function
  async update(user: User, password?: string): Promise<number> {
    //Find actual database user object
    let _user = await this.userRepository.findOne({ id: user.id });
    if (!_user) {
      throw new BadRequestException('user does not exist');
    }

    //Only update the password if specified.
    if (password) {
      //Delete old password
      await this.userPasswordRepository.delete(_user.userPassword.id);

      //Create new password
      let userPassword = new UserPassword();
      userPassword.hash = await this.cryptoService.hashPassword(password);
      await this.userPasswordRepository.save(userPassword);

      //Associate new password with user
      _user.userPassword = userPassword;
      await this.userRepository.save(user);
    }

    //Update user record
    this.userRepository.save(user);

    return user.id;
  }

  //dedicated delete function
  async delete(user: User): Promise<number> {
    //Find actual database user object
    let _user = await this.userRepository.findOne({ id: user.id });
    if (!_user) {
      throw new BadRequestException('user does not exist');
    }

    //delete the user password associated with the user first
    //can't depend on foreign index actions here because the join column
    //is in the user table.
    await this.userPasswordRepository.delete(_user.userPassword.id);

    //fully delete the user
    await this.userRepository.delete(_user);

    //Update user record
    this.userRepository.save(user);

    return user.id;
  }

  protected createQuery() {
    return this.userRepository.createQueryBuilder(this.entity);
  }

  protected applyStems(query: SelectQueryBuilder<Role>) {
    return query
      .leftJoin('user.role', 'role')
      .addSelect('role.id')
      .leftJoin('user.messages', 'message')
      .addSelect('message.id');
  }
}