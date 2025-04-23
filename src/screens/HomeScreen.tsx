import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ToastAndroid, BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [exitApp, setExitApp] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (!exitApp) {
          setExitApp(true);
          ToastAndroid.show('뒤로 버튼을 한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);
          setTimeout(() => setExitApp(false), 2000);
          return true; // 이 이벤트를 여기서 소비해서 뒤로가기 기본 동작을 막음
        }
        BackHandler.exitApp(); // 두 번째 누르면 앱 종료
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => subscription.remove();
    }, [exitApp])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>퀴즈 앱에 오신 것을 환영합니다!</Text>
      <Button title="퀴즈 풀기" onPress={() => navigation.navigate('Category')} />
      <Button
        title="오답노트"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Result',
                params: { score: 0, category: '전체', results: [] },
              },
            ],
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

export default HomeScreen;
