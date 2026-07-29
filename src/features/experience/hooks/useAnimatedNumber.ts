import { useState, useEffect } from 'react';

// 카운트업 관련 훅
// target - 목표 숫자
// duration - 애니메이션 지속 시간
// return - 현재 애니메이션 중인 숫자 값
export function useAnimatedNumber(target: number, duration: number = 1000) {
  // 현재 애니메이션 중인 숫자 값을 저장
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    // 드래그 중일 때 duration이 0이면 애니메이션 없이 즉시 목표값으로 설정
    if (duration === 0) {
      setCurrent(target);
      return;
    }

    // 애니메이션 시작 시간 기록
    const startTime = performance.now();
    // 애니메이션 시작 시점의 값 저장
    const startValue = current;

    // requestAnimationFrame의 ID를 저장, 애니메이션 취소 시 cleanup
    let animationFrameId: number;

    // 각 프레임마다 실행되는 애니메이션 함수
    const animate = (currentTime: number) => {
      // 경과 시간 계산
      const elapsed = currentTime - startTime;
      // 진행률 계산: 0 ~ 1 사이 값
      const progress = Math.min(elapsed / duration, 1);

      // Ease Out Cubic: 빠르게 시작해서 천천히 끝나는 부드러운 애니메이션 효과
      const ease = 1 - Math.pow(1 - progress, 3);

      // easing이 적용된 현재 값 계산
      const nextValue = startValue + (target - startValue) * ease;
      setCurrent(nextValue);

      // 애니메이션이 완료되지 않았으면 다음 프레임 요청
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // 애니메이션 시작
    animationFrameId = requestAnimationFrame(animate);

    // 컴포넌트 언마운트 또는 target/duration 변경 시 애니메이션 취소: cleanup
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return current;
}
