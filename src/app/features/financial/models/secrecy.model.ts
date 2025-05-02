import { fakerJs } from "../../../core/config/faker.config";
import { ID } from "../../../core/types/form-schema.type";
import { v4 as uuid } from 'uuid';

export class Secrecy {
  id: ID;
  name: string;
  active: boolean;
  default: boolean;

  constructor(props: Partial<Secrecy>) {
    Object.assign(this, props);
    this.id = props.id || uuid();
  };

  static create(props?: Partial<Secrecy>): Secrecy {
    return new Secrecy({
      name: fakerJs.lorem.words({ min: 1, max: 2 }),
      active: true,
      default: false,
      ...props,
    });
  };

};