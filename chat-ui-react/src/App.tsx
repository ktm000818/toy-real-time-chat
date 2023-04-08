import Test from "components/Test";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface Message {
  name?: string;
  message: string;
  class: string;
}

const App = () => {
  const socketRef = useRef<any>(null);
  const goBottom = useRef<boolean>(false);
  const messageRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    socketRef.current = io();
    let name = prompt("Hello! set your name!", "");

    if (!name) {
      name = "unknown";
    }

    socketRef.current.on("connect", function () {
      socketRef.current.emit("newUser", name);
    });

    socketRef.current.on("update", function (data: any) {
      let className = "";

      switch (data.type) {
        case "message":
          className = "other";
          break;

        case "connect":
          className = "connect";
          break;

        case "disconnect":
          className = "disconnect";
          break;
      }

      checkScrollBottom();

      const message =
        data.name === "SERVER"
          ? { message: `${data.name}: ${data.message}`, class: className }
          : { name: data.name, message: data.message, class: className };

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // 메시지 입력 창 포커스
    inputRef.current.focus();

    return () => {
      socketRef.current = null;
    };
  }, []);

  const checkScrollBottom = () => {
    const chatArea = messageRef.current;
    if (Math.round(chatArea.clientHeight + chatArea.scrollTop) >= chatArea.scrollHeight) {
      goBottom.current = true;
    } else {
      goBottom.current = false;
    }
  };

  const send = () => {
    if (!inputText) {
      return false;
    }

    checkScrollBottom();

    setInputText("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { name: "", message: inputText, class: "me" },
    ]);

    socketRef.current.emit("message", { type: "message", message: inputText });
  };

  useEffect(() => {
    if (goBottom.current === true) {
      messageRef.current.scrollTo(null, messageRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <div id="main">
      <div id="chatWrapper" ref={messageRef}>
        {/* <!-- 채팅 메시지 영역 --> */}
        {(messages || []).map((message, _) => {
          return (
            <>
              <div style={{ display: "flex", padding: "0px 0px 0px 20px" }}>
                {message.name}
              </div>
              <div key={`message_${_}`} className={`wrapper-${message.class}`}>
                <div className={message.class}>{`${message.message}`}</div>
              </div>
            </>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          id="test"
          placeholder="메시지를 입력해주세요.."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
        />
        <button onClick={send} disabled={!Boolean(inputText)}>
          전송
        </button>
      </div>
    </div>
  );
};

export default App;
