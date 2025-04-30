import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AnimatedButton from '../components/AnimatedButton';

type CategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Category'>;

interface CategoryScreenProps {
  navigation: CategoryScreenNavigationProp;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ navigation }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 에뮬레이터(Android)에서는 "10.0.2.2"를, 실제 디바이스에서는 PC의 IP 주소나 도메인을 사용하세요.
        const response = await fetch('http://10.0.2.2:3000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('카테고리 데이터를 가져오는 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>카테고리를 선택하세요:</Text>
      {categories.length === 0 ? (
        <Text>등록된 카테고리가 없습니다.</Text>
      ) : (
        categories.map((category, index) => (
          <AnimatedButton
            key={index}
            title={category}
            onPress={() => navigation.navigate('Quiz', { category })}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20
  },
});

export default CategoryScreen;
