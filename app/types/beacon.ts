import { BeaconDataSchema, BeaconEventResponseSchema, BeaconEventSchema } from "@/schemas/beacon";
import z from "zod";

export type BeaconData = z.infer<typeof BeaconDataSchema>;

export type BeaconEvent = z.infer<typeof BeaconEventSchema>;

export type BeaconEventResponse = z.infer<typeof BeaconEventResponseSchema>;
