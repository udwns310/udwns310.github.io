# Sentinel 발표 자료 (5조 감시자들)

> **AI로 작업한다면 먼저 [`AI_GUIDE.md`](AI_GUIDE.md)를 읽히세요.** 색, 용어, 문체, 근거 규칙이 정리되어 있습니다.

발표용 HTML 슬라이드입니다. 슬라이드를 장별로 나눈 `src/` 를 고치고, `build.py` 로 `index.html` 한 파일을 만들어 발표합니다.

## 작업 방법

```bash
python build.py          # src/ → index.html 생성
python build.py --watch  # src/ 를 저장할 때마다 자동 재생성 (브라우저 새로고침으로 확인)
```

- 발표는 `index.html` 을 브라우저에서 열면 됩니다 (`assets/` 폴더와 같은 위치에 있어야 합니다).
- **`index.html` 은 생성 파일이므로 직접 고치지 마세요.** 다음 빌드에서 덮어써집니다. 항상 `src/` 를 고치세요.
- 단축키: ←/→ 이동, N 노트, T 타이머, O 목록, F 전체화면. 주소 끝에 `#9` 처럼 번호를 붙이면 그 장으로 바로 열립니다.

## 폴더 구조

| 위치 | 내용 |
|---|---|
| `src/slides/NN-이름.html` | 슬라이드 한 장 (`<section>` 하나). **번호 순서 = 발표 순서** |
| `src/slides/NN-이름.js` | (선택) 그 슬라이드 전용 스크립트. 지금은 16번(신뢰구간 차트)만 있음 |
| `src/notes/NN-이름.txt` | 그 슬라이드의 발표자 노트. 한 줄, 큰따옴표는 `\"` 로 쓸 것 |
| `src/css/base.css` | 공통 스타일 (색 변수, 카드, 막대, 파이프라인 등) |
| `src/js/main.js`, `tail.js` | 공통 스크립트 (이동, 노트, 타이머, 애니메이션) |
| `src/head.html`, `chrome-*.html`, `tail.html` | 문서 뼈대 (거의 고칠 일 없음) |
| `assets/` | 이미지, 로고, 3D 엔진 페이지 |

## 현재 슬라이드

| 번호 | 파일 | 내용 |
|---|---|---|
| 01 | cover | 표지 |
| 02 | team | 조원별 역할 |
| 03 | agenda | 목차 |
| 04 | problem | 문제 정의 |
| 05 | data | 데이터 이해 |
| 06 | preprocess | 전처리 4단계 |
| 07 | timeseries | 시계열 그림 |
| 08 | features | 특성·센서 중요도 |
| 09 | task-classification | 필수 과제: 위험 분류 (진행 과정) |
| 10 | classification-result | 분류 결과 |
| 11 | task-regression | 선택 과제: 남은 수명 예측 (진행 과정) |
| 12 | regression-result | 회귀 결과 |
| 13 | cross-dataset | 교차 검증 |
| 14 | danger-threshold | 위험 기준 40의 근거 |
| 15 | model-selection | 최종 모델 선정 |
| 16 | confidence-interval | 신뢰구간 |
| 17 | false-alarm | 오탐 사례 |
| 18 | missed-case | 미탐 사례 |
| 19 | field-use | 현장 활용(대시보드) |
| 20 | limits | 한계 |
| 21 | next-summary | 다음 단계와 요약 |
| 22 | qna | Q&A |

## 슬라이드 추가·삭제·순서 바꾸기

- **추가:** `src/slides/` 에 `NN-이름.html` 을 만들고 같은 이름의 `src/notes/NN-이름.txt` 도 만듭니다 (노트가 없으면 빈 노트로 처리).
- **순서 바꾸기:** 파일 이름 앞의 번호를 바꿉니다 (노트 파일도 같이). 번호는 정렬 기준일 뿐이라 `05`, `05b` 처럼 사이에 끼워 넣어도 됩니다.
- **삭제:** 해당 `.html`(과 `.js`, `.txt`)를 지웁니다.
- 슬라이드 쪽번호, 목록(O), 타이머 시간은 `<section data-title=... data-t=...>` 속성에서 자동으로 만들어집니다.

## 협업 규칙 (제안)

- 한 사람이 슬라이드 한 장(파일 하나)을 맡으면 충돌이 거의 없습니다.
- 공통 스타일(`base.css`)을 바꿀 때는 다른 장에 영향이 가므로 팀에 먼저 알립니다. 한 장에서만 쓰는 스타일은 해당 슬라이드의 `style="..."` 에 직접 쓰는 편이 안전합니다.
- 색: UI(박스·카드)는 POSCO CI 색, 막대·차트는 모델별 규칙(기준 모델 회색 / RandomForest 주황 `--rf` / GRU 파랑 / LSTM 하늘색 / 실패 빨강)을 씁니다.
- 수치는 분석 저장소의 결과 파일(`outputs/FD004/metrics/*.json·csv`)과 맞춥니다.
