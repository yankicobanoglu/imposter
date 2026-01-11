import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Player, RoomData } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabaseConfig';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabaseInstance;
    } catch (error) {
      console.error("Failed to initialize Supabase:", error);
      return null;
    }
  }
  return null;
};

export const hasCredentials = () => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

export const createRoom = async (hostPlayer: Player): Promise<{ success: boolean; code?: string; error?: string }> => {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: "Database not configured. Check config." };

  // Generate a random 4-letter code
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

  const { error } = await supabase
    .from('rooms')
    .insert({
      room_code: roomCode,
      host_id: hostPlayer.id,
      players: [hostPlayer],
      game_state: 'LOBBY',
      current_word: '',
      current_category: ''
    });

  if (error) {
    console.error("Error creating room:", JSON.stringify(error, null, 2));
    return { success: false, error: error.message || "Unknown error creating room" };
  }
  
  return { success: true, code: roomCode };
};

export const joinRoom = async (roomCode: string, player: Player): Promise<{ success: boolean; msg?: string }> => {
  const supabase = getSupabase();
  if (!supabase) return { success: false, msg: "Database not configured. Check config." };

  // 1. Get current room
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('room_code', roomCode)
    .single();

  if (error || !room) {
    return { success: false, msg: "Room not found" };
  }

  // 2. Add player if not already in
  const currentPlayers = room.players as Player[];
  const exists = currentPlayers.some(p => p.id === player.id);
  
  if (!exists) {
    const updatedPlayers = [...currentPlayers, player];
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ players: updatedPlayers })
      .eq('room_code', roomCode);

    if (updateError) {
      return { success: false, msg: updateError.message || "Failed to join" };
    }
  }

  return { success: true };
};

export const subscribeToRoom = (roomCode: string, callback: (payload: RoomData) => void) => {
  const supabase = getSupabase();
  if (!supabase) return null;

  return supabase
    .channel(`room_${roomCode}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` }, 
      (payload) => {
        if (payload.new) {
          callback(payload.new as RoomData);
        }
      }
    )
    .subscribe();
};

export const updateRoomState = async (roomCode: string, updates: Partial<RoomData>) => {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('room_code', roomCode);

  if (error) {
    console.error("Error updating room:", error);
  }
};
