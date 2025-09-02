import { PllID } from "@pollaris";
import { v4 as uuid } from 'uuid';

export type PllUserModel = {
  id: PllID;
  name: string;
  email: string;
  score: number;
  permissions: string[];
  superUser: boolean;
};

export type PllExternalUserModel = Omit<PllUserModel, "permissions"> & {
  permissions: string;
};

export function createMockedPllUser(data: Partial<PllUserModel> = {}): PllUserModel {
  const record: PllUserModel = {
    name: "Jhon Doe",
    email: "jhondoe@gmail.com",
    score: 10,
    permissions: ["CREATE_PAYABLE", "CREATE_RECEIVABLE"],
    superUser: false,
    ...data,
    id: data.id || uuid(),
  };
  return record;
};