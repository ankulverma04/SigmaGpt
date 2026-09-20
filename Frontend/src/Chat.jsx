import { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext.jsx";
import "./Chat.css";

function Chat() {
  const { prevChats, newChat, loading } = useContext(MyContext);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, loading]);

  if (newChat && prevChats.length === 0 && !loading) {
    return (
      <div className="chats emptyChat">
        <h1>What can I help with?</h1>
      </div>
    );
  }

  return (
    <div className="chats">
      {prevChats.map((chat, index) => (
        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={index}>
          {chat.role === "user" ? (
            <p className="userMessage">{chat.content}</p>
          ) : (
            <p className="gptMessage">{chat.content}</p>
          )}
        </div>
      ))}
      {loading && (
        <div className="gptDiv">
          <p className="gptMessage typing">Thinking...</p>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

export default Chat;
