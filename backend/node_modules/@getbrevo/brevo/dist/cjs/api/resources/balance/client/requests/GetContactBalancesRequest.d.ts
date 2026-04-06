/**
 * @example
 *     {
 *         pid: "pid"
 *     }
 */
export interface GetContactBalancesRequest {
    /** Loyalty Program Id */
    pid: string;
    /** Include balances tied to internal definitions. */
    includeInternal?: boolean;
}
