# react-webpack-template

CRA를 사용하지않은 리액트 보일러플레이트입니다.

## npm
npm run dev
<br/>
 - 8081 포트로 개발서버를 실행합니다. 포트는 수정 가능합니다.
 - webpack.common.js + webpack.dev.js 설정을 바탕으로 webpack-dev-server를 실행합니다.

npm run build
<br/>
 - production 모드로 번들링을 진행합니다. webpack.common.js + webpack.prod.js 조합으로 번들링 합니다.
 - entry에 지정된 파일을 포함한 하위 요소를 번들링합니다.
