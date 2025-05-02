import { fakerJs } from "../../../core/config/faker.config";
import { ID } from "../../../core/types/form-schema.type";
import { v4 as uuid } from 'uuid';

export class CenterOfCost {
  id: ID;
  name: string;
  active: boolean;
  default: boolean;

  constructor(props: Partial<CenterOfCost>) {
    Object.assign(this, props);
    this.id = props.id || uuid();
  };

  static create(props?: Partial<CenterOfCost>): CenterOfCost {
    return new CenterOfCost({
      name: fakerJs.lorem.words({ min: 1, max: 2 }),
      active: true,
      default: false,
      ...props,
    });
  };

};