---
status: 설명만 들음
first-seen: 2026-08-04
---

# Dependency Rule

소스 코드의 의존(import)은 바깥(low-level)에서 안쪽(high-level)으로만 향하고, 안쪽은 바깥의 존재를 몰라야 한다.

## 핵심 (재구성 단서)

- high/low level은 "상속의 부모/자식"이나 파일 위치가 아니라 **비즈니스 규칙에 얼마나 가까운가**다.
  안쪽일수록 high-level: `Entities > Use Cases(Application) > Interface Adapters > Frameworks & Drivers`.
- 따라서 **Entity는 가장 high-level**이다. Application이 Entity를 import하는 건 안쪽 방향이라 합법.
- "바깥이 바뀌어도 안 흔들린다"의 메커니즘은 위치가 아니라 **import 목록**이다: `entity.ts`는
  같은 domain만, `unique-id.vo.ts`는 `node:crypto`만 import → NestJS를 버려도 두 파일은 안 바뀜.
- 워크드 예제(위반 사례): `src/shared/domain/aggregate-root.ts`가 `@nestjs/cqrs`의 `AggregateRoot`를
  상속 → 가장 안쪽이 가장 바깥을 의존. TS는 다중 상속이 안 되므로 `extends Entity`와 동시에 불가 →
  CQRS의 `apply`/`commit` 편의 vs 도메인 순수성 + id/equals 상속의 트레이드오프.
- 함정: 규칙 위반이 곧 "틀림"은 아니다. 프레임워크를 계속 쓸 게 확실하면 의도적으로 감수하는 흔한 선택.
- 함정: `node:crypto`처럼 런타임 표준 라이브러리도 엄밀히는 바깥 의존이다(작은 규모에선 보통 허용).

## 등장 이력

- 2026-08-04 · shared Entity 리뷰 · "infrastructure(low level)에 Entity를 뒀다"는 이해를 교정받음.
  배치(`src/shared/domain/`)는 맞았고 용어만 뒤집혀 있었음

## 인출 기록

- (없음)

## 관련 개념

- [[entity-vs-value-object]] — 이 규칙이 지키려는 가장 안쪽 원의 내용물
