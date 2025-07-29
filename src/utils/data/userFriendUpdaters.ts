// src/utils/data/userFriendUpdaters.ts
// This file contains functions to update user friend data in a database.

import { supabase } from "../auth/supabaseClient";

interface SendFriendRequestProps {
    requesterId: string;
    addresseeId: string;
}

export async function sendFriendRequest({ 
    requesterId, 
    addresseeId 
}: SendFriendRequestProps) {
  const { data, error } = await supabase
    .from('user_friends')
    .insert([
      {
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: 'pending',
      },
    ])
    .select()
    .single();

  return { data, error };
}

interface AcceptFriendRequestProps {
    requesterId: string;
    addresseeId: string;
}

export async function acceptFriendRequest({ 
    requesterId, 
    addresseeId 
}: AcceptFriendRequestProps) {
    return await supabase
        .from('user_friends')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('requester_id', requesterId)
        .eq('addressee_id', addresseeId);
}

interface DeclineFriendRequestProps {
    requesterId: string;
    addresseeId: string;
}

export async function declineFriendRequest({ 
    requesterId, 
    addresseeId 
}: DeclineFriendRequestProps) {
    return await supabase
        .from('user_friends')
        .delete()
        .eq('requester_id', requesterId)
        .eq('addressee_id', addresseeId);
}