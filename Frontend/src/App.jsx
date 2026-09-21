import "./App.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import { MyContext } from "./MyContext";
import { useState, useCallback, useEffect } from "react";
import { api, getSavedUser, getToken, clearSession } from "./api.js";

function App() {
  const [user, setUser] = useState(getSavedUser);
  const [authChecking, setAuthChecking] = useState(Boolean(getToken()));
  const [promt, setPromt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthChecking(false);
      return;
    }

    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  const fetchThreads = useCallback(async () => {
    if (!getToken()) return;
    try {
      const threads = await api.getThreads();
      setAllThreads(
        threads.filter(
          (thread) =>
            Array.isArray(thread.message) && thread.message.length > 0,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const createNewChat = useCallback(() => {
    setCurrThreadId(null);
    setPrevChats([]);
    setReply(null);
    setPromt("");
    setNewChat(true);
    setSidebarOpen(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setCurrThreadId(null);
    setPrevChats([]);
    setReply(null);
    setPromt("");
    setNewChat(true);
    setAllThreads([]);
  }, []);

  const providerValues = {
    user,
    setUser,
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    loading,
    setLoading,
    fetchThreads,
    createNewChat,
    logout,
    sidebarOpen,
    setSidebarOpen,
  };

  if (authChecking) {
    return <div className="authLoading">Loading...</div>;
  }

  if (!user) {
    return <Auth onAuth={setUser} />;
  }

  return (
    <div className="main">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
