/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode, FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { SelectionHistory, Participant } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * 기록 관리를 위한 컨텍스트 인터페이스
 */
interface HistoryContextType {
  /** 선택 기록 */
  history: SelectionHistory[];
  /** 선택 결과 추가 함수 */
  addToHistory: (winner: Participant, participants: Participant[]) => void;
  /** 특정 기록 삭제 함수 */
  removeFromHistory: (id: string) => void;
  /** 기록 전체 삭제 함수 */
  clearHistory: () => void;
  /** 이전 당첨자 목록 반환 함수 */
  getPreviousWinners: () => Participant[];
}

/**
 * 기록 컨텍스트 기본값
 */
const defaultHistoryContext: HistoryContextType = {
  history: [],
  addToHistory: () => {},
  removeFromHistory: () => {},
  clearHistory: () => {},
  getPreviousWinners: () => [],
};

/**
 * 기록 컨텍스트
 */
export const HistoryContext = createContext<HistoryContextType>(
  defaultHistoryContext,
);

/**
 * 기록 컨텍스트 프로바이더 Props
 */
interface HistoryProviderProps {
  /** 자식 컴포넌트 */
  children: ReactNode;
}

/**
 * 기록 관리를 위한 프로바이더 컴포넌트
 */
export const HistoryProvider: FC<HistoryProviderProps> = ({ children }) => {
  // 로컬 스토리지에 기록 저장
  const [history, setHistory] = useLocalStorage<SelectionHistory[]>(
    "wheelOfFortune_history",
    [],
  );

  /**
   * 기록 추가 함수
   * @param winner 당첨자 정보
   * @param participants 선택 당시 참가자 목록
   */
  const addToHistory = (
    winner: Participant,
    participants: Participant[],
  ): void => {
    const newHistoryItem: SelectionHistory = {
      id: uuidv4(),
      winner,
      participants: [...participants],
      timestamp: Date.now(),
    };

    setHistory([newHistoryItem, ...history]);
  };

  /**
   * 특정 기록 삭제 함수
   * @param id 삭제할 기록 ID
   */
  const removeFromHistory = (id: string): void => {
    setHistory(history.filter((item) => item.id !== id));
  };

  /**
   * 기록 전체 삭제 함수
   */
  const clearHistory = (): void => {
    setHistory([]);
  };

  /**
   * 이전 당첨자 목록 반환 함수
   * @returns 이전 당첨자 목록
   */
  const getPreviousWinners = (): Participant[] => {
    return history.map((item) => item.winner);
  };

  const value = {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getPreviousWinners,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

/**
 * 기록 컨텍스트 커스텀 훅
 * @returns 기록 컨텍스트 값
 */
export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);

  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }

  return context;
};
