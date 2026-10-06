/**
 * Login for the /payload page. The handler itself lives in
 * ./_lib/plan-gate.js and is shared with /api/nucleus-auth.
 */

import { makeLoginHandler } from './_lib/plan-gate.js';
import { gate } from './_lib/payload-gate.js';

export default makeLoginHandler(gate);
