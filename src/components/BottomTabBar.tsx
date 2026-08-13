import React from "react";
import { useApp } from "../context/AppContext";
import { Home, Search, MessageCircle, Settings } from "lucide-react";

const TABS = [
  { id: "home",     icon: Home,          label_en: "Home",     label_rw: "Ahabanza", label_fr: "Accueil",  label_sw: "Nyumbani" },
  { id: "search",   icon: Search,        label_en: "Search",   label_rw: "Shakisha", label_fr: "Recherche", label_sw: "Tafuta" },
  { id: "chats",    icon: MessageCircle, label_en: "Chats",    label_rw: "Ubutumwa", label_fr: "Discussions", label_sw: "Mazungumzo" },
  { id: "settings", icon: Settings,      label_en: "Settings", label_rw: "Igenamiterere", label_fr: "Paramètres", label_sw: "Mipangilio" },
];

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, setScreen, language, conversations, currentUser } = useApp();

  const unreadCount = conversations.reduce((acc, c) => {
    const unread = c.messages.filter(m => !m.read && m.senderId !== currentUser.id).length;
    return acc + unread;
  }, 0);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    switch (tabId) {
      case "home":
        setScreen("job-feed");
        break;
      case "search":
        setScreen("search");
        break;
      case "chats":
        setScreen("chats");
        break;
      case "settings":
        setScreen("settings");
        break;
    }
  };

  const getLabel = (tab: typeof TABS[number]) => {
    switch (language) {
      case "rw": return tab.label_rw;
      case "fr": return tab.label_fr;
      case "sw": return tab.label_sw;
      default:   return tab.label_en;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-black border-t border-white/10 flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabPress(tab.id)}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
          >
            <Icon size={22} className={active ? "text-[#00A550]" : "text-gray-500"} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? "text-[#00A550]" : "text-gray-500"}`}>
              {getLabel(tab)}
            </span>
            {tab.id === "chats" && unreadCount > 0 && (
              <span className="absolute top-1 right-[28%] min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
