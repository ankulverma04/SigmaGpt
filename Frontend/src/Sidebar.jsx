import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { api } from "./api.js";
import "./Sidebar.css";

function Sidebar() {
  const {
    currThreadId,
    setCurrThreadId,
    allThreads,
    setPrevChats,
    setNewChat,
    setReply,
    setPromt,
    fetchThreads,
    createNewChat,
    sidebarOpen,
    setSidebarOpen,
  } = useContext(MyContext);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const closeSidebar = () => setSidebarOpen(false);

  const openThread = async (threadId) => {
    try {
      const messages = await api.getThreadMessages(threadId);
      setCurrThreadId(threadId);
      setPrevChats(messages || []);
      setNewChat(false);
      setReply(null);
      setPromt("");
      closeSidebar();
    } catch (err) {
      console.log(err);
    }
  };

  const removeThread = async (event, threadId) => {
    event.stopPropagation();
    try {
      await api.deleteThread(threadId);
      await fetchThreads();
      if (currThreadId === threadId) {
        setCurrThreadId(null);
        setPrevChats([]);
        setNewChat(true);
        setReply(null);
        setPromt("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className={`sidebarOverlay ${sidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      />
      <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebarTop">
          <button type="button" className="newChatBtn" onClick={createNewChat}>
            <img src="/chatgpt.jpg" alt="SigmaGpt" className="mainImg" />
            <span>New chat</span>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            type="button"
            className="closeSidebarBtn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul className="history">
          {allThreads.length === 0 && <li className="empty">No chats yet</li>}
          {allThreads.map((thread) => (
            <li
              key={thread.threadId}
              className={currThreadId === thread.threadId ? "active" : ""}
              onClick={() => openThread(thread.threadId)}
            >
              <span>{thread.title || "New Chat"}</span>
              <button
                type="button"
                className="deleteBtn"
                onClick={(event) => removeThread(event, thread.threadId)}
                aria-label="Delete chat"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>By Ankul Verma 🩶</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
