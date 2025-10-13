import { randomUUID } from "crypto";

export const generatePoNumber = () => `PO-${randomUUID().split("-")[0].toUpperCase()}`;
