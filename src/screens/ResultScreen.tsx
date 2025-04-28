import React from 'react';
import { View, Text, FlatList, BackHandler, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import AnimatedButton from '../components/AnimatedButton';
import ProgressBar from '../components/ProgressBar';

type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface ResultScreenProps {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { score, category, results } = route.params;

  // 맞춘 문제 수 / 전체 문제 수
  const totalQuestions = results.length;
  //const percentage = ((score / totalQuestions) * 100).toFixed(1); // 백분율
  const progressBar_percentage = Math.round((score / totalQuestions) * 100); // 백분율 계산 (소수점 반올림)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          '확인',
          '카테고리 선택으로 돌아가시겠습니까?',
          [
            {
              text: '취소',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: () => {
                navigation.reset({
                  index: 1, // 두 번째 화면(Category)이 활성화 되도록 함 (0: Home, 1: Category)
                  routes: [
                    { name: 'Home' },
                    { name: 'Category', params: { category } },
                  ],
                });
              },
            },
          ],
          { cancelable: true }
        );
        return true; // 기본 백 동작(이전 화면 이동)을 막음
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [category, navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ 퀴즈 결과</Text>
      <Text style={styles.category}>카테고리: {category}</Text>
      {/* <Text style={styles.score}>정답률: {percentage}%</Text> */}
      <View style={styles.progressBarWrapper}>
        <ProgressBar percentage={progressBar_percentage} />
      </View>

      <Text style={styles.details}>맞춘 문제: {score} / {totalQuestions}</Text>

      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.index}>Q {index + 1}</Text>
            <Text style={styles.question}>문제: {item.question}</Text>
            <Text style={styles.correctAnswer}>정답: {item.correctAnswer}</Text>
            <Text style={styles.userAnswer}>선택한 답: {item.userAnswer}</Text>
            <Text style={item.isCorrect ? styles.correct : styles.incorrect}>
              {item.isCorrect ? '정답입니다!' : '틀렸습니다.'}
            </Text>
          </View>
        )}
      />

      <AnimatedButton
        title="홈으로 돌아가기"
        onPress={() =>
          Alert.alert(
            '확인',
            '홈 화면으로 돌아가시겠습니까?',
            [
              {
                text: '취소',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  }),
              },
            ],
            { cancelable: true }
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 20 },
  category: { fontSize: 18, color: '#000000', marginBottom: 10 },
  score: { fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  details: { fontSize: 16, color: '#000000', marginBottom: 20 },
  item: { marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
  index: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  question: { fontSize: 16, marginBottom: 5 },
  correctAnswer: { fontSize: 14, color: 'green', marginBottom: 5 },
  userAnswer: { fontSize: 14, color: 'blue', marginBottom: 5 },
  correct: { fontSize: 14, color: 'green' },
  incorrect: { fontSize: 14, color: 'red' },
  progressBarWrapper: {
    width: '95%',      // 또는 고정 픽셀값 예) width: 300,
    alignSelf: 'center',
  },
  flatListContent: {
    width: '95%',       // FlatList 내부 콘텐츠의 너비를 화면의 90%로 제한
    alignSelf: 'center', // 가운데 정렬
  },
});

export default ResultScreen;
