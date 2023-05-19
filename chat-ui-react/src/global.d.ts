// 타입스크립트가 module.scss를 모듈로 인식하지 못하는 문제가 있어 정의해주어야 비로소 인식이 가능함.
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}
