import { useState, useEffect } from 'react';

// 기여도 입력 편집을 위한 훅
// currentValue - 현재 기여도 값 (미리보기용)
// onTempChange - 임시 값 변경 시 호출되는 콜백 (미리보기)
// onSave - 실제 저장 시 호출되는 콜백
// return - 입력 편집 관련 상태와 핸들러들
export function useContributionInput(
  currentValue: number,
  onTempChange: (value: number) => void,
  onSave: (value: number) => void,
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

  // 포커스 아웃 시 호출: 미리보기만 업데이트
  const handleInputBlur = () => {
    // 입력값을 숫자로 변환
    const numValue = parseInt(inputValue, 10);
    // 유효한 숫자인 경우 미리보기 업데이트
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(100, Math.max(0, numValue));
      onTempChange(clampedValue);
      setInputValue(String(clampedValue));
    } else {
      // 잘못된 입력이면 원래 값으로 복구
      setInputValue(String(Math.round(currentValue)));
    }
  };

  // 입력 완료 및 저장: Enter 키 또는 CheckCircle 클릭
  const handleInputSubmit = () => {
    // 입력값을 숫자로 변환
    const numValue = parseInt(inputValue, 10);
    // 유효한 숫자인 경우
    if (!isNaN(numValue)) {
      // 0-100 범위로 제한
      const clampedValue = Math.min(100, Math.max(0, numValue));
      // 실제 저장
      onSave(clampedValue);
      // 미리보기도 업데이트
      onTempChange(clampedValue);
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
    if (e.key === 'Escape') {
      setInputValue(String(Math.round(currentValue)));
    }
  };

  // 드래그나 클릭으로 값이 변경되면 입력 필드도 업데이트
  useEffect(() => {
    setInputValue(String(Math.round(currentValue)));
  }, [currentValue]);

  return {
    isEditing, // 편집 모드 여부
    setIsEditing, // 편집 모드 전환 함수
    inputValue, // 입력 필드의 현재 값
    handleInputChange, // 입력값 변경 핸들러
    handleInputSubmit, // 입력 완료 및 저장 핸들러
    handleKeyDown, // 키보드 이벤트 핸들러
    handleInputBlur, // 포커스 아웃 핸들러 (미리보기)
  };
}
