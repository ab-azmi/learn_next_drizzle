import { Xendit  } from 'xendit-node';

export const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_WRITE_KEY!,
})
