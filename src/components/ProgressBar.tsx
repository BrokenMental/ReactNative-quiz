import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, LayoutChangeEvent } from 'react-native';

interface ProgressBarProps {
  percentage: number; // 진행률 (0 ~ 100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  useEffect(() => {
    if (containerWidth > 0) {
      const targetWidth = containerWidth * (percentage / 100);
      Animated.timing(progressAnim, {
        toValue: targetWidth, // 숫자 값으로 애니메이션 진행
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [percentage, containerWidth, progressAnim]);

  return (
    <View style={styles.container}>
      {/* 프로그레스 바 컨테이너 (relative positioning) */}
      <View style={styles.progressBarContainer} onLayout={onLayout}>
        <Animated.View
          style={[styles.progressBarFill, { width: progressAnim }]}
        />
        {/* 진행률 텍스트를 절대 배치 */}
        <Text style={styles.progressBarText}>{percentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressBarContainer: {
    width: '90%',
    height: 20,
    backgroundColor: '#e0e0e0', // 연한 회색 배경
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative', // 자식에 절대 위치 배치를 가능하게 함
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000', // 검은색 채움
    borderRadius: 10,
  },
  progressBarText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center', // 안드로이드에서 중앙 정렬
    color: '#FFFFFF', // 대비를 위해 흰색 텍스트
    fontWeight: 'bold',
  },
});

export default ProgressBar;
