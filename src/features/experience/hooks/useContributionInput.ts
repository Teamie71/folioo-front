import { useState, useEffect } from 'react';

// 기여도 입력 편집을 위한 훅
// currentValue - 현재 기여도 값
// onValueChange - 값 변경 시 호출되는 콜백
// return - 입력 편집 관련 상태와 핸들러들
export function useContributionInput(
  currentValue: number,
  onValueChange: (value: number) => void,
) {
  // 현재 편집 모드인지 여부
  const [isEditing, setIsEditing] = useState(false);
  // 입력 필드의 현재 값 (문자열)
  const [inputValue, setInputValue] = useState(
    String(Math.round(currentValue)),
  );

  // 사용자가 입력 필드에 값을 입력할 때 호출
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 숫자만 입력 가능하도록 검증
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  // 입력 완료 시 호출: Enter 키 또는 포커스 아웃
  const handleInputSubmit = () => {
    // 입력값을 숫자로 변환
    const numValue = parseInt(inputValue, 10);
    // 유효한 숫자인 경우
    if (!isNaN(numValue)) {
      // 0-100 범위로 제한
      const clampedValue = Math.min(100, Math.max(0, numValue));
      // 부모 컴포넌트에 값 변경 알림
      onValueChange(clampedValue);
      // 입력값을 보정된 값으로 업데이트
      setInputValue(String(clampedValue));
    } else {
      // 잘못된 입력이면 원래 값으로 복구
      setInputValue(String(Math.round(currentValue)));
    }
    // 편집 모드 종료
    setIsEditing(false);
  };

  // 입력 필드에서 키보드 입력 시 호출
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Enter: 입력 완료 및 편집 종료
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      // Escape: 변경 취소하고 원래 값으로 복구
      setInputValue(String(Math.round(currentValue)));
      setIsEditing(false);
    }
  };

  // currentValue가 변경되면 inputValue도 동기화
  useEffect(() => {
    if (!isEditing) {
      // 드래그나 클릭으로 값이 변경되면 입력 필드 업데이트
      setInputValue(String(Math.round(currentValue)));
    }
  }, [currentValue, isEditing]);

  return {
    isEditing, // 편집 모드 여부
    setIsEditing, // 편집 모드 전환 함수
    inputValue, // 입력 필드의 현재 값
    handleInputChange, // 입력값 변경 핸들러
    handleInputSubmit, // 입력 완료 핸들러
    handleKeyDown, // 키보드 이벤트 핸들러
  };
}
