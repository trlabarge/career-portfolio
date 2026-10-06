/**
 * Login for the /nucleus page. The handler itself lives in
 * ./_lib/plan-gate.js and is shared with /api/payload-auth.
 */

import { makeLoginHandler } from './_lib/plan-gate.js';
import { gate } from './_lib/nucleus-gate.js';

export default makeLoginHandler(gate);
