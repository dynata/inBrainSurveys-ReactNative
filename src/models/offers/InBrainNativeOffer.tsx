import { InBrainOfferPromotion } from './InBrainOfferPromotion'
import { InBrainOfferGoal } from './InBrainOfferGoal'

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
  categories?: string[]
  promotion?: InBrainOfferPromotion
  standardGoals?: InBrainOfferGoal[]
  purchaseGoals?: InBrainOfferGoal[]
}
