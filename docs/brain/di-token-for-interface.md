---
status: 직접 다뤄봄
first-seen: 2026-08-04
---

# DI 토큰이 필요한 이유 (interface는 런타임에 없다)

TypeScript `interface`는 컴파일 후 사라지므로, 런타임 DI 컨테이너에 주입하려면 런타임에도 존재하는 값(Symbol)을 토큰으로 만들어야 한다.

## 핵심 (재구성 단서)

- 유도: `interface`는 타입 전용이라 JS 산출물에 실체가 없다 → `emitDecoratorMetadata`가 남기는
  `design:paramtypes`에는 클래스명 대신 `Object`가 기록됨 → Nest는 "무엇을 주입할지" 알 수 없어 실패
  → 런타임에 살아남는 값을 토큰으로 별도 선언하고 `@Inject(TOKEN)`으로 명시해야 함.
- 그래서 포트 파일은 항상 짝으로 나온다: `export const X_PORT = Symbol('X_PORT')` + `export interface X`.
- 워크드 예제: `constructor(private cache: CachePort)` ❌ →
  `constructor(@Inject(CACHE_PORT) private readonly cache: CachePort)` ✅
- 클래스는 이 문제가 없다 — 클래스는 런타임 값이라 타입 자체가 토큰이 된다.
  그래서 `constructor(private readonly config: ConfigService)`는 `@Inject` 없이 동작.
- 이 레포의 관례: 문자열이 아니라 `Symbol`. `DRIZZLE`, `MONGO_DB`가 이미 그렇게 돼 있음
  (`drizzle.provider.ts`, `mongo.provider.ts`). Symbol은 전역 유일해서 토큰 충돌이 원천적으로 없다.
- 함정: 토큰과 interface를 같은 파일에 두는 게 관례지만, 그 파일이 어느 **계층**에 있는지가 본질.
  토큰이 application에 있어야 [[dependency-inversion-principle]]이 성립한다.

## 등장 이력

- 2026-08-04 · Redis 캐싱 포트 설계 · 설명만, 코드 미적용
- 2026-08-05 · Product 생성 핸들러 · `@Inject(PRODUCT_REPOSITORY)`를 직접 작성. 짝으로 배운 것:
  `import { type ProductRepository }`의 `type`은 import **문**이 아니라 그 **바인딩 하나**만 지운다
  (같은 줄의 Symbol은 런타임 값이라 남는다). `isolatedModules: true`라 파일별 독립 변환이므로 필요

## 인출 기록

- (없음)

## 관련 개념

- [[dependency-inversion-principle]] — 이 우회가 필요해지는 이유. 포트를 주입할 때만 생기는 문제
