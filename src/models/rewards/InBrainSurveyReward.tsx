import { Category } from '../Surveys/Category'

/**
 * Survey Outcome Type
 *
 *  Possible cases are:
 *  0 = Completed;
 *  1 = Terminated;
 *
 */
export type SurveyOutcomeType = {
  id: number
  name: string
}

/**
 * Survey reward interface
 */
export type InBrainSurveyReward = {
  surveyId: string
  userReward: number
  outcomeType: SurveyOutcomeType
  placementId?: string
  categories?: Category[]
}

/**
 * Data returned with OnSurveysClose event
 */
export type OnCloseSurveysData = {
  byWebView: boolean
  /**
   * At the moment only first Native Survey reward is delivered.
   * That means if the user complete a Native Survey, proceed to Survey Wall and complete one more survey -
   * only first reward will be delivered. In case of Survey Wall usage only - no rewards will be delivered.
   */
  rewards?: InBrainSurveyReward[]
}
