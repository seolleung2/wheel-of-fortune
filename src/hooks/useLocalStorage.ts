import { useState, useEffect } from "react";

/**
 * 로컬 스토리지를 사용하는 커스텀 훅
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns 현재 값과 값을 설정하는 함수
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  // 로컬 스토리지에서 값을 가져오는 함수
  const readValue = (): T => {
    // SSR 환경에서는 window가 없을 수 있으므로 확인
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // 로컬 스토리지에서 값 읽기
      const item = window.localStorage.getItem(key);
      // 값이 존재하면 파싱하여 반환, 없으면 초기값 반환
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // 오류 발생 시 로깅하고 초기값 반환
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 로컬 스토리지에 값을 설정하는 함수
  const setValue = (value: T): void => {
    try {
      // 함수형 업데이트 지원
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // 상태 업데이트
      setStoredValue(valueToStore);

      // 로컬 스토리지에 저장
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // 오류 발생 시 로깅
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 다른 탭에서의 스토리지 변경을 감지하고 동기화
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
