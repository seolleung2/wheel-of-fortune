/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { Participant } from "../types";

/**
 * 참가자 관리를 위한 컨텍스트 인터페이스
 */
interface ParticipantContextType {
  /** 현재 참가자 목록 */
  participants: Participant[];
  /** 참가자 추가 함수 */
  addParticipant: (name: string) => void;
  /** 참가자 제거 함수 */
  removeParticipant: (id: string) => void;
  /** 참가자 일괄 추가 함수 */
  addMultipleParticipants: (names: string[]) => void;
  /** 참가자 전체 제거 함수 */
  clearParticipants: () => void;
  /** 참가자 목록 설정 함수 */
  setParticipants: (participants: Participant[]) => void;
}

/**
 * 참가자 컨텍스트 기본값
 */
const defaultParticipantContext: ParticipantContextType = {
  participants: [],
  addParticipant: () => {},
  removeParticipant: () => {},
  addMultipleParticipants: () => {},
  clearParticipants: () => {},
  setParticipants: () => {},
};

/**
 * 참가자 컨텍스트
 */
export const ParticipantContext = createContext<ParticipantContextType>(
  defaultParticipantContext,
);

/**
 * 참가자 컨텍스트 프로바이더 Props
 */
interface ParticipantProviderProps {
  /** 자식 컴포넌트 */
  children: ReactNode;
}

/**
 * 참가자 컨텍스트 프로바이더 컴포넌트
 */
export const ParticipantProvider: FC<ParticipantProviderProps> = ({
  children,
}) => {
  // 휠에 사용될 색상 배열
  const WHEEL_COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AC73E",
    "#F37FB8",
    "#00B3B3",
    "#E67E22",
  ];

  // 참가자 상태 관리
  const [participants, setParticipants] = useState<Participant[]>([]);

  /**
   * 색상 할당 함수
   * @returns 휠에 사용될 색상
   */
  const assignColor = (): string => {
    const index = participants.length % WHEEL_COLORS.length;
    return WHEEL_COLORS[index];
  };

  /**
   * 참가자 추가 함수
   * @param name 참가자 이름
   */
  const addParticipant = (name: string): void => {
    if (!name.trim()) return;

    const newParticipant: Participant = {
      id: uuidv4(),
      name: name.trim(),
      color: assignColor(),
    };

    setParticipants((prevParticipants) => [
      ...prevParticipants,
      newParticipant,
    ]);
  };

  /**
   * 참가자 제거 함수
   * @param id 제거할 참가자의 ID
   */
  const removeParticipant = (id: string): void => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.id !== id),
    );
  };

  /**
   * 여러 참가자 일괄 추가 함수
   * @param names 추가할 참가자 이름 배열
   */
  const addMultipleParticipants = (names: string[]): void => {
    const validNames = names.filter((name) => name.trim() !== "");

    if (validNames.length === 0) return;

    const newParticipants = validNames.map((name) => ({
      id: uuidv4(),
      name: name.trim(),
      color: assignColor(),
    }));

    setParticipants((prevParticipants) => [
      ...prevParticipants,
      ...newParticipants,
    ]);
  };

  /**
   * 모든 참가자 제거 함수
   */
  const clearParticipants = (): void => {
    setParticipants([]);
  };

  const value = {
    participants,
    addParticipant,
    removeParticipant,
    addMultipleParticipants,
    clearParticipants,
    setParticipants,
  };

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
};

/**
 * 참가자 컨텍스트 커스텀 훅
 * @returns 참가자 컨텍스트 값
 */
export const useParticipants = (): ParticipantContextType => {
  const context = useContext(ParticipantContext);

  if (context === undefined) {
    throw new Error(
      "useParticipants must be used within a ParticipantProvider",
    );
  }

  return context;
};
