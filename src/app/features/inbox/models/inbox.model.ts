import { PllID } from '@pollaris';

export type InboxStatus = "PENDING" | "PROCESSED" | "OVERDUE" | "CANCELLED";
export type InboxPriority = "LOW" | "MEDIUM" | "HIGH";

export class Inbox {
  id: PllID;
  title: string;
  status: InboxStatus;
  priority: InboxPriority;
  createdAt: Date;
  cancelledAt: Date;
  processedAt: Date;
  dueAt: Date;

  constructor(props: Partial<Inbox>) {
    Object.assign(this, props);
  };
};