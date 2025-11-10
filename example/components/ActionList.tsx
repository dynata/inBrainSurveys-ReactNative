import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {useReward} from './context/RewardContext';

type ActionListProps = {
  onClickShowWall: () => void;
  onClickShowNativeSurveys: () => void;
  onClickShowNativeOffers: () => void;
};

const ActionList = ({
  onClickShowWall,
  onClickShowNativeSurveys,
  onClickShowNativeOffers,
}: ActionListProps) => {
  const [isPortrait, setIsPortrait] = useState<boolean>();
  const {reward} = useReward();

  /**
   * Returns true if the screen is in portrait mode
   */
  const isPortraitOrientation = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  useEffect(() => {
    setIsPortrait(isPortraitOrientation());
    let orientationListener = Dimensions.addEventListener('change', () => {
      setIsPortrait(isPortraitOrientation());
    });

    return () => {
      orientationListener.remove();
    };
  }, []);

  return (
    <View
      style={[
        styles.actionContainer,
        !isPortrait && !Platform.isPad ? styles.row : {},
      ]}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageFloatingLady}
          source={require('../assets/FloatingWoman.png')}
        />
      </View>
      <View style={styles.flex}>
        <ActionButton text="Open Wall" onPress={onClickShowWall} isPortrait={isPortrait} />
        <ActionButton
          text="Show Native Surveys"
          onPress={onClickShowNativeSurveys}
          isPortrait={isPortrait}
        />
        <ActionButton
          text="Show Native Offers"
          onPress={onClickShowNativeOffers}
          isPortrait={isPortrait}
        />
        <Text style={styles.points}>Total Points: {reward}</Text>
      </View>
    </View>
  );
};

export default ActionList;

/**
 * Button in the action lise
 */

const ActionButton = ({onPress, text, isPortrait}: ActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.actionButtons, !isPortrait && styles.actionButtonsLandscape]}>
        <ImageBackground
          source={require('../assets/OrangeButton.png')}
          resizeMode={'stretch'}
          style={styles.imageBackground}>
          <View style={styles.textButton}>
            <Text style={styles.button}>{text}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

type ActionButtonProps = {
  onPress: () => void;
  text: string;
  isPortrait: boolean | undefined;
};

const styles = StyleSheet.create({
  textButton: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
  },
  button: {
    width: '100%',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  imageContainer: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    flex: 1,
  },
  imageFloatingLady: {
    height: 160,
    resizeMode: 'contain',
  },
  actionButtons: {
    flexDirection: 'column',
    height: 80,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    alignSelf: 'center',
    maxWidth: 550,
  },
  actionButtonsLandscape: {
    height: 60,
    marginBottom: 7,
  },
  flex: {
    flex: 1,
    justifyContent: 'center',
  },
  actionContainer: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#47a3dc',
    textAlign: 'center',
  },
});
