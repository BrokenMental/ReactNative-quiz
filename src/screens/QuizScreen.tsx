import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import quizData from '../data/quiz.json';

type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

interface QuizScreenProps {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
}

interface QuizItem {
  category: string;
  question: string;
  options: string[];
  answer: number;
}

// 결과를 위한 인터페이스 정의
interface QuizResult {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const { category } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<QuizItem[]>([]);
  // 결과를 상태로 관리
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const filtered = (quizData as QuizItem[]).filter((item) => item.category === category);
    setFilteredQuestions(filtered);
  }, [category]);

  const handleAnswer = (selectedOption: number) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    // 새 결과 생성
    const newResult: QuizResult = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.options[currentQuestion.answer],
      userAnswer: currentQuestion.options[selectedOption],
      isCorrect,
    };

    // 결과 배열에 추가
    setResults(prevResults => [...prevResults, newResult]);

    if (isCorrect) {
      setScore(prevScore => prevScore + 1); // 점수 업데이트
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1); // 다음 문제로 이동
    } else {
      // 마지막 문제인 경우, 최종 결과를 가지고 결과 화면으로 이동
      // 참고: 여기서는 업데이트된 결과 상태와 점수를 사용하기 위해 setTimeout 사용
      setTimeout(() => {
        console.log('Final Results:', results, newResult);
        // 마지막 결과까지 포함해서 전달
        navigation.navigate('Result', {
          score: isCorrect ? score + 1 : score,
          category,
          results: [...results, newResult]
        });
      }, 0);
    }
  };

  return (
    <View style={styles.container}>
      {filteredQuestions.length === 0 ? (
        <Text>로딩 중...</Text>
      ) : currentQuestionIndex < filteredQuestions.length ? (
        <>
          <Text style={styles.question}>
            {filteredQuestions[currentQuestionIndex].question}
          </Text>
          {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
            <Button key={index} title={option} onPress={() => handleAnswer(index)} />
          ))}
        </>
      ) : (
        <Text>퀴즈 완료</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  question: { fontSize: 18, marginBottom: 20 },
});

export default QuizScreen;
