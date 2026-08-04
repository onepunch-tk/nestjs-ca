---
status: 설명만 들음
first-seen: 2026-08-04
---

# Cache-aside

응용 코드가 캐시를 먼저 조회하고, 미스면 원본에서 읽어와 캐시를 채운 뒤 반환한다.

## 핵심 (재구성 단서)

- 이름의 유래: 캐시가 DB **앞을 막고** 서 있는(read-through) 게 아니라 **옆에(aside)** 비켜서 있고,
  어디서 읽을지를 응용 코드가 직접 결정한다.
- 절차: `get(key)` → 히트면 즉시 return / 미스면 `repository` 조회 → `set(key, value, ttl)` → return.
- 워크드 예제(설계안): `GetProductHandler.execute()`에서 `key = 'product:p-1'`.
  1회차 → 캐시 `null` → DB 1회 조회 → `set(key, view, 60)`. 2회차(3초 뒤) → 히트 → **DB 0회**.
  61초 뒤 TTL 만료로 다시 미스. 검증도 이 차이로 한다(`dbCalls === 1`).
- **⚠️ 캐시에는 엔티티가 아니라 평평한 DTO를 넣는다.** `Product`는 `Money`/`Sku`/`ProductId`
  클래스 인스턴스를 품고 있어서 `JSON.stringify`→`parse` 후 프로토타입이 사라져
  `price.getAmount()`가 `TypeError`. CQRS의 읽기 측이 애그리게이트를 안 되살리는 이유와 같다.
- 무효화(invalidation)는 별개 결정: 커맨드 핸들러에서 직접 `del` vs 도메인 이벤트 핸들러에서 `del`.
  전자는 흐름이 명시적이나 키가 늘 때마다 커맨드를 고쳐야 하고, 후자는 커맨드가 캐시를 모르지만
  이벤트 유실 시 stale.
- 함정: 없는 키를 캐시하지 않으면 매 요청이 DB로 내려간다(**cache penetration**). 소규모에선 무시.

## 등장 이력

- 2026-08-04 · CQRS 쿼리 핸들러에 Redis 캐싱 배치 설계 · 설명만, 코드 미적용

## 인출 기록

- (없음)

## 관련 개념

- [[dependency-inversion-principle]] — 이 패턴이 의존하는 `CachePort`가 왜 안쪽에 있어야 하는지
- [[entity-vs-value-object]] — 캐시에 엔티티를 넣으면 안 되는 이유(VO가 클래스 인스턴스라서)
