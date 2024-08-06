/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef} from 'react';
import {Dimensions, Text} from 'react-native';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width - 2;
const windowHeight = Dimensions.get('window').height;

const TAB_BAR_WIDTH = (windowWidth - 10)  / 3;

const BottomTabNavigator = ({state, descriptors, navigation} : any): React.JSX.Element => {
  const animationHorizontalValue = useRef(new Animated.Value(0)).current;

  const animate = (index: number) => {
    Animated.spring(animationHorizontalValue, {
      toValue: index * TAB_BAR_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animate(state.index);
  }, [animate, state.index]);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.animatedWrapper}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{translateX: animationHorizontalValue}],
            },
          ]}
        />
      </Animated.View>

      <View style={{flexDirection: 'row'}}>
        {state.routes.map(
          (route: {key: string | number; name: any}, index: any) => {
            const {options} = descriptors[route.key];
            const label = options.tabBarLabel || route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableWithoutFeedback
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}
                key={`${index}--${route.key}`}>
                <View style={styles.innerView}>
                  <Icon
                    size={25}
                    style={{marginTop:2}}
                    name={route.name}
                    color={isFocused ? 'white' : 'black'}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.iconText,
                      {color: isFocused ? 'white' : 'black'},
                    ]}>
                    {label}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          },
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: '#fcfbfb',
    borderRadius: 15,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  tabButton: {
    flex: 1,
  },
  innerView: {
    paddingVertical: windowHeight * 0.001,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    width: TAB_BAR_WIDTH,
    textAlign: 'center',
  },
  animatedView: {
    bottom: -windowHeight / 17,
    width: TAB_BAR_WIDTH + 2,
    height: TAB_BAR_WIDTH / 2.5,
    backgroundColor: 'rgba(47, 75, 197, 1)',
    position: 'absolute',
    borderRadius: 15,
  },
  animatedWrapper: {
    width: TAB_BAR_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabNavigator;
