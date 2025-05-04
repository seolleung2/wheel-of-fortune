/**
 * 참가자 정보를 나타내는 인터페이스
 */
export interface Participant {
  /** 고유 식별자 */
  id: string;
  /** 참가자 이름 */
  name: string;
  /** 휠에 표시될 색상 */
  color?: string;
}

/**
 * 선택 기록을 나타내는 인터페이스
 */
export interface SelectionHistory {
  /** 고유 식별자 */
  id: string;
  /** 선택된 참가자 */
  winner: Participant;
  /** 선택 당시 모든 참가자 목록 */
  participants: Participant[];
  /** 선택 날짜 및 시간 */
  timestamp: number;
}

/**
 * 선택 시각화 방식
 */
export enum SelectionType {
  /** 회전 휠 방식 */
  WHEEL = "wheel",
  /** 다트보드 방식 */
  DARTBOARD = "dartboard",
}

/**
 * 애플리케이션 설정 인터페이스
 */
export interface AppSettings {
  /** 선택 시각화 타입 */
  selectionType: SelectionType;
  /** 이전 당첨자 제외 여부 */
  excludePreviousWinners: boolean;
  /** 애니메이션 속도 (밀리초) */
  animationDuration: number;
  /** 다크 모드 사용 여부 */
  isDarkMode: boolean;
}
