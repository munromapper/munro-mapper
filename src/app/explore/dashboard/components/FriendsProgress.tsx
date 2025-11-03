// src/app/explore/dashboard/components/FriendsProgress.tsx
// This file contains the friends' progress component for the dashboard page

'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { UserProfile } from '@/types/data/dataTypes';
import UserProfilePicture from '@/components/global/UserProfilePicture';
import { FriendsIcon } from '@/components/global/SvgComponents';
import { fetchUserProfile } from '@/utils/data/clientDataFetchers';

const TOTAL_MUNROS = 282;

type FriendDisplay = {
  id: string;
  name: string;
  profilePhotoUrl: string | null;
  baggedCount: number;
};

export default function FriendsProgress() {
  const { user, friends } = useAuthContext();
  const { friendsBaggedMunros } = useBaggedMunroContext();
  const [friendProfiles, setFriendProfiles] = useState<Record<string, UserProfile>>({});

  // Get accepted friends' user IDs
  const acceptedFriendIds = useMemo(() => {
    if (!friends || !user) return [];
    return friends
      .filter(f => f && f.requestStatus === 'accepted')
      .map(f => f?.requesterId === user.id ? f?.addresseeId : f?.requesterId)
      .filter(Boolean) as string[];
  }, [friends, user]);

  // Fetch profiles for each friend
  useEffect(() => {
    let isMounted = true;
    async function fetchProfiles() {
      const profiles: Record<string, UserProfile> = {};
      await Promise.all(
        acceptedFriendIds.map(async (id) => {
          const profile = await fetchUserProfile(id);
          if (isMounted && profile) profiles[id] = profile;
        })
      );
      if (isMounted) setFriendProfiles(profiles);
    }
    fetchProfiles();
    return () => { isMounted = false; };
  }, [acceptedFriendIds]);

  // Prepare display data
  const friendDisplays: FriendDisplay[] = useMemo(() => {
    return acceptedFriendIds.map(id => {
      const profile = friendProfiles[id];
      return {
        id,
        name: profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile?.firstName || id,
        profilePhotoUrl: profile?.profilePhotoUrl || null,
        baggedCount: friendsBaggedMunros[id]?.length || 0,
      };
    });
  }, [acceptedFriendIds, friendProfiles, friendsBaggedMunros]);

  return (
    <section className="rounded-xl p-9 border border-sage flex flex-col h-full bg-mist">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xxxl text-slate">Friends Progress</h2>
        <span className="h-9 w-9 p-2.5 rounded-md bg-pebble text-slate flex items-center justify-center">
          <FriendsIcon />
        </span>
      </div>
      {friendDisplays.length === 0 ? (
        <p className="text-slate">No friends to show yet.</p>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
          <ul className="flex flex-col gap-4">
            {friendDisplays.map(friend => (
              <li key={friend.id} className="flex items-center gap-4">
                <div className="h-10 w-10">
                  <UserProfilePicture userId={friend.id} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate">{friend.name}</span>
                    <span className="text-slate text-l">{friend.baggedCount} / {TOTAL_MUNROS}</span>
                  </div>
                  <div className="w-full h-2 bg-sage/25 rounded mt-2">
                    <div
                      className="h-2 rounded bg-apple transition-all"
                      style={{
                        width: `${Math.round((friend.baggedCount / TOTAL_MUNROS) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}