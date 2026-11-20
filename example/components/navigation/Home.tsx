import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import ActionList from '../ActionList';
import {useInbrain} from '../context/InbrainContext';
import {ActivityWithOverlay, ToastNotify} from '../common';
import {useReward} from '../context/RewardContext';

import {
  OnCloseSurveysData,
  InBrainReward,
  InBrainWallOption,
  InBrainCurrencySale,
  InBrainCurrencySaleType,
} from 'inbrain-surveys';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({navigation}: RouterProps) => {
  const inbrain = useInbrain();
  const {reward, setReward} = useReward();
  const [notifyMsg, setNotifyMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currencySale, setCurrencySale] = useState<
    InBrainCurrencySale | undefined
  >(undefined);
  const saleOpacity = useRef(new Animated.Value(0)).current;

  const showCurrencySale = useCallback(
    (sale: InBrainCurrencySale | undefined) => {
      if (sale) {
        setCurrencySale(sale);
      }

      Animated.timing(saleOpacity, {
        toValue: sale ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished && !sale) {
          setCurrencySale(undefined);
        }
      });
    },
    [saleOpacity],
  );

  const fetchCurrencySale = useCallback(
    (isActiveCheck?: () => boolean) => {
      inbrain
        ?.getCurrencySale(InBrainCurrencySaleType.surveys)
        .then((sale: InBrainCurrencySale | undefined) => {
          if (!isActiveCheck || isActiveCheck()) {
            showCurrencySale(sale);
          }
        })
        .catch((err: Error) => {
          console.log('[getCurrencySale ERROR]', err);
          if (!isActiveCheck || isActiveCheck()) {
            showCurrencySale(undefined);
          }
        });
    },
    [inbrain, showCurrencySale],
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchCurrencySale(() => isActive);

      return () => {
        isActive = false;
      };
    }, [fetchCurrencySale]),
  );

  useEffect(() => {
    /**
     * Add setOnSurveysCloseLister event listener
     */
    let subscription = inbrain?.setOnSurveysCloseLister(
      (event: OnCloseSurveysData) => {
        console.log('[setOnSurveysCloseLister SUCCESS] => ');
        console.log('[Close by WebView => ]', event.byWebView);
        getRewards();
        fetchCurrencySale();
      },
    );

    return () => {
      subscription?.remove();
    };
  }, [reward, fetchCurrencySale]);

  /**
   * How to call inbrain.getRewards()
   */
  const getRewards = () => {
    inbrain
      ?.getRewards()
      .then((result: InBrainReward[]) => {
        const rewSum = result.reduce((sum, rew) => sum + rew.amount, 0);
        const points = reward + rewSum;
        setReward(points);
        console.log(`[Get rewards SUCCESS] => Adding points ${points}`);
        confirmRewards(result);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  /**
   * How to call inbrain.confirmReward()
   */
  const confirmRewards = (rewards: InBrainReward[]) => {
    inbrain?.confirmRewards(rewards).then(() => {
      console.log('[Confirm rewards SUCCESS]');
    });
  };

  /**
   * How to call inbrain.openWall()
   */
  const onClickShowWall = () => {
    inbrain
      ?.openWall(InBrainWallOption.all)
      .then(() => {
        console.log('[Show Surveys SUCCESS]');
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  const multiplierText = currencySale
    ? `${Math.round(currencySale.multiplier * 10) / 10}x`
    : '';

  return (
    <SafeAreaView style={styles.container}>
      <ToastNotify message={notifyMsg} callBack={() => setNotifyMsg('')} />
      <View style={styles.currencySaleContainer}>
        <Animated.View
          style={[styles.currencySaleBadge, {opacity: saleOpacity}]}>
          {currencySale && (
            <Text style={styles.currencySaleText}>
              <Text style={styles.currencySaleMultiplier}>
                {multiplierText}
              </Text>
              {' Earnings'}
            </Text>
          )}
        </Animated.View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>inBrain Surveys</Text>
        <Text style={styles.appSubtitle}>Example App</Text>
      </View>
      <ActionList
        onClickShowWall={() => {
          onClickShowWall();
        }}
        onClickShowNativeSurveys={() => {
          navigation.navigate('NativeSurveys');
        }}
        onClickShowNativeOffers={() => {
          navigation.navigate('NativeOffers');
        }}
      />
      <View style={styles.footer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.imageLogo}
            source={require('../../assets/Logo.png')}
          />
        </View>
      </View>
      <ActivityWithOverlay show={isLoading} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
    flex: 1,
  },
  currencySaleContainer: {
    paddingTop: 4,
    paddingHorizontal: 12,
    minHeight: 34,
    alignItems: 'flex-end',
  },
  currencySaleBadge: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DE8344',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySaleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  currencySaleMultiplier: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  titleContainer: {
    marginTop: 2,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  appSubtitle: {
    fontSize: 20,
    marginTop: 0,
    textAlign: 'center',
    color: 'grey',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#47a3dc',
    textAlign: 'center',
  },
  imageLogo: {
    width: 220,
    height: 35,
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
  },
  footer: {
    flex: 0.2,
    justifyContent: 'center',
  },
});
