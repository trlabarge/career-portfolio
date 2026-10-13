/**
 * Login for the /magicare page. The handler itself lives in
 * ./_lib/plan-gate.js and is shared with /api/payload-auth and /api/nucleus-auth.
 */

import { makeLoginHandler } from './_lib/plan-gate.js';
import { gate } from './_lib/magicare-gate.js';

export default makeLoginHandler(gate);
