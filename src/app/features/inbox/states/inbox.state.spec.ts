import { Inbox } from "../models/inbox.model";
import { createMockedInbox } from "../services/inbox-mock.service";
import { InboxState } from "./inbox.state";

describe("InboxState", () => {
  const state = new InboxState();

  const data: Inbox[] = [
    createMockedInbox({ title: "Mocked Inbox 1" }),
    createMockedInbox({ title: "Mocked Inbox 2" }),
    createMockedInbox({ title: "Mocked Inbox 3" }),
  ];

  const inbox: Inbox = createMockedInbox({ title: "Inserted Inbox" });

  it("must set the inbox data in the state", () => {
    state.set(data);
    expect(data).toEqual(state.records());
  });

  it("must insert the inbox data in the state", () => {
    state.insert(inbox);
    expect(inbox).toEqual(state.get(inbox.id));
  });

  it("must insert many the inbox data in the state", () => {
    const data: Inbox[] = [
      createMockedInbox({ title: "Mocked Inbox 4" }),
      createMockedInbox({ title: "Mocked Inbox 5" }),
    ];

    state.insertMany(data);
    expect(data.every(record => state.records().map(rec => rec.id).includes(record.id))).toBeTrue();
  });

  it("must update the inbox data in the state", () => {
    state.update({ ...inbox, title: "Updated Inbox" });
    expect(state.get(inbox.id)?.title).toEqual("Updated Inbox");
  });

  it("must get null of invalid inbox data in the state", () => {
    expect(state.get("123")).toBeNull();
  });

  it("must clear inbox state data", () => {
    state.clear();
    expect(state.records().length).toEqual(0);
  });
});