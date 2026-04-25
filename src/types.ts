export type NotifyToolInput = {
  message: string;
};

export type NotifyToolOutput = {
  delivered: boolean;
  telegram_message_id: number;
};

export type Notifier = {
  notify(message: string): Promise<NotifyToolOutput>;
};
