/**
 * InBrainOfferType enum
 */
export enum InBrainOfferType {
  default = 0,
  featured = 1,
  started = 2,
}

/**
 * InBrainOfferFilter
 *
 * @param type - Type of the Offers to be returned
 * @param limit - Maximum amount of offers to be returned (default: 10)
 * @param offset - Offset from the beginning of the list (default: 0)
 *
 * @important When using `started` type, the `limit` and `offset` parameters are ignored by the API
 */
export type InBrainOfferFilter = {
  type: InBrainOfferType
  limit?: number
  offset?: number
}
