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
    inbrain
      ?.openOfferWith(nativeOffer.id)
      .then(() => {
        console.log('[Open Native Offer SUCCESS]')
      })
      .catch((err: Error) => {
        console.log(err)
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
const NativeOffer = ({offer, onPress}: NativeOfferProps) => {
  const hasPromotion = offer.promotion !== undefined

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
              onPress={() => onPress(offer)}>
              <Text
                adjustsFontSizeToFit
                allowFontScaling
                numberOfLines={1}
                style={styles.startOfferBtnText}>
                Start Offer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

type NativeOfferProps = {
  offer: InBrainNativeOffer
  onPress: (offer: InBrainNativeOffer) => void
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
    height: 240,
    flex: 1,
    paddingTop: mScale(10),
    justifyContent: 'space-between',
    paddingHorizontal: mScale(5),
  },
  offerBox: {
    alignItems: 'center',
    height: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: mScale(10),
    width: '100%',
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
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: mScale(8),
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  textOfferPoints: {
    paddingVertical: mScale(8),
  },
  offerCategoryBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: mScale(4),
  },
  offerCategory: {
    color: '#92D050',
    fontSize: 13,
    fontWeight: '400',
  },
  offerActionBox: {
    width: '90%',
    justifyContent: 'center',
    marginTop: mScale(8),
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

