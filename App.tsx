import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';

export type RootStackParamList = {
  Home: undefined;
  Category: undefined;
  Quiz: { category: string };
  Result: {
    score: number;
    category: string;
    results: { question: string; correctAnswer: string; userAnswer?: string; isCorrect?: boolean }[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerShown: false, // 상단 헤더 숨기기
          contentStyle: { backgroundColor: '#FFFFFF' }, // 기본 화면 배경
          gestureEnabled: true, // 스와이프 제스처로 뒤로 가기 활성화
        }}
        >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '퀴즈 앱' }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ title: '카테고리 선택' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: '퀴즈 풀기' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: '결과' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
