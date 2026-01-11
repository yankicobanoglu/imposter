import React, { useState, useEffect } from 'react';
import { Users, Wifi, Trash2, HelpCircle, ArrowRight, UserPlus, RotateCcw, SkipForward, ArrowLeft, CheckCircle, Sparkles, Gavel, Settings2, Share, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { GameState, Difficulty, Player, RoomData } from './types';
import { CATEGORIES } from './constants';
import { getRandomWord, assignRoles } from './utils/gameLogic';
import { Button } from './components/ui/Button';
import { CategoryGrid } from './components/CategoryGrid';
import { HowToPlay } from './components/HowToPlay';
import { createRoom, joinRoom, subscribeToRoom, updateRoomState, hasCredentials, getSupabase, submitCustomWord } from './services/supabase';

// --- Background Component ---
const Background = () => (
  <div className="fixed inset-0 -z-10 bg-[#0f172a] overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950"></div>
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-float"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
  </div>
);

// --- Small Components ---

const Header = () => (
  <header className="p-6 flex items-center justify-center relative z-10">
    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg transform rotate-6 shadow-lg flex items-center justify-center text-slate-900 font-bold text-xl">
        ?
      </div>
      <h1 className="text-2xl font-bold text-white tracking-wide">
        IMPOSTER
      </h1>
    </div>
  </header>
);

interface PlayerInputProps {
  name: string;
  onRemove: () => void;
  onChange: (v: string) => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ name, onRemove, onChange }) => (
  <div className="flex gap-2 mb-3 animate-fadeIn group">
    <input
      type="text"
      value={name}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all font-semibold placeholder:text-slate-600"
      placeholder="Player Name"
    />
    <button 
      onClick={onRemove}
      className="px-4 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5"
      title="Remove Player"
    >
      <Trash2 size={20} />
    </button>
  </div>
);

const TimerDisplay: React.FC<{ timeLeft: number; total: number }> = ({ timeLeft, total }) => {
  const progress = Math.max(0, (timeLeft / total) * 100);
  const color = timeLeft < 10 ? 'text-rose-400' : 'text-emerald-400';
  const format = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div className={`text-4xl font-mono font-bold ${color} drop-shadow-md`}>
        {format(timeLeft)}
      </div>
      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const VoteModal: React.FC<{ 
  players: Player[]; 
  onVote: (id: string) => void; 
  onClose: () => void; 
  myId: string;
}> = ({ players, onVote, onClose, myId }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Gavel className="text-purple-400"/> Vote for Imposter
      </h3>
      <div className="space-y-2 mb-6">
        {players.filter(p => p.id !== myId).map(p => (
          <button
            key={p.id}
            onClick={() => onVote(p.id)}
            className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl text-left font-bold text-white border border-white/5 flex justify-between items-center transition-all"
          >
            {p.name}
            <div className="w-6 h-6 rounded-full border-2 border-white/20"></div>
          </button>
        ))}
      </div>
      <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
    </div>
  </div>
);

// Expandable Category Section
const ExpandableCategorySection: React.FC<{ 
  selectedIds: string[]; 
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}> = ({ selectedIds, onToggle, onSelectAll, isAllSelected }) => {
    const [expanded, setExpanded] = useState(false);

    // First 6 + Custom are primary
    const initialCount = 6;
    const visibleCategories = expanded ? CATEGORIES : CATEGORIES.slice(0, initialCount);

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-end px-2">
                <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Categories</h3>
                <button onClick={onSelectAll} className="text-xs text-white/60 hover:text-white underline">
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
             </div>
             
             <CategoryGrid categories={visibleCategories} selectedIds={selectedIds} onToggle={onToggle} />
             
             {CATEGORIES.length > initialCount && (
                 <button 
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors"
                 >
                     {expanded ? <>Show Less <ChevronUp size={16}/></> : <>Show More Categories ({CATEGORIES.length - initialCount}) <ChevronDown size={16}/></>}
                 </button>
             )}
        </div>
    )
}

