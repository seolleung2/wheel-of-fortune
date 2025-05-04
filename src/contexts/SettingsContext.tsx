/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode, FC, useEffect } from "react";
import { AppSettings, SelectionType } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * 설정 관리 컨텍스트 인터페이스
 */
interface SettingsContextType {
  /** 앱 설정 */
  settings: AppSettings;
  /** 선택 방식 변경 함수 */
  changeSelectionType: (type: SelectionType) => void;
  /** 이전 당첨자 제외 설정 함수 */
  toggleExcludePreviousWinners: () => void;
  /** 애니메이션 속도 설정 함수 */
  setAnimationDuration: (duration: number) => void;
  /** 다크모드 전환 함수 */
  toggleDarkMode: () => void;
}

/**
 * 기본 앱 설정
 */
const DEFAULT_SETTINGS: AppSettings = {
  selectionType: SelectionType.WHEEL,
  excludePreviousWinners: false,
  animationDuration: 5000,
  isDarkMode: false,
};

/**
 * 설정 컨텍스트 기본값
 */
const defaultSettingsContext: SettingsContextType = {
  settings: DEFAULT_SETTINGS,
  changeSelectionType: () => {},
  toggleExcludePreviousWinners: () => {},
  setAnimationDuration: () => {},
  toggleDarkMode: () => {},
};

/**
 * 설정 컨텍스트
 */
export const SettingsContext = createContext<SettingsContextType>(
  defaultSettingsContext,
);

/**
 * 설정 컨텍스트 프로바이더 Props
 */
interface SettingsProviderProps {
  /** 자식 컴포넌트 */
  children: ReactNode;
}

/**
 * 설정 관리 프로바이더 컴포넌트
 */
export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  // 로컬 스토리지에 설정 저장
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    "wheelOfFortune_settings",
    DEFAULT_SETTINGS,
  );

  /**
   * 선택 방식 변경 함수
   * @param type 변경할 선택 방식
   */
  const changeSelectionType = (type: SelectionType): void => {
    setSettings({ ...settings, selectionType: type });
  };

  /**
   * 이전 당첨자 제외 설정 토글 함수
   */
  const toggleExcludePreviousWinners = (): void => {
    setSettings({
      ...settings,
      excludePreviousWinners: !settings.excludePreviousWinners,
    });
  };

  /**
   * 애니메이션 속도 설정 함수
   * @param duration 애니메이션 지속 시간(ms)
   */
  const setAnimationDuration = (duration: number): void => {
    setSettings({ ...settings, animationDuration: duration });
  };

  /**
   * 다크모드 토글 함수
   */
  const toggleDarkMode = (): void => {
    // 다크모드 상태 변경
    const newDarkMode = !settings.isDarkMode;

    // HTML 요소의 클래스 업데이트
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 설정 저장
    setSettings({ ...settings, isDarkMode: newDarkMode });
  };

  // 초기 다크모드 설정 적용
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const value = {
    settings,
    changeSelectionType,
    toggleExcludePreviousWinners,
    setAnimationDuration,
    toggleDarkMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * 설정 컨텍스트 커스텀 훅
 * @returns 설정 컨텍스트 값
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};
