import { InBrainOfferPromotion } from './InBrainOfferPromotion'

/**
 * Offer Goal interface
 */
export type InBrainOfferGoal = {
  id: number
  title: string
  goalDescription: string
  reward: number
  rewardString: string
  isCompleted: boolean
  /**
   * The display order of the goal. Always `-1` if not specified.
   */
  sortOrder: number
  /**
   * The attribution window in minutes for not started offers. Always `-1` for started offers.
   */
  attributionWindowMinutes: number
  /**
   * The deadline to complete this goal **in UTC timezone** for started offers. Always `undefined` for not started offers.
   */
  completeBy?: Date
  promotion?: InBrainOfferPromotion
}
