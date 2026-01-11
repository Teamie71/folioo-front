import { useState, useCallback, useEffect, RefObject } from 'react';

// 프로그레스 바 드래그 기능을 위한 훅
// progressRef - 프로그레스 바 element 참조
// onValueChange - 값 변경 시 호출되는 Callback
// return - 드래그 관련 상태와 핸들러
export function useProgressDrag(
  progressRef: RefObject<HTMLDivElement | null>,
  onValueChange: (value: number) => void,
) {
  const [isDragging, setIsDragging] = useState(false);

  // 마우스의 좌표를 프로그레스 바의 퍼센트 값으로 변환
  const calculatePercentage = useCallback(
    (clientX: number) => {
      // progressRef가 없으면 null 반환
      if (!progressRef.current) return null;

      // 프로그레스 바의 위치와 크기 정보 가져오기
      const rect = progressRef.current.getBoundingClientRect();
      // 프로그레스 바 시작점으로부터의 상대 거리 계산
      const clickX = clientX - rect.left;
      // 상대 거리를 퍼센트로 변환하고 0-100 범위로 제한
      const percentage = Math.min(
        100,
        Math.max(0, (clickX / rect.width) * 100),
      );
      return Math.round(percentage);
    },
    [progressRef],
  );

  // 프로그레스 바 클릭 시 해당 위치로 값 변경
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 드래그 중이면 클릭 이벤트 무시
      if (isDragging) return;

      // 클릭한 위치의 퍼센트 계산
      const percentage = calculatePercentage(e.clientX);
      if (percentage !== null) {
        // 부모 컴포넌트에 값 변경 알림
        onValueChange(percentage);
      }
    },
    [isDragging, calculatePercentage, onValueChange],
  );

  // 마우스를 누르면 드래그 시작
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // 드래그 상태로 전환
      setIsDragging(true);
      // 눌린 위치의 퍼센트 계산 및 값 변경
      const percentage = calculatePercentage(e.clientX);
      if (percentage !== null) {
        onValueChange(percentage);
      }
    },
    [calculatePercentage, onValueChange],
  );

  // 드래그 중 마우스 이동 시 연속적으로 값 업데이트
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // 드래그 중이 아니면 무시
      if (!isDragging) return;

      // 현재 마우스 위치의 퍼센트 계산 및 값 변경
      const percentage = calculatePercentage(e.clientX);
      if (percentage !== null) {
        onValueChange(percentage);
      }
    },
    [isDragging, calculatePercentage, onValueChange],
  );

  // 마우스를 떼면 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 드래그 중일 때 전역 마우스 이벤트 리스너 등록: 프로그레스 바 밖에서도 드래그가 계속
  useEffect(() => {
    if (isDragging) {
      // document에 이벤트 리스너 등록
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // cleanup: 드래그 종료 또는 컴포넌트 언마운트 시 리스너 제거
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging, // 드래그 중 여부
    handleProgressClick, // 클릭 핸들러
    handleMouseDown, // 드래그 시작 핸들러
  };
}
