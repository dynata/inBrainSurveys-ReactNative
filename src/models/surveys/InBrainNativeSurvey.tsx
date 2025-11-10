import { Category } from './Category'
import { ConversionLevel } from './SurveyConversionLevel'

/**
 * Native Surveys interface
 */
export type InBrainNativeSurvey = {
  id: string
  searchId: string
  rank: number
  time: number
  value: number
  currencySale: boolean
  multiplier: number
  namedCategories?: Category[]
  isProfilerSurvey: boolean
  /**
   * All the possible cases are listed at `ConversionLevel` declaration
   */
  conversionLevel: ConversionLevel
}

/**
 * @unsupported Please, use InBrainNativeSurvey instead
 */
export type InBrainNativeSurveys = {}