export default function App() {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  
  // Local Play State
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', isImposter: false, score: 0 },
    { id: '2', name: 'Player 2', isImposter: false, score: 0 },
    { id: '3', name: 'Player 3', isImposter: false, score: 0 },
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['animals', 'food', 'objects']);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([Difficulty.EASY]);
  
  // Settings
  const [timerDuration, setTimerDuration] = useState<number>(0); // 0 means off
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [localImposterCount, setLocalImposterCount] = useState<number>(1);

  // Game Data
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0); // Used for Pass 'n Play Reveal
  const [startingPlayerIndex, setStartingPlayerIndex] = useState<number>(0); // Used for Discussion Start
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [localCustomWords, setLocalCustomWords] = useState<string[]>([]); // For local pot mode
  const [customWordInput, setCustomWordInput] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]); // Track used words locally
  
  // Remote Play State
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [myPlayerName, setMyPlayerName] = useState<string>('');
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  
  // New State for Invite Flow
  const [isInviteFlow, setIsInviteFlow] = useState<boolean>(false);

  // --- Effects ---

  // Check for URL parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('room');
    if (codeParam) {
      setRoomCode(codeParam.toUpperCase());
      setIsInviteFlow(true);
      setGameState(GameState.REMOTE_MENU);
    }
  }, []);

  useEffect(() => {
    if ((gameState === GameState.REMOTE_LOBBY || gameState === GameState.REMOTE_PLAYING || gameState === GameState.REMOTE_REVEAL || gameState === GameState.REMOTE_INPUT) && roomCode) {
      const sub = subscribeToRoom(roomCode, (newData) => {
        setRoomData(newData);
        if (newData.game_state === 'PLAYING' && gameState !== GameState.REMOTE_PLAYING) setGameState(GameState.REMOTE_PLAYING);
        if (newData.game_state === 'REVEAL' && gameState !== GameState.REMOTE_REVEAL) setGameState(GameState.REMOTE_REVEAL);
        if (newData.game_state === 'LOBBY' && gameState !== GameState.REMOTE_LOBBY) setGameState(GameState.REMOTE_LOBBY);
        if (newData.game_state === 'INPUT' && gameState !== GameState.REMOTE_INPUT) setGameState(GameState.REMOTE_INPUT);
      });
      return () => { sub?.unsubscribe(); };
    }
  }, [roomCode, gameState]);

  // Timer Effect (Local)
  useEffect(() => {
    if (gameState === GameState.PLAYING && timerDuration > 0 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timerDuration, timeLeft]);

  // Timer Effect (Remote)
  useEffect(() => {
    if (gameState === GameState.REMOTE_PLAYING && roomData?.settings?.timerDuration && roomData.started_at) {
      const interval = setInterval(() => {
        const start = new Date(roomData.started_at!).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - start) / 1000);
        const remaining = Math.max(0, roomData.settings!.timerDuration - elapsed);
        setTimeLeft(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, roomData]);

  // --- Actions ---

  const addPlayer = () => {
    const newId = (players.length + 1).toString();
    setPlayers([...players, { id: newId, name: `Player ${newId}`, isImposter: false, score: 0 }]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 3) return;
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
    // Reset local imposter count if players drop below 7
    if (newPlayers.length < 7) setLocalImposterCount(1);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const toggleCategory = (id: string) => {
    // If Custom is selected, it must be the ONLY category (simplification for game logic)
    if (id === 'custom') {
        if (selectedCategories.includes('custom')) {
             setSelectedCategories(['animals']); // Fallback
        } else {
             setSelectedCategories(['custom']);
        }
        return;
    }

    // If Custom was previously selected and we pick something else, remove Custom
    let newSelection = selectedCategories.filter(c => c !== 'custom');
    
    if (newSelection.includes(id)) {
      if (newSelection.length > 1) newSelection = newSelection.filter(c => c !== id);
    } else {
      newSelection = [...newSelection, id];
    }
    setSelectedCategories(newSelection);
  };

  const toggleAllCategories = () => {
    // Check if all regular categories are currently selected
    const allRegularCategories = CATEGORIES.filter(c => !c.isCustom).map(c => c.id);
    const isAllSelected = allRegularCategories.every(id => selectedCategories.includes(id));

    if (isAllSelected) {
        setSelectedCategories([]);
    } else {
        setSelectedCategories(allRegularCategories);
    }
  };

  const toggleDifficulty = (diff: Difficulty) => {
    if (selectedDifficulties.includes(diff)) {
      if (selectedDifficulties.length > 1) setSelectedDifficulties(selectedDifficulties.filter(d => d !== diff));
    } else {
      setSelectedDifficulties([...selectedDifficulties, diff]);
    }
  };

  const shareRoomLink = async () => {
    const url = `${window.location.origin}?room=${roomCode}`;
    const shareData = {
      title: 'Join Imposter Game',
      text: `Come play Imposter with me! Room Code: ${roomCode}`,
      url: url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share skipped", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleVote = async (suspectId: string) => {
    if (!roomData) return;
    const supabase = getSupabase();
    if (!supabase) return;

    // Fetch latest to avoid race conditions slightly
    const { data } = await supabase.from('rooms').select('votes').eq('room_code', roomCode).single();
    const currentVotes = data?.votes || {};
    
    await updateRoomState(roomCode, {
      votes: { ...currentVotes, [myPlayerId]: suspectId }
    });
    setShowVoteModal(false);
  };

  // --- Game Flows ---

  const startLocalGame = () => {
    if (selectedCategories.length === 0) return alert("Please select at least one category.");
    if (players.length < 3) return alert("You need at least 3 players to start.");
    
    // Check for Pot Mode
    if (selectedCategories.includes('custom')) {
        setLocalCustomWords([]);
        setCurrentPlayerIndex(0);
        setCustomWordInput('');
        setGameState(GameState.INPUT);
        return;
    }

    setIsRevealing(false);
    // Use the localImposterCount (1 or 2)
    const initializedPlayers = assignRoles(players, localImposterCount);
    setPlayers(initializedPlayers);
    const { word, categoryName } = getRandomWord(selectedCategories, selectedDifficulties, usedWords);
    
    // Track used word
    setUsedWords(prev => [...prev, word]);

    setCurrentWord(word);
    setCurrentCategoryName(categoryName);
    setCurrentPlayerIndex(0);
    // Rotate starting player locally
    setStartingPlayerIndex((prev) => (prev + 1) % players.length);
    setTimeLeft(timerDuration);
    setGameState(GameState.PASS_N_PLAY);
  };

  // Handle local custom word submission
  const handleLocalCustomSubmit = (word: string | null) => {
      // If word provided, add to pool. If null, skipped.
      if (word && word.trim().length > 0) {
          setLocalCustomWords([...localCustomWords, word.trim()]);
      }
      setCustomWordInput('');

      // Move to next player
      if (currentPlayerIndex < players.length - 1) {
          setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
          // All players submitted. Start game.
          if (localCustomWords.length === 0 && (!word || word.trim().length === 0)) {
               // Edge case: everyone skipped
               alert("Everyone skipped! Switching to random category.");
               setSelectedCategories(['animals']); // Fallback
               setGameState(GameState.SETUP);
               return;
          }
          
          // Start the actual game with custom pool
          setIsRevealing(false);
          // Use localImposterCount here too
          const initializedPlayers = assignRoles(players, localImposterCount);
          setPlayers(initializedPlayers);
          const pool = word ? [...localCustomWords, word] : localCustomWords; // include last word
          const { word: chosenWord, categoryName } = getRandomWord(['custom'], [], [], pool);
          setCurrentWord(chosenWord);
          setCurrentCategoryName(categoryName);
          setCurrentPlayerIndex(0);
          setStartingPlayerIndex((prev) => (prev + 1) % players.length);
          setTimeLeft(timerDuration);
          setGameState(GameState.PASS_N_PLAY);
      }
  };

  const handleCreateRoom = async () => {
    if (!myPlayerName) return alert("Enter your name first");
    if (!hasCredentials()) return alert("Database not connected.");
    
    setIsLoading(true);
    const myId = Math.random().toString(36).substr(2, 9);
    setMyPlayerId(myId);
    
    const hostPlayer: Player = { id: myId, name: myPlayerName, isImposter: false, score: 0 };
    try {
      const result = await createRoom(hostPlayer);
      if (result.success && result.code) {
        setRoomCode(result.code);
        setRoomData({
          room_code: result.code,
          host_id: myId,
          players: [hostPlayer],
          game_state: 'LOBBY',
          current_word: '',
          current_category: '',
          settings: { timerDuration: 0, imposterCount: 1 },
          custom_words: [],
          starting_player_index: 0,
          used_words: []
        });
        setGameState(GameState.REMOTE_LOBBY);
      } else {
        alert("Error: " + result.error);
      }
    } catch (e) {
      alert("Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!myPlayerName) return alert("Enter your name first");
    if (!roomCode) return alert("Enter room code");
    if (!hasCredentials()) return alert("Database not connected.");

    setIsLoading(true);
    const myId = Math.random().toString(36).substr(2, 9);
    setMyPlayerId(myId);

    const player: Player = { id: myId, name: myPlayerName, isImposter: false, score: 0 };
    try {
      const res = await joinRoom(roomCode.toUpperCase(), player);
      if (res.success) {
        setGameState(GameState.REMOTE_LOBBY);
      } else {
        alert(res.msg);
      }
    } catch (e) {
      alert("Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRemoteGame = async () => {
    if (!roomData) return;
    if (roomData.players.length < 3) return alert("You need at least 3 players to start.");
    
    // Ensure we use the latest settings for imposter count
    const imposters = roomData.settings?.imposterCount || 1;

    // Check Pot Mode
    if (selectedCategories.includes('custom')) {
        await updateRoomState(roomCode, { 
            game_state: 'INPUT', 
            custom_words: [], 
            settings: { 
                timerDuration: timerDuration,
                imposterCount: imposters
            }
        });
        return;
    }

    const initializedPlayers = assignRoles(roomData.players, imposters);
    const usedWordsList = roomData.used_words || [];
    const { word, categoryName } = getRandomWord(selectedCategories, selectedDifficulties, usedWordsList);
    const newStartingIndex = ((roomData.starting_player_index || 0) + 1) % roomData.players.length;

    await updateRoomState(roomCode, {
      players: initializedPlayers,
      current_word: word,
      current_category: categoryName,
      game_state: 'PLAYING',
      settings: { 
          timerDuration: timerDuration,
          imposterCount: imposters
      },
      votes: {},
      started_at: new Date().toISOString(),
      starting_player_index: newStartingIndex,
      used_words: [...usedWordsList, word] // Update used words
    });
  };

  // Remote Input Phase Handling
  const [remoteInputSubmitted, setRemoteInputSubmitted] = useState(false);
  const handleRemoteInputSubmit = async (skipped: boolean) => {
      if (!skipped && customWordInput.trim()) {
          await submitCustomWord(roomCode, customWordInput.trim());
      }
      setRemoteInputSubmitted(true);
      setCustomWordInput('');
  };

  const finalizeRemotePotGame = async () => {
      if (!roomData) return;
      
      const pool = roomData.custom_words || [];
      if (pool.length === 0) {
          alert("No words submitted! Defaulting to Animals.");
          setSelectedCategories(['animals']);
          await updateRoomState(roomCode, { game_state: 'LOBBY' }); // Reset to lobby to pick new cat
          return;
      }
      
      const imposters = roomData.settings?.imposterCount || 1;
      const initializedPlayers = assignRoles(roomData.players, imposters);
      const { word, categoryName } = getRandomWord(['custom'], [], [], pool);
      const newStartingIndex = ((roomData.starting_player_index || 0) + 1) % roomData.players.length;

      await updateRoomState(roomCode, {
          players: initializedPlayers,
          current_word: word,
          current_category: categoryName,
          game_state: 'PLAYING',
          votes: {},
          started_at: new Date().toISOString(),
          starting_player_index: newStartingIndex
      });
  }

  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsRevealing(false);
    } else {
      setGameState(GameState.PLAYING);
    }
  };

  const handleSkipWord = () => {
    startLocalGame();
  };
  
  const cancelInvite = () => {
    setIsInviteFlow(false);
    setRoomCode('');
  };

  // --- Render Views ---

  if (gameState === GameState.MENU) {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden">
        <Background />
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
        <Header />
        
        <div className="flex-1 flex flex-col justify-center px-6 gap-8 z-10">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-white tracking-tight drop-shadow-2xl">
              Who is the<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Imposter?</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium">Deception. Deduction. Fun.</p>
          </div>

          <div className="space-y-4 mt-8">
            <Button fullWidth onClick={() => setGameState(GameState.SETUP)}>
              <div className="flex items-center justify-center gap-3">
                <Users className="text-slate-900" size={24} /> 
                <span className="text-lg">Local Play</span>
              </div>
            </Button>
            <Button fullWidth variant="glass" onClick={() => setGameState(GameState.REMOTE_MENU)}>
              <div className="flex items-center justify-center gap-3">
                <Wifi className="text-emerald-400" size={24} /> 
                <span className="text-lg">Online Play</span>
              </div>
            </Button>
            
            <button 
                onClick={() => setShowHowToPlay(true)}
                className="w-full py-4 text-slate-400 font-semibold hover:text-white transition-colors flex items-center justify-center gap-2"
            >
                <HelpCircle size={18} /> How to play
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Setup (Local) ---
  if (gameState === GameState.SETUP) {
    const allRegularCategories = CATEGORIES.filter(c => !c.isCustom).map(c => c.id);
    const isAllSelected = allRegularCategories.every(id => selectedCategories.includes(id));

    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
        <Background />
        <div className="p-6 flex items-center gap-3 z-20">
          <button onClick={() => setGameState(GameState.MENU)} className="p-2 -ml-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"><ArrowLeft /></button>
          <h2 className="text-xl font-bold text-white">New Game</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar space-y-8 z-10">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Players</h3>
              <button onClick={addPlayer} className="text-white text-xs font-bold bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                <UserPlus size={14} /> ADD
              </button>
            </div>
            <div>
              {players.map((p, i) => (
                <PlayerInput key={p.id} name={p.name} onChange={(val) => updatePlayerName(i, val)} onRemove={() => removePlayer(i)} />
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Timer</h3>
                <span className="text-white text-sm font-bold">{timerDuration === 0 ? "Off" : `${timerDuration/60} min`}</span>
            </div>
            <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                {[0, 60, 120, 180].map(t => (
                    <button 
                        key={t}
                        onClick={() => setTimerDuration(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${timerDuration === t ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t === 0 ? 'Off' : `${t/60}m`}
                    </button>
                ))}
            </div>
          </div>

          {/* Imposter Count Setting (Visible only if players >= 7) */}
          {players.length >= 7 && (
              <div className="glass-panel p-6 rounded-3xl space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Imposters</h3>
                    <span className="text-white text-sm font-bold">{localImposterCount}</span>
                </div>
                <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                    {[1, 2].map(count => (
                        <button 
                            key={count}
                            onClick={() => setLocalImposterCount(count)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${localImposterCount === count ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {count} Imposter{count > 1 ? 's' : ''}
                        </button>
                    ))}
                </div>
              </div>
          )}

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Difficulty</h3>
            <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
              {Object.values(Difficulty).map(diff => (
                <button
                  key={diff}
                  onClick={() => toggleDifficulty(diff)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    selectedDifficulties.includes(diff) 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pb-8">
             <ExpandableCategorySection 
                selectedIds={selectedCategories} 
                onToggle={toggleCategory} 
                onSelectAll={toggleAllCategories} 
                isAllSelected={isAllSelected}
             />
          </div>
        </div>

        <div className="p-6 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20 bg-gradient-to-t from-slate-950 to-transparent pt-12">
          <Button fullWidth onClick={startLocalGame} className="shadow-emerald-500/20">
            Start Game <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    );
  }

  // --- LOCAL INPUT PHASE (Pot Mode) ---
  if (gameState === GameState.INPUT) {
      const currentPlayer = players[currentPlayerIndex];
      return (
        <div className="min-h-screen flex flex-col justify-center items-center max-w-md mx-auto p-6 text-center relative">
            <Background />
            <div className="space-y-8 animate-fadeIn z-10 w-full glass-panel p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest">Pot Mode</h3>
                <div>
                  <p className="text-white/60 mb-2 text-sm">Pass device to:</p>
                  <h2 className="text-4xl font-bold text-white mb-6">{currentPlayer.name}</h2>
                </div>
                
                <input 
                    type="text"
                    value={customWordInput}
                    onChange={(e) => setCustomWordInput(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/20 rounded-xl px-4 py-4 text-white text-center text-xl font-bold mb-4 focus:border-emerald-500 outline-none"
                    placeholder="Enter a secret word..."
                />
                
                <div className="flex flex-col gap-3">
                    <Button fullWidth onClick={() => handleLocalCustomSubmit(customWordInput)}>
                        Submit Word
                    </Button>
                    <button 
                        onClick={() => handleLocalCustomSubmit(null)}
                        className="text-white/40 text-sm font-bold hover:text-white"
                    >
                        Skip (Add nothing)
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- REMOTE INPUT PHASE ---
  if (gameState === GameState.REMOTE_INPUT) {
      const isHost = roomData?.host_id === myPlayerId;
      const count = roomData?.custom_words?.length || 0;
      
      return (
        <div className="min-h-screen flex flex-col justify-center items-center max-w-md mx-auto p-6 text-center relative">
            <Background />
            <div className="space-y-6 animate-fadeIn z-10 w-full">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                    <Sparkles size={40} />
                </div>
                
                <h2 className="text-3xl font-bold text-white">Pot Mode</h2>
                
                {!remoteInputSubmitted ? (
                    <div className="glass-panel p-6 rounded-3xl space-y-4">
                        <p className="text-sm text-slate-300">Enter a word into the pot. It might be chosen as the secret word!</p>
                        <input 
                            type="text"
                            value={customWordInput}
                            onChange={(e) => setCustomWordInput(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/20 rounded-xl px-4 py-4 text-white text-center text-xl font-bold focus:border-emerald-500 outline-none"
                            placeholder="Type a word..."
                        />
                        <Button fullWidth onClick={() => handleRemoteInputSubmit(false)}>Submit</Button>
                        <button onClick={() => handleRemoteInputSubmit(true)} className="text-white/40 text-sm font-bold">Skip</button>
                    </div>
                ) : (
                    <div className="glass-panel p-6 rounded-3xl">
                        <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                        <p className="font-bold text-white">Waiting for others...</p>
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-emerald-400 text-2xl font-bold">{count}</p>
                    <p className="text-xs uppercase tracking-widest text-white/50">Words in Pot</p>
                </div>

                {isHost && (
                    <div className="pt-8">
                        <Button variant="danger" fullWidth onClick={finalizeRemotePotGame}>
                            Start Game with Pot
                        </Button>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- Remote Menu ---
  if (gameState === GameState.REMOTE_MENU) {
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative p-6">
        <Background />
        <div className="flex items-center gap-2 mb-8 mt-2 z-10">
          <button onClick={() => setGameState(GameState.MENU)} className="p-2 -ml-2 text-white/50 hover:text-white"><ArrowLeft /></button>
          <h2 className="text-xl font-bold">Online Play</h2>
        </div>

        <div className="space-y-6 z-10">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest block">Your Name</label>
            <input 
              type="text" 
              value={myPlayerName}
              onChange={(e) => setMyPlayerName(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 text-lg font-bold placeholder:font-normal"
              placeholder="Enter your name"
            />
          </div>

          {/* HIDE CREATE BUTTON IF INVITED */}
          {!isInviteFlow && (
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-yellow-400"/> Host a Game</h3>
                <Button fullWidth onClick={handleCreateRoom} disabled={isLoading} variant="primary">
                {isLoading ? 'Creating...' : 'Create Room'}
                </Button>
            </div>
          )}

          <div className={`glass-panel p-6 rounded-3xl ${isInviteFlow ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' : ''}`}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Users size={18} className={isInviteFlow ? "text-emerald-400" : "text-blue-400"}/> 
                {isInviteFlow ? 'Join Invited Room' : 'Join a Game'}
            </h3>
            
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                readOnly={isInviteFlow}
                className={`flex-1 bg-slate-900/50 border rounded-2xl px-4 py-4 text-white focus:outline-none uppercase tracking-widest font-mono text-center font-bold text-xl min-w-0 ${isInviteFlow ? 'border-emerald-500/30 text-emerald-400 cursor-not-allowed' : 'border-white/10 focus:border-emerald-500'}`}
                placeholder="CODE"
                maxLength={4}
              />
              <Button onClick={handleJoinRoom} disabled={isLoading} className="shrink-0">Join</Button>
            </div>
            
            {isInviteFlow && (
                 <div className="mt-4 text-center">
                    <button onClick={cancelInvite} className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto">
                        <XCircle size={14}/> Cancel Invite
                    </button>
                 </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Remote Lobby ---
  if (gameState === GameState.REMOTE_LOBBY) {
    const isHost = roomData?.host_id === myPlayerId;
    // Calculate if all selected for UI
    const allRegularCategories = CATEGORIES.filter(c => !c.isCustom).map(c => c.id);
    const isAllSelected = allRegularCategories.every(id => selectedCategories.includes(id));
    const playerCount = roomData?.players.length || 0;
    
    // Get current imposter setting from roomData, default to 1
    const currentImposterCount = roomData?.settings?.imposterCount || 1;

    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
        <Background />
        
        {/* Header Section (Fixed) */}
        <div className="p-6 text-center space-y-4 pt-12 z-10 shrink-0">
          <p className="text-white/60 uppercase tracking-widest text-xs font-bold">Room Code</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-7xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-widest drop-shadow-lg">{roomCode}</div>
          </div>
          <button 
            onClick={shareRoomLink} 
            className="inline-flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-white font-semibold"
          >
            {copySuccess ? <CheckCircle size={16} className="text-emerald-400"/> : <Share size={16}/>}
            {copySuccess ? "Copied Link!" : "Invite Friends"}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-6 z-10">
            
            {/* Players Section */}
            <div className="glass-panel rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                    <Users size={20} className="text-emerald-400"/> Players ({playerCount})
                    </h3>
                </div>
                <div className="space-y-2">
                    {roomData?.players.map((p) => (
                    <div key={p.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                        <span className={`font-bold ${p.id === myPlayerId ? "text-emerald-400" : "text-white"}`}>
                        {p.name} {p.id === myPlayerId && "(You)"}
                        </span>
                        {roomData.host_id === p.id && <span className="text-[10px] font-bold bg-indigo-500 px-2 py-1 rounded text-white tracking-wider">HOST</span>}
                    </div>
                    ))}
                </div>
            </div>

            {/* Host Controls: Settings, Difficulty, Categories */}
            {isHost ? (
                <div className="space-y-6 animate-fadeIn">
                     <div className="flex items-center gap-2 opacity-50 pl-2">
                        <Settings2 size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Game Settings</span>
                     </div>

                    {/* Timer UI */}
                    <div className="glass-panel p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Timer</h3>
                            <span className="text-white text-sm font-bold">{timerDuration === 0 ? "Off" : `${timerDuration/60} min`}</span>
                        </div>
                        <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                            {[0, 60, 120, 180].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setTimerDuration(t)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${timerDuration === t ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {t === 0 ? 'Off' : `${t/60}m`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Imposter Count Setting (Visible only if players >= 7) */}
                    {playerCount >= 7 && (
                        <div className="glass-panel p-6 rounded-3xl space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Imposters</h3>
                                <span className="text-white text-sm font-bold">{currentImposterCount}</span>
                            </div>
                            <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                                {[1, 2].map(count => (
                                    <button 
                                        key={count}
                                        onClick={() => updateRoomState(roomCode, { 
                                            settings: { 
                                                ...roomData?.settings, 
                                                timerDuration: timerDuration, // Preserve current local timer if any, or sync? ideally sync. 
                                                // Actually we should rely on roomData.settings but for simplicity we are updating full object.
                                                // Let's use the local state for timer since host drives it.
                                                imposterCount: count 
                                            } 
                                        })}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currentImposterCount === count ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {count} Imposter{count > 1 ? 's' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Difficulty UI */}
                    <div className="glass-panel p-6 rounded-3xl space-y-4">
                        <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Difficulty</h3>
                        <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                        {Object.values(Difficulty).map(diff => (
                            <button
                            key={diff}
                            onClick={() => toggleDifficulty(diff)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                selectedDifficulties.includes(diff) 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 shadow-lg' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                            >
                            {diff}
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Categories UI */}
                    <div className="space-y-4 pb-8">
                        <ExpandableCategorySection 
                            selectedIds={selectedCategories} 
                            onToggle={toggleCategory} 
                            onSelectAll={toggleAllCategories}
                            isAllSelected={isAllSelected}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                    <p className="text-white/50 text-sm">Waiting for host to configure game settings...</p>
                </div>
            )}
        </div>

        {/* Start Game Button Area */}
        <div className="p-6 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-12">
          {isHost ? (
            <div className="space-y-3">
                 <Button fullWidth onClick={startRemoteGame}>Start Game</Button>
                 <Button fullWidth variant="ghost" onClick={() => setGameState(GameState.MENU)}>Return to Main Menu</Button>
            </div>
          ) : (
             <div className="space-y-3">
                <div className="text-center text-white/50 animate-pulse bg-black/20 p-4 rounded-xl backdrop-blur-md">Waiting for host to start...</div>
                <Button fullWidth variant="ghost" onClick={() => setGameState(GameState.MENU)}>Exit Lobby</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Remote Playing ---
  if (gameState === GameState.REMOTE_PLAYING) {
    const isHost = roomData?.host_id === myPlayerId;
    const myRole = roomData?.players.find(p => p.id === myPlayerId);
    const hasVoted = roomData?.votes && roomData.votes[myPlayerId];
    const totalVotes = Object.keys(roomData?.votes || {}).length;
    const totalPlayers = roomData?.players.length || 0;
    const duration = roomData?.settings?.timerDuration || 0;
    const startingPlayer = roomData?.players[roomData.starting_player_index || 0];

    // Find Team Mates (for 2 imposters)
    const otherImposters = roomData?.players.filter(p => p.isImposter && p.id !== myPlayerId) || [];

    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto p-6 text-center justify-center relative">
         <Background />
         {showVoteModal && roomData && (
            <VoteModal 
                players={roomData.players} 
                myId={myPlayerId} 
                onVote={handleVote} 
                onClose={() => setShowVoteModal(false)}
            />
         )}

         <div className="mb-8 z-10 flex flex-col items-center gap-2">
            <span className="bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {/* HIDDEN CATEGORY FROM IMPOSTER */}
              Category: {myRole?.isImposter ? '???' : roomData?.current_category}
            </span>
         </div>
         
         {duration > 0 && <TimerDisplay timeLeft={timeLeft} total={duration} />}

         <div className="z-10 w-full mb-8">
            {myRole?.isImposter ? (
                <div className="p-10 bg-gradient-to-br from-rose-600 to-red-700 border-2 border-rose-400 rounded-3xl shadow-2xl shadow-rose-900/50 animate-fadeIn">
                <h2 className="text-4xl font-bold text-white mb-2">YOU ARE THE IMPOSTER</h2>
                <p className="text-rose-100 font-medium">Fake it 'til you make it.</p>
                {otherImposters.length > 0 && (
                    <div className="mt-4 p-2 bg-black/20 rounded-lg">
                        <p className="text-xs uppercase tracking-widest text-white/70">Your Partner</p>
                        <p className="font-bold">{otherImposters.map(p => p.name).join(', ')}</p>
                    </div>
                )}
                </div>
            ) : (
                <div className="p-10 bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400 rounded-3xl shadow-2xl shadow-emerald-900/50 animate-fadeIn">
                <p className="text-emerald-100 font-bold uppercase tracking-widest mb-2 text-xs">The Secret Word Is</p>
                <h2 className="text-4xl font-bold text-white">{roomData?.current_word}</h2>
                </div>
            )}
         </div>

         {/* Starting Player Badge */}
         {startingPlayer && (
             <div className="z-10 bg-indigo-600/80 px-6 py-3 rounded-full mb-8 border border-white/20 animate-float">
                 <p className="text-xs uppercase tracking-widest text-indigo-200">Starting Player</p>
                 <p className="text-xl font-bold text-white">{startingPlayer.name}</p>
             </div>
         )}
         
         <div className="grid grid-cols-2 gap-3 mb-8">
             <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-center gap-2">
                <Users size={16} className="text-blue-400"/>
                <span className="text-sm font-bold">{totalPlayers} Players</span>
             </div>
             <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-center gap-2">
                <Gavel size={16} className="text-purple-400"/>
                <span className="text-sm font-bold">{totalVotes} Voted</span>
             </div>
         </div>

         <div className="space-y-4 z-10 w-full">
           {!hasVoted ? (
               <Button variant="secondary" fullWidth onClick={() => setShowVoteModal(true)} className="bg-purple-600 hover:bg-purple-500 border-purple-400/30">
                 <Gavel className="mr-2" size={18}/> Vote for Imposter
               </Button>
           ) : (
               <div className="p-3 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/30 text-sm font-bold">
                   Vote Submitted
               </div>
           )}

           {isHost && (
             <Button variant="danger" fullWidth onClick={() => updateRoomState(roomCode, { game_state: 'REVEAL' })}>
                End Round & Reveal
             </Button>
           )}
           {!isHost && (
             <div className="text-white/50 text-xs">
                Waiting for host to end the round...
             </div>
           )}
         </div>
      </div>
    );
  }

  // --- Shared Playing/Reveal Views (Local Playing / Reveal) ---
  
  if (gameState === GameState.PLAYING || gameState === GameState.PASS_N_PLAY) {
    if (gameState === GameState.PASS_N_PLAY) {
         
         const currentPlayer = players[currentPlayerIndex];
         const otherImposters = players.filter(p => p.isImposter && p.id !== currentPlayer.id);

         return (
          <div className="min-h-screen flex flex-col justify-center items-center max-w-md mx-auto p-6 text-center relative">
            <Background />
            {!isRevealing ? (
              <div className="space-y-8 animate-fadeIn z-10 w-full">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-4 border-white/20 shadow-2xl">
                  <span className="text-4xl">🤫</span>
                </div>
                <div>
                  <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">Pass the device to</p>
                  <h2 className="text-5xl font-bold text-white drop-shadow-lg">{currentPlayer.name}</h2>
                </div>
                <div className="pt-8">
                  <Button onClick={() => setIsRevealing(true)} fullWidth variant="glass" className="h-16 text-lg">
                    Tap to Reveal Role
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn w-full z-10">
                 <div className="space-y-4">
                   <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/70 text-sm font-bold border border-white/10">
                     {/* HIDDEN CATEGORY FROM IMPOSTER */}
                     Category: <span className="text-white">{currentPlayer.isImposter ? '???' : currentCategoryName}</span>
                   </div>
                   
                   {currentPlayer.isImposter ? (
                      <div className="p-8 bg-gradient-to-br from-rose-600 to-red-700 border-2 border-rose-400 rounded-3xl shadow-2xl shadow-rose-900/50">
                        <h2 className="text-3xl font-bold text-white mb-2">YOU ARE THE IMPOSTER</h2>
                        <p className="text-rose-100 font-medium">Blend in. Don't let them know.</p>
                        {otherImposters.length > 0 && (
                             <div className="mt-4 p-2 bg-black/20 rounded-lg">
                                <p className="text-xs uppercase tracking-widest text-white/70">Your Partner</p>
                                <p className="font-bold">{otherImposters.map(p => p.name).join(', ')}</p>
                            </div>
                        )}
                      </div>
                   ) : (
                      <div className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400 rounded-3xl shadow-2xl shadow-emerald-900/50">
                        <p className="text-emerald-100 font-bold uppercase tracking-widest mb-2 text-xs">The Secret Word Is</p>
                        <h2 className="text-4xl font-bold text-white">{currentWord}</h2>
                      </div>
                   )}
                 </div>
                 <div className="space-y-3 pt-4">
                   <Button fullWidth onClick={handleNextPlayer}>
                     {currentPlayerIndex < players.length - 1 ? 'Pass to Next Player' : "Let's Play!"}
                   </Button>
                   {!currentPlayer.isImposter && (
                     <button 
                      onClick={handleSkipWord}
                      className="flex items-center justify-center gap-2 w-full py-4 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
                     >
                       <SkipForward size={16} /> I don't know this word
                     </button>
                   )}
                 </div>
              </div>
            )}
          </div>
        );
    }

    // Local PLAYING state
    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
         <Background />
         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 z-10">
            {timerDuration > 0 && <TimerDisplay timeLeft={timeLeft} total={timerDuration} />}
         
            <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center relative shadow-2xl backdrop-blur-sm border border-white/10">
               <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping"></div>
               <span className="text-6xl">🗣️</span>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Discuss!</h2>
              <p className="text-slate-300 text-lg">Ask questions. Find the imposter.</p>
            </div>

            {/* Starting Player Badge */}
            <div className="bg-indigo-600/80 px-6 py-3 rounded-full border border-white/20 animate-float">
                 <p className="text-xs uppercase tracking-widest text-indigo-200">Starting Player</p>
                 <p className="text-xl font-bold text-white">{players[startingPlayerIndex].name}</p>
            </div>

            <Button variant="danger" fullWidth onClick={() => setGameState(GameState.REVEAL)}>
              Reveal Imposter
            </Button>
         </div>
      </div>
    );
  }

  if (gameState === GameState.REVEAL || gameState === GameState.REMOTE_REVEAL) {
    // Logic handles both local and remote data sources
    const isRemote = gameState === GameState.REMOTE_REVEAL;
    const currentPlayers = isRemote ? roomData?.players || [] : players;
    const word = isRemote ? roomData?.current_word : currentWord;
    const imposters = currentPlayers.filter(p => p.isImposter);
    const isHost = isRemote ? roomData?.host_id === myPlayerId : true; 

    // Calculate votes if remote
    let mostVotedPlayer: Player | null = null;
    let voteCount = 0;
    if (isRemote && roomData?.votes) {
        const counts: Record<string, number> = {};
        Object.values(roomData.votes).forEach(id => counts[id] = (counts[id] || 0) + 1);
        const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
        if (sorted.length > 0) {
            mostVotedPlayer = currentPlayers.find(p => p.id === sorted[0][0]) || null;
            voteCount = sorted[0][1];
        }
    }

    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
         <Background />
         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 z-10">
            {isRemote && mostVotedPlayer && (
                 <div className="w-full bg-purple-500/20 border border-purple-500/30 p-4 rounded-2xl mb-4 animate-fadeIn">
                     <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">Most Voted ({voteCount} votes)</p>
                     <p className="text-xl font-bold text-white">{mostVotedPlayer.name}</p>
                     <p className="text-sm mt-1">{mostVotedPlayer.isImposter ? "✅ They were the Imposter!" : "❌ They were innocent!"}</p>
                 </div>
            )}
         
            <div className="space-y-6 w-full">
               <div className="space-y-2">
                 <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold">The Imposter{imposters.length > 1 ? 's were' : ' was'}</p>
                 <div className="text-4xl font-bold text-white animate-bounce drop-shadow-2xl">
                    {imposters.map(p => p.name).join(' & ')}
                 </div>
               </div>
               
               <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md w-full">
                 <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">The word was</p>
                 <p className="text-3xl font-bold text-emerald-400">{word}</p>
               </div>
            </div>

            <div className="w-full space-y-3 pt-8">
               {isHost ? (
                   <Button fullWidth onClick={() => isRemote ? updateRoomState(roomCode, { game_state: 'LOBBY', votes: {}, settings: { timerDuration: 0 }, started_at: null, custom_words: [] }) : startLocalGame()} className="bg-blue-600 hover:bg-blue-500">
                      <RotateCcw className="mr-2" /> Play Again
                   </Button>
               ) : (
                  <p className="text-white/50 animate-pulse">Waiting for host...</p>
               )}
               
               <Button fullWidth variant="ghost" onClick={() => setGameState(GameState.MENU)}>
                  Exit to Menu
               </Button>
            </div>
         </div>
      </div>
    );
  }

  return null;
}