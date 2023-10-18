import { Blob } from "buffer";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface WebSocketPing extends WebSocket {
  isAlive: boolean;
}

const isBinary = (obj: any) => {
  return (
    typeof obj === "object" &&
    Object.prototype.toString.call(obj) === "[object Blob]"
  );
};

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const ws = useRef<WebSocketPing | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let interval: number;

  const openWebSocket = () => {
    closeWebSocket();

    const uuid = uuidv4();

    const url = `ws://localhost:3000/${uuid}`;

    ws.current = new WebSocket(url) as WebSocketPing;

    ws.current.onerror = function () {
      setMessages((prev) => [...prev, "Websocket error"]);
    };

    ws.current.onopen = function () {
      setMessages((prev) => [...prev, "Websocket connection established"]);

      if (ws.current) {
        ws.current.isAlive = true;
      }
    };

    ws.current.onclose = function () {
      setMessages((prev) => [...prev, "Websocket connection closed"]);
      clearInterval(interval);
    };

    ws.current.onmessage = function (msg: MessageEvent) {
      const processBinary = async (blob: Blob) => {
        const result = await blob.text();
        if (result === "pong") {
          if (ws.current) {
            ws.current.isAlive = true;
          }
        } else {
          setMessages((prev) => [...prev, `Received message: ${result}`]);
        }
      };

      if (isBinary(msg.data)) {
        processBinary(msg.data);
      } else {
        setMessages((prev) => [...prev, `Received message: ${msg.data}`]);
      }
    };

    interval = startInterval();
  };

  const closeWebSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const sendMessage = () => {
    if (!inputRef.current) {
      return;
    }

    const val = inputRef.current?.value;

    if (!val) {
      return;
    }

    if (!ws.current) {
      setMessages((prev) => [...prev, "No WebSocket connection"]);
      return;
    }

    ws.current.send(val);
    setMessages((prev) => [...prev, `Send "${val}"`]);
    inputRef.current.value = "";
  };

  const startInterval = () => {
    const interval = window.setInterval(() => {
      if (ws.current) {
        if (!ws.current.isAlive) {
          ws.current.close();
        }

        ws.current.isAlive = false;

        const msg = "ping";
        const arr = Uint8Array.from(msg, (c) => c.charCodeAt(0));
        ws.current.send(arr);
      }

      // for (let ws of wss.clients as Set<WebSocketAlive>) {
      //   if (!ws.isAlive) {
      //     return ws.terminate();
      //   }

      //   ws.isAlive = false;
      //   ws.ping();
      // }
    }, 15000);
    return interval;
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await fetch("http://localhost:3000/api/hello");
  //       const message = (await result.json()).message;
  //       setData(message);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <>
      <h1>Test:</h1>

      <button onClick={openWebSocket}>Open Connection</button>
      <button onClick={closeWebSocket}>Close Connection</button>
      <div>
        <input ref={inputRef} type="text" />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        {messages.map((message) => (
          <div>{message}</div>
        ))}
      </div>
    </>
  );
};

export default App;
