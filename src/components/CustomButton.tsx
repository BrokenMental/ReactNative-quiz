import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
  title: string; // 버튼 텍스트
  onPress: (event: GestureResponderEvent) => void; // 버튼을 눌렀을 때 실행되는 함수
  style?: object; // 버튼 스타일을 커스터마이징할 수 있는 선택적 prop
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000', // 블랙 배경
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF', // 화이트 테두리
  },
  buttonText: {
    color: '#FFFFFF', // 화이트 텍스트
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomButton;
