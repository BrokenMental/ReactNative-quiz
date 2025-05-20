import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import AnimatedButton from '../components/AnimatedButton';

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
  answer: number; // 정답 옵션의 인덱스
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
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // 백엔드 API에서 퀴즈 데이터를 가져와서 category에 맞게 필터링
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // 실제 테스트 환경에 맞게 URL을 수정하세요.
        const response = await fetch('http://10.0.2.2:3000/api/questions'); //10.0.2.2는 Android 에뮬레이터에서 localhost를 가리킴
        const data = await response.json();
        // 백엔드에서 받아온 전체 데이터 중 category가 일치하는 데이터만 필터링
        const filtered = (data as QuizItem[]).filter((item) => item.category === category);
        // 필터링된 데이터를 랜덤으로 섞습니다.
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        // 최대 10문제만 선택합니다.
        const selectedQuestions = shuffled.slice(0, 10);
        setFilteredQuestions(selectedQuestions);
      } catch (error) {
        console.error('퀴즈 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
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
    setResults((prevResults) => [...prevResults, newResult]);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // 마지막 문제인 경우 결과 화면으로 이동
      // setTimeout을 사용해 state 업데이트가 최종 결과에 반영되게 함
      setTimeout(() => {
        navigation.navigate('Result', {
          score: isCorrect ? score + 1 : score,
          category,
          results: [...results, newResult],
        });
      }, 0);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>퀴즈 데이터를 가져오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentQuestionIndex < filteredQuestions.length ? (
        <>
          <View style={styles.questionTracker}>
            <Text style={styles.questionTrackerText}>
              {currentQuestionIndex + 1} / {filteredQuestions.length}
            </Text>
          </View>
          <View style={styles.questionContainer}>
            <Text style={styles.question}>
              {filteredQuestions[currentQuestionIndex].question}
            </Text>
          </View>
          {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
            <AnimatedButton
              key={index}
              title={option}
              onPress={() => handleAnswer(index)}
            />
          ))}
        </>
      ) : (
        <Text>퀴즈 완료</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  questionTracker: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  questionTrackerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionContainer: {
    width: '95%',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'left',
  },
});

export default QuizScreen;
