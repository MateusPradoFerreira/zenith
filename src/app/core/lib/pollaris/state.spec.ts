import { PllRecordState } from "@pollaris";
import { createMockedPllUser, PllUserModel } from "./user.model";

export class PllUserState extends PllRecordState<PllUserModel> {};

describe("PollarisState", () => {
  const state = new PllUserState();

  const data: PllUserModel[] = [
    createMockedPllUser(),
  ];

  const record: PllUserModel = createMockedPllUser({ name: "Inserted PllUserState" });

  it("must set the record data in the state", () => {
    state.set(data);
    expect(data).toEqual(state.records());
  });

  it("must insert the pllUser data in the state", () => {
    state.insert(record);
    expect(record).toEqual(state.get(record.id));
  });

  it("must insert many the pllUser data in the state", () => {
    const data: PllUserModel[] = [
      createMockedPllUser({ name: "Mocked PllUserState 4" }),
      createMockedPllUser({ name: "Mocked PllUserState 5" }),
    ];

    state.insertMany(data);
    expect(data.every(record => state.records().map(rec => rec.id).includes(record.id))).toBeTrue();
  });

  it("must update the record data in the state", () => {
    const updatedPllUserState = { ...record, name: "Updated Jhon Doe" };
    state.update(updatedPllUserState);
    expect(state.get(record.id)).toEqual(updatedPllUserState);
  });

  it("must get null of invalid record data in the state", () => {
    expect(state.get("123")).toBeNull();
  });

  it("must clear record state data", () => {
    state.clear();
    expect(state.records().length).toEqual(0);
  });
});