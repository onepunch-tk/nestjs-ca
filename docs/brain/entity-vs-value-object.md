---
status: 설명만 들음
first-seen: 2026-08-04
---

# Entity vs Value Object

Entity는 식별자로 같음을 판단하고, Value Object는 값 전체로 같음을 판단한다.

## 핵심 (재구성 단서)

- 갈림길은 mutable/immutable이 아니라 **"두 객체가 같은지를 무엇으로 판단하는가"**다.
- VO가 immutable인 이유의 유도: 값이 곧 정체성 → 값을 바꾸면 정체성이 바뀜 → 그건 변경이 아니라
  교체 → 그러니 새 인스턴스를 만들어라 → immutable. **immutable은 정의가 아니라 파생 결과다.**
- Entity가 mutable인 이유: id가 정체성이고 나머지는 상태 → 상태가 변해도 같은 존재 → "시간에 따라
  변하는 것을 추적"이 존재 이유.
- 워크드 예제: `src/shared/domain/entity.ts`의 `equals`는 `this.id.equals(other.id)`만 보고,
  `value-objects/unique-id.vo.ts`의 `equals`는 `getValue() === getValue()`를 본다. 그래서
  `new UniqueId('abc')` 두 개는 `===`는 false, `equals`는 true.
- Entity 비교는 결국 VO 비교로 위임된다 → **VO가 불변이어야 Entity 동일성이 안 깨진다**(id 내부 값이
  중간에 바뀌면 DB에서 읽은 같은 엔티티가 갑자기 다른 것이 됨).
- 함정: 판단 기준이 도메인마다 다르다(주소 = 배송에선 VO, 부동산에선 Entity).
- 함정: 상속 base Entity에 기능을 계속 얹으면 god base class. 기준은 "모든 엔티티가 예외 없이
  필요한가".
- 함정: `equals`가 id만 보면 종류가 다른 엔티티끼리 같은 id일 때 true가 난다 → `this.constructor` 비교 필요.

## 등장 이력

- 2026-08-04 · shared `Entity`/`UniqueId` 코드 리뷰 · 직접 구현한 코드로 설명받음(코드 수정은 미적용)
- 2026-08-05 · Product 생성 파이프라인 · `Product`(Entity)가 `Money`/`Sku`(VO)를 조립하는 실제 흐름을
  확인. 인프라 경계에서 `Money 129.99 ↔ price_amount 12999`로 번역되는 지점이 어댑터라는 것도 함께

## 인출 기록

- 2026-08-04 · "종류가 다른 Entity가 같은 id면 equals가 true일까 false일까" 예측 (대기)

## 관련 개념

- [[always-valid-value-object]] — VO를 정의할 때 생성자에서 뭘 해야 하는가
- [[dependency-rule]] — 이 Entity가 클린 아키텍처 어느 층에 놓이는가
- [[typescript-structural-typing]] — VO 내부 값을 private로 둬야 하는 TS 고유의 이유
