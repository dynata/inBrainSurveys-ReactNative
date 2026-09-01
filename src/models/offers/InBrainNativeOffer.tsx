import { InBrainOfferPromotion } from './InBrainOfferPromotion'
import { InBrainOfferGoal } from './InBrainOfferGoal'
import { InBrainCurrencySale } from '../InBrainCurrencySale'

/**
 * Native Offer interface
 */
export type InBrainNativeOffer = {
  id: number
  title: string
  reward: number
  rewardString: string
  /**
   * The featured rank of the offer in the featured offers list.
   * @note Always `-1` for non-featured offers.
   */
  featuredRank: number
  thumbnailUrl?: string
  heroImageUrl?: string
  offerDescription?: string[]
  instructions?: string[]
  requirements?: string[]
  tags?: string[]
  categories?: string[]
  promotion?: InBrainOfferPromotion
  standardGoals?: InBrainOfferGoal[]
  purchaseGoals?: InBrainOfferGoal[]
  /**
   * The attribution window in minutes for not started offers.
   * @note Always `-1` for started offers.
   */
  attributionWindowMinutes: number
  /**
   * When the user started this offer.
   * @note Always `undefined` for not started offers.
   */
  attemptedAt?: Date
  /**
   * The deadline to complete this offer **in UTC timezone** for started offers.
   * @note Always `undefined` for not started offers.
   */
  completeBy?: Date
  campaignCurrencySale?: InBrainCurrencySale
}
