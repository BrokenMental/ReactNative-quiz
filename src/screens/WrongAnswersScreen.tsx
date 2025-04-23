import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface WrongAnswer {
  question: string;
  correctAnswer: string;
}

const WrongAnswersScreen: React.FC<{ route: { params?: { wrongAnswers: WrongAnswer[] } } }> = ({ route }) => {
  const wrongAnswers = route.params?.wrongAnswers || []; // 전달받은 오답 리스트

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오답 노트</Text>
      {wrongAnswers.length > 0 ? (
        <FlatList
          data={wrongAnswers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.question}>문제: {item.question}</Text>
              <Text style={styles.correctAnswer}>정답: {item.correctAnswer}</Text>
            </View>
          )}
        />
      ) : (
        <Text>오답이 없습니다!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { marginBottom: 15 },
  question: { fontSize: 18 },
  correctAnswer: { fontSize: 16, color: 'green' },
});

export default WrongAnswersScreen;
