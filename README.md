# WorksFrame (worksframe.com)

행정사 사무소 홈페이지 제작 랜딩 + 샘플 데모.

## 폴더 구조

```
/
├── index.html              # 메인 랜딩
├── privacy.html            # 개인정보처리방침
├── CNAME                   # GitHub Pages → worksframe.com
├── robots.txt
├── sitemap.xml
├── feed.xml                # RSS (네이버 제출용)
├── llms.txt                # AI/LLM용 요약
├── google….html            # Google Search Console 소유 확인 (루트 고정)
├── naver….html             # 네이버 서치어드바이저 소유 확인 (루트 고정)
├── assets/                 # 랜딩 CSS/JS
├── files/                  # 로고·아이콘
├── demos/                  # 공개 샘플 사이트
│   ├── portfolio/          # 종합
│   ├── immigration/        # 출입국
│   ├── factory/            # 공장·기업
│   ├── appeal/             # 행정심판
│   ├── driving/            # 자동차
│   ├── civil/              # 민원
│   └── land/               # 토지
├── _archive/drafts/        # 예전 초안 HTML (공개 링크 없음)
└── _source/                # 원본 이미지 등 (gitignore, 비공개)
```

## Google / Naver 확인 파일

루트에 두는 게 맞습니다. **비밀 키가 아닙니다.**

- 검색엔진이 `https://worksframe.com/파일이름.html` 로 열어보고 소유를 확인합니다.
- GitHub에 올려도 됩니다. 오히려 **공개되어야** 확인이 됩니다.
- `.env`, API 키, 비밀번호와는 다릅니다.
- 하위 폴더로 옮기면 확인이 깨집니다. 루트에 그대로 두세요.

## 배포

`main` 푸시 → GitHub Pages → https://worksframe.com/
