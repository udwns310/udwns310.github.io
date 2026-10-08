"""src/ 의 조각을 모아 index.html 한 파일(발표용, 외부 의존 없음)을 만듭니다.

    python build.py          # index.html 생성
    python build.py --watch  # src/ 가 바뀔 때마다 자동 재생성 (편집하면서 새로고침으로 확인)

조각 규칙
  src/slides/NN-이름.html   슬라이드 한 장 (<section> 하나). 번호 순서 = 발표 순서
  src/slides/NN-이름.js     (선택) 그 슬라이드 전용 스크립트. 같은 NN-이름 으로 맞출 것
  src/notes/NN-이름.txt     그 슬라이드의 발표자 노트 (한 줄, 큰따옴표는 \\" 로 쓸 것)
  src/css/base.css          공통 스타일
  src/js/main.js, tail.js   공통 스크립트 (슬라이드 이동, 노트, 타이머 등)
"""
import glob
import os
import sys
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')


def read(rel):
    with open(os.path.join(SRC, rel), encoding='utf-8', newline='') as f:
        return f.read()


def build():
    slides = sorted(glob.glob(os.path.join(SRC, 'slides', '*.html')))
    names = [os.path.splitext(os.path.basename(p))[0] for p in slides]
    deck = ''.join(read(os.path.join('slides', n + '.html')) for n in names)
    notes = ''
    for n in names:
        p = os.path.join('notes', n + '.txt')
        text = read(p) if os.path.exists(os.path.join(SRC, p)) else ''
        notes += '        "' + text + '",\n'
    slide_js = ''
    for n in names:
        p = os.path.join('slides', n + '.js')
        if os.path.exists(os.path.join(SRC, p)):
            slide_js += read(p)
    out = (
        read('head.html') + read(os.path.join('css', 'base.css'))
        + read('chrome-top.html') + deck + read('chrome-bottom.html')
        + '      const NOTES = [\n' + notes + '      ];\n'
        + read(os.path.join('js', 'main.js')) + slide_js
        + read(os.path.join('js', 'tail.js')) + read('tail.html')
    )
    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8', newline='') as f:
        f.write(out)
    print(f'index.html 생성: 슬라이드 {len(names)}장')


def stamp():
    return max(os.path.getmtime(p) for p in glob.glob(os.path.join(SRC, '**', '*'), recursive=True) if os.path.isfile(p))


if __name__ == '__main__':
    build()
    if '--watch' in sys.argv:
        last = stamp()
        while True:
            time.sleep(1)
            cur = stamp()
            if cur != last:
                last = cur
                build()
