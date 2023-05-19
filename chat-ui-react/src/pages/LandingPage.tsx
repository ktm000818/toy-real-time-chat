import style from "@/styles/LandingPage.module.scss";

export default function Page() {
  return (
    <div className={style["container"]}>
      <h1 className={style["title"]}>hello</h1>
      <div className={style["inputWrapper"]}>
        <input type="text" placeholder="닉네임을 입력해주세요." />
        <button>시작</button>
      </div>
    </div>
  );
}
