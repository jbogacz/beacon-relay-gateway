import { helloApiDocs } from './hello';
import { beaconApiDocs } from './beacon';

export const apiDocs = {
  ...helloApiDocs,
  ...beaconApiDocs,
};
