/**
 * 맵 뷰 번들 로더.
 *
 * next/dynamic 과 "동일한 import 경로"를 사용해야 같은 chunk 를 가리키고,
 * preload 로 한 번 받아둔 모듈이 모듈 캐시에서 즉시 재사용된다.
 */
export const loadExperienceMapView = () =>
  import('@/features/experience/workspace/views/ExperienceMapView');

let preloadStarted = false;

/** idle / hover 시점에 맵 번들을 미리 받아둔다. 중복 호출은 무시된다. */
export function preloadExperienceMapView() {
  if (preloadStarted) return;
  preloadStarted = true;
  void loadExperienceMapView().catch(() => {
    // preload 실패는 무시한다. 실제 전환 시 next/dynamic 이 다시 시도한다.
    preloadStarted = false;
  });
}
