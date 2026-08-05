---
status: 직접 다뤄봄
first-seen: 2026-08-04
---

# Dependency Inversion Principle (DIP) / Ports & Adapters

안쪽 계층이 바깥 기능을 써야 할 때, 그 계약(interface)을 **안쪽에 정의**하고 바깥이 구현하게 해서 import 화살표를 안쪽으로 되돌린다.

## 핵심 (재구성 단서)

- 유도: 안쪽이 바깥을 직접 import하면 화살표가 바깥을 향함([[dependency-rule]] 위반) → 계약만
  안쪽에 두고 구현을 바깥에 두면 → **바깥이 안쪽을 import**하게 되어 화살표가 뒤집힘 → 안쪽은
  바깥의 존재를 모른 채로 바깥 기능을 쓴다.
- 용어: 안쪽이 정의한 계약 = **Port**, 바깥의 구현 = **Adapter**, 둘을 잇는 배선만 아는 유일한
  최외곽 지점 = **Composition Root**(NestJS에선 `@Module`).
- 위반의 실제 비용(형식 문제가 아님): ① 단위 테스트에 실제 인프라(Redis/DB)가 필요해짐
  ② 구현 교체 시 응용 코드를 수정해야 함 ③ 유스케이스 로직에 벤더 API 문자열이 섞임.
- 워크드 예제(설계안, 코드 미적용): `CachePort` interface를 `shared/application/ports/`에,
  `RedisCacheAdapter implements CachePort`를 `shared/infrastructure/cache/redis/`에,
  `{ provide: CACHE_PORT, useClass: RedisCacheAdapter }`를 `redis.module.ts`에.
  → `GetProductHandler`의 import 목록에 `infrastructure`/`ioredis`가 한 번도 안 나옴.
- 판별식: **Port를 domain에 둘지 application에 둘지**는 "그 개념이 유비쿼터스 언어에 있는가".
  Repository("Product를 저장한다") → domain. Cache("TTL 60초") → 도메인 전문가가 쓰지 않는 말이므로
  application.
- 함정: 모든 외부 의존에 포트를 씌우는 건 과설계. "갈아끼울 가능성 × 그 사실에 의존하는 파일 수"가
  판단 기준. 이 레포의 `DrizzleModule`은 `DRIZZLE` 토큰을 그대로 export 중(= 포트 없음).
- 함정: `exports`에서 구체 토큰을 빼도 **컴파일이 아니라 부팅 시** `UnknownDependenciesException`으로
  막힌다. 토큰은 그냥 export된 const라 `tsc`는 통과함.

## 등장 이력

- 2026-08-04 · CQRS 구조에 Redis 캐싱 배치 설계 · 설명만, 코드 미적용
- 2026-08-05 · Product 생성 파이프라인 · **처음으로 코드에 적용**. `PRODUCT_REPOSITORY` 포트(application)
  ← `DrizzleProductRepository`(infrastructure), 배선은 `product.module.ts`의 `{ provide, useClass }`.
  `create-product.handler.ts`의 import 목록에 infrastructure가 안 나오는 것으로 화살표 방향 확인 가능

## 인출 기록

- 2026-08-04 · "안쪽이 바깥을 import 않고 쓰려면 뭘 끼우나" 스케치 질문 · **부분 성공** —
  handler=application, redis=infrastructure까지 맞췄으나 "handler가 redis를 import"로 답해 방향 위반
- 2026-08-04 · `RedisModule`은 포트만 export하고 `DrizzleModule`은 구체 토큰을 export하는 차이의
  비용은? Drizzle에도 포트를 씌워야 하나? · (대기)

## 관련 개념

- [[dependency-rule]] — DIP가 지키려는 상위 규칙. 화살표 방향의 정의는 그쪽에 있음
- [[cache-aside]] — 이 포트를 실제로 소비하는 쪽의 패턴
- [[di-token-for-interface]] — 포트를 NestJS DI에 실제로 꽂을 때 필요한 우회
