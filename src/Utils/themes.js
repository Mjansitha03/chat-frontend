const themes = {
  zynk: {
    name: "zynk",

    // BACKGROUNDS
    bg: "bg-slate-950",
    pageGradient:
      "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950",
    sectionGradient:
      "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900",

    // CARDS
    card: "bg-slate-900/80 backdrop-blur-xl",
    cardSoft: "bg-slate-800/80",
    cardBorder: "border border-slate-700/60",
    cardShadow:
      "shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition duration-300",

    // TEXT 
    textPrimary: "text-slate-100",
    textSecondary: "text-slate-200",
    textMuted: "text-slate-400",
    textWhite: "text-white",

    // BUTTONS 
    buttonPrimary:
      "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl px-4 py-2 transition duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50",

    buttonSecondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl px-4 py-2 transition duration-300",

    buttonSuccess:
      "bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl px-4 py-2 transition duration-300 shadow-lg shadow-green-500/30",

    buttonOutline:
      "border border-indigo-400 text-indigo-300 hover:bg-indigo-500/10 rounded-xl px-4 py-2 transition duration-300",

    buttonGradient:
      "bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 text-white rounded-xl px-4 py-2 shadow-lg shadow-purple-500/30",

    // INPUTS 
    input:
      "w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition",

    textarea:
      "w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400",

    select:
      "w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-400",

    // NAVBAR 
    navBg:
      "bg-slate-950/70 backdrop-blur-xl border-b border-slate-800 shadow-lg",
    navText: "text-slate-200",
    navHover: "hover:text-indigo-400 transition",

    // CHAT UI 
    messageOwn:
      "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl px-4 py-2 max-w-xs ml-auto shadow-md shadow-indigo-500/30",

    messageOther:
      "bg-slate-800 text-slate-200 rounded-2xl px-4 py-2 max-w-xs shadow-sm",

    messageTime: "text-xs text-slate-400 mt-1",

    typingIndicator: "text-green-400 text-sm animate-pulse",

    // DROPDOWN
    dropdownBg: "bg-slate-900/90 backdrop-blur-lg",
    dropdownBorder: "border border-slate-700",
    dropdownItemHover: "hover:bg-slate-800",

    // BADGES 
    badgePrimary:
      "bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs",

    badgeSuccess:
      "bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs",

    badgeMuted: "bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs",

    // ACCENTS
    accent: "text-indigo-400",
    accentBg: "bg-indigo-500",
    borderAccent: "border-indigo-400",
    ringAccent: "focus:ring-indigo-400",

    success: "text-green-400",
    successBg: "bg-green-500",

    // STATUS
    online: "text-green-400",
    offline: "text-slate-500",

    // SCROLLBAR
    scrollbar:
      "scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-slate-600 hover:scrollbar-thumb-indigo-500 scrollbar-track-slate-900/80",
  },
};

export default themes;



