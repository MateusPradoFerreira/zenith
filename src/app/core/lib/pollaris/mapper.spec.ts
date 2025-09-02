import { PllRecordMapper } from "@pollaris";
import { createMockedPllUser, PllExternalUserModel, PllUserModel } from "./user.model";

export class InboxMapper extends PllRecordMapper<PllUserModel, PllExternalUserModel> {
  override to(data: PllUserModel): PllExternalUserModel {
    const record: PllExternalUserModel = {
      ...data,
      permissions: data.permissions.join(","),
    };
    return record;
  };

  override from(data: PllExternalUserModel): PllUserModel {
    const record: PllUserModel = {
      ...data,
      permissions: data.permissions.split(","),
    };
    return record;
  };
};

describe("PollarisMapper", () => {
  const mapper = new InboxMapper();

  it("must correctly map internal data to external data", () => {
    const record: PllUserModel = createMockedPllUser();
    const mappedInbox = mapper.to(record);
    expect(mappedInbox).toEqual({ ...record, permissions: record.permissions.join(",") });
  });

  it("must correctly map external data to internal data", () => {
    const record: PllExternalUserModel = { ...createMockedPllUser(), permissions: "" };
    const mappedInbox = mapper.from(record);
    expect(mappedInbox).toEqual({ ...record, permissions: record.permissions.split(",") });
  });
});