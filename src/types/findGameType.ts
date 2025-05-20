/**
 * 티니핑 객체 인터페이스입니다.
 *
 * @interface findTeenieping
 * @property {HTMLElement} [getDiv] - 티니핑이 포함된 div 요소 (선택적)
 * @property {boolean} status - 해당 티니핑이 정답인지 여부
 * @property {HTMLElement} [cloneDiv] - 복제된 div 요소 (선택적)
 */
export interface findTeenieping {
  getDiv?: HTMLElement;
  status: boolean;
  cloneDiv?: HTMLElement;
}
