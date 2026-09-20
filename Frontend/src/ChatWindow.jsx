import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { api } from "./api.js";
import { useContext, useEffect, useRef, useState } from "react";

function ChatWindow() {
  const {
    user,
    promt,
    setPromt,
    setReply,
    currThreadId,
    setCurrThreadId,
    setPrevChats,
    setNewChat,
    loading,
    setLoading,
    fetchThreads,
    logout,
  } = useContext(MyContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const textareaRef = useRef(null);

  const initials = (user?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [promt]);

  const getReply = async () => {
    const message = promt.trim();
    if (!message || loading) return;

    setLoading(true);
    setNewChat(false);
    setPromt("");
    setPrevChats((chats) => [...chats, { role: "user", content: message }]);

    try {
      let threadId = currThreadId;
      if (!threadId) {
        const thread = await api.createThread();
        threadId = thread.threadId;
        setCurrThreadId(threadId);
      }

      const data = await api.sendMessage(threadId, message);
      const assistantMessage = Array.isArray(data)
        ? data.find((item) => item.role === "assistant")
        : null;
      const content = assistantMessage?.content || "No reply from model.";

      setReply(content);
      setPrevChats((chats) => [...chats, { role: "assistant", content }]);
      await fetchThreads();
    } catch (err) {
      console.log(err);
      setPrevChats((chats) => [
        ...chats,
        {
          role: "assistant",
          content: err.message || "Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGpt<i className="fa-solid fa-circle-chevron-down"></i>
        </span>
        <div className="profileWrap" ref={menuRef}>
          <button
            type="button"
            className="navUserIcon"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open profile"
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="profileMenu">
              <p className="profileName">{user?.name}</p>
              <p className="profileEmail">{user?.email}</p>
              <button type="button" className="logoutBtn" onClick={logout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <Chat />

      <div className="chatInput">
        <div className="inputBox">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask anything"
            value={promt}
            disabled={loading}
            onChange={(e) => setPromt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                getReply();
              }
            }}
          />
          <button
            type="button"
            id="submit"
            onClick={getReply}
            disabled={loading || !promt.trim()}
            aria-label="Send message"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <p className="info">
          SigmaGpt can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
