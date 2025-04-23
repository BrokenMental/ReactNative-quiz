import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type CategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Category'>;

interface CategoryScreenProps {
  navigation: CategoryScreenNavigationProp;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ navigation }) => {
  const categories = ['JavaScript', 'React', 'TypeScript'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>카테고리를 선택하세요:</Text>
      {categories.map((category, index) => (
        <Button
          key={index}
          title={category}
          onPress={() => navigation.navigate('Quiz', { category })}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

export default CategoryScreen;
