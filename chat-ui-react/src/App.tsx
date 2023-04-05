import Test from "components/Test";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io";
import io from "socket.io-client"

interface Message {
    message: string,
    class: string
}

const App = () => {
    const socketRef = useRef<any>(null);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>([])
    useEffect(() => {
        socketRef.current = io();

        socketRef.current.on('connect', function () {
            let name = prompt('Hello! set your name!', '')

            if (!name) {
                name = 'unknown'
            }
            
            socketRef.current.emit('newUser', name)
        })

        socketRef.current.on('update', function (data: any) {
            let className = ''

            switch (data.type) {
                case 'message':
                    className = 'other'
                    break

                case 'connect':
                    className = 'connect'
                    break

                case 'disconnect':
                    className = 'disconnect'
                    break
            }

            setMessages(prevMessages => [...prevMessages, { message: `${data.name}: ${data.message}`, class: className }])
        })

        return () => {
            socketRef.current = null;
        }
    }, [])



    const send = () => {
        let message = inputText;

        setInputText("");
        setMessages(prevMessages => [...prevMessages, { message, class: 'me' }]);

        socketRef.current.emit('message', { type: 'message', message: message })
    }

    return (
        <div id="main">
            <div id="chatWrapper">
                {/* <!-- 채팅 메시지 영역 --> */}
                {(messages || []).map((message, _) => {
                    return (
                        <div key={`message_${_}`} className={`wrapper-${message.class}`}>
                            <div className={message.class}>
                                {`${message.message}`}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div>
                <input type="text" id="test" placeholder="메시지를 입력해주세요.." value={inputText} onChange={e => setInputText(e.target.value)} />
                <button onClick={send}>전송</button>
            </div>
        </div>
    )
}

export default App;