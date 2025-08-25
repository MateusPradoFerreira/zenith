import { Inbox } from "../models/inbox.model";
import { createMockedInbox } from "../services/inbox-mock.service";
import { InboxMapper } from "./inbox.mapper";

describe("InboxMapper", () => {
  const mapper = new InboxMapper();

  it("must correctly map internal data to external data", () => {
    const inbox: Inbox = createMockedInbox({ title: "Mocked Inbox" });
    const mappedInbox = mapper.to(inbox);
    expect(mappedInbox).toEqual(inbox);
  });

  it("must correctly map external data to internal data", () => {
    const inbox: Inbox = createMockedInbox({ title: "Mocked Inbox" });
    const mappedInbox = mapper.from(inbox);
    expect(mappedInbox).toEqual(inbox);
  });
});