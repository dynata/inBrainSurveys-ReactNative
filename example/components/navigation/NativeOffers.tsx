import {InBrainNativeOffer, InBrainOfferType} from 'inbrain-surveys'
import React, {useEffect, useState} from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native'
import {Points, ActivityWithOverlay} from '../common'
import {mScale} from '../utils/metrics'

import {useInbrain} from '../context/InbrainContext'
import {useReward} from '../context/RewardContext'

const NativeOffersList = () => {
  const inbrain = useInbrain()
  const {reward} = useReward()

  const [nativeOffersState, setNativeOffersState] = useState<
    InBrainNativeOffer[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const filter = {
    type: InBrainOfferType.default,
    limit: 20,
    offset: 0,
  }

  useEffect(() => {
    getNativeOffers()
  }, [])

  useEffect(() => {
    /**
     * Add setOnSurveysCloseLister event listener to refresh offers
     */
    let subscription = inbrain?.setOnSurveysCloseLister(() => {
      console.log('[refresh offers] => ')
      setIsLoading(true)
      getNativeOffers()
    })

    return () => {
      subscription?.remove()
    }
  }, [reward])

  /**
   * How to call inbrain.getNativeOffers()
   */
  const getNativeOffers = () => {
    inbrain
      ?.getNativeOffers(filter)
      .then((nativeOffers: InBrainNativeOffer[]) => {
        setNativeOffersState(nativeOffers)
        setIsLoading(false)
      })
      .catch((err: Error) => {
        setIsLoading(false)
        console.log(err)
      })
  }

  /**
   * How to call inbrain.openOfferWith(id: number)
   */
  const onPressOpenOffer = (nativeOffer: InBrainNativeOffer) => {
    return inbrain
      ?.openOfferWith(nativeOffer.id)
      .then(() => {
        console.log('[Open Native Offer SUCCESS]')
      })
      .catch((err: Error) => {
        console.log(err)
        throw err
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ActivityWithOverlay show={isLoading} />
      {nativeOffersState.length === 0 && !isLoading && (
        <View style={styles.activityContainer}>
          <Text>Ooops... No offers available right now!</Text>
        </View>
      )}
      <View style={styles.flex}>
        <FlatList
          refreshing={true}
          data={nativeOffersState}
          renderItem={({item}) => (
            <NativeOffer offer={item} onPress={onPressOpenOffer} />
          )}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  )
}

export default NativeOffersList

/**
 * Native Offer Card Component
 */
const NativeOffer = ({offer, onPress}: TNativeOfferItemProps) => {
  const hasPromotion = offer.promotion !== undefined
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePress = () => {
    setIsLoading(true)

    onPress(offer)
      .then(() => {
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <View style={styles.offerView}>
      <View style={[styles.card, styles.shadow]}>
        <View style={styles.offerBox}>
          {/* Thumbnail Image */}
          {offer.thumbnailUrl && (
            <View style={styles.thumbnailContainer}>
              <Image
                source={{uri: offer.thumbnailUrl}}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.offerTitle} numberOfLines={2}>
              {offer.title}
            </Text>
          </View>

          {/* Reward Points */}
          <View style={styles.textOfferPoints}>
            <Points
              points={offer.reward}
              multiplier={hasPromotion ? offer.promotion!.multiplier : 1}
              currencySale={hasPromotion}
            />
          </View>

          {/* Categories */}
          {offer.categories && offer.categories.length > 0 && (
            <View style={styles.offerCategoryBox}>
              <Text style={styles.offerCategory} numberOfLines={1}>
                {offer.categories[0]}
              </Text>
            </View>
          )}

          {/* Action Button */}
          <View style={styles.offerActionBox}>
            <TouchableOpacity
              style={styles.startOfferBtn}
              onPress={handlePress}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  adjustsFontSizeToFit
                  allowFontScaling
                  numberOfLines={1}
                  style={styles.startOfferBtnText}>
                  Start Offer
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

type TNativeOfferItemProps = {
  offer: InBrainNativeOffer
  onPress: (offer: InBrainNativeOffer) => Promise<void>
}

/**
 * Styles in JS
 */
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#eeeeee',
    flex: 1,
  },
  activityContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99,
    elevation: 99,
  },
  offerView: {
    flex: 1,
    paddingTop: mScale(10),
    paddingHorizontal: mScale(5),
    height: 280,
  },
  offerBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 0,
    paddingBottom: mScale(10),
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.34,
    shadowRadius: 0.2,
    elevation: 10,
  },
  flex: {
    flex: 1,
    backgroundColor: '#eeeeee',
    padding: 4,
  },
  thumbnailContainer: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    marginBottom: mScale(8),
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mScale(2),
    paddingHorizontal: mScale(8),
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  textOfferPoints: {
    paddingVertical: mScale(2),
  },
  offerCategoryBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: mScale(1),
    marginBottom: mScale(4),
  },
  offerCategory: {
    color: '#92D050',
    fontSize: 13,
    fontWeight: '400',
  },
  offerActionBox: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: mScale(10),
  },
  startOfferBtn: {
    padding: mScale(8),
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#92D050',
    textAlign: 'center',
  },
  startOfferBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
})

