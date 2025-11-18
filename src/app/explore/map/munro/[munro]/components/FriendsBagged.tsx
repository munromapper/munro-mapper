import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import UserProfilePicture from '@/components/global/UserProfilePicture';
import { fetchUserProfile } from '@/utils/data/clientDataFetchers';
import ContextualMenu from '@/components/global/ContextualMenu';

interface FriendsBaggedProps {
  munroId: number;
  className?: string;
}

interface FriendWithProfile {
  id: string;
  firstName: string;
  lastName: string;
}

interface MessageParts {
  names: React.ReactNode;
  action: string;
  hasMultipleFriends: boolean;
}

export default function FriendsBagged({ munroId, className = '' }: FriendsBaggedProps) {
  const { friends, userProfile } = useAuthContext();
  const { friendsBaggedMunros } = useBaggedMunroContext();
  const [friendsWhoHaveBagged, setFriendsWhoHaveBagged] = useState<FriendWithProfile[]>([]);
  const [isNamesMenuOpen, setIsNamesMenuOpen] = useState(false);
  const otherFriendsRef = useRef<HTMLSpanElement>(null);
  
  // Rest of component remains unchanged
  useEffect(() => {
    async function loadFriendProfiles() {
      if (!friends || !friendsBaggedMunros || !userProfile) return;
      
      // Find friend IDs who bagged this munro
      const friendUserIds = friends
        .filter(friend => {
          if (friend?.requestStatus !== 'accepted') return false;
          
          const friendUserId = friend.requesterId === userProfile.id 
            ? friend.addresseeId 
            : friend.requesterId;
            
          return friendsBaggedMunros[friendUserId]?.includes(munroId);
        })
        .map(friend => friend?.requesterId === userProfile.id 
          ? friend?.addresseeId 
          : friend?.requesterId);
      
      // Fetch profiles
      const friendProfiles = await Promise.all(
        friendUserIds
          .filter((id): id is string => typeof id === 'string' && !!id)
          .map(id => fetchUserProfile(id))
      );
      
      const friendsWithProfiles = friendProfiles
        .filter(profile => profile !== null)
        .map(profile => ({
          id: profile!.id as string,
          firstName: profile!.firstName,
          lastName: profile!.lastName
        }));
      
      setFriendsWhoHaveBagged(friendsWithProfiles);
    }
    
    loadFriendProfiles();
  }, [friends, friendsBaggedMunros, munroId, userProfile]);

  // Don't render anything if there's no logged-in user
  if (!userProfile) {
    return null;
  }
  
  const getMessageParts = (): MessageParts => {
    const count = friendsWhoHaveBagged.length;
    
    if (count === 0) {
      return {
        names: "None of your friends",
        action: "have bagged this hill",
        hasMultipleFriends: false
      };
    }
    
    if (count === 1) {
      const friend = friendsWhoHaveBagged[0];
      return {
        names: `${friend.firstName} ${friend.lastName}`,
        action: "has bagged this hill",
        hasMultipleFriends: false
      };
    }
    
    // For 2+ friends
    const primaryFriend = friendsWhoHaveBagged[0];
    const othersCount = count - 1;
    return {
      names: (
        <>
          {primaryFriend.firstName} and{' '}
          <span 
            ref={otherFriendsRef}
            className="border-b border-dotted border-slate cursor-pointer"
            onMouseEnter={() => setIsNamesMenuOpen(true)}
            onMouseLeave={() => setIsNamesMenuOpen(false)}
          >
            {othersCount} other {othersCount === 1 ? 'friend' : 'friends'}
          </span>
        </>
      ),
      action: "have bagged this hill",
      hasMultipleFriends: true
    };
  };
  
  // Render profile photos - populate from right to left
  const renderProfilePhotos = () => {
    const friendsToShowRaw = friendsWhoHaveBagged.slice(0, 3);

    // If no friends, show a single circle with default profile picture
    if (friendsToShowRaw.length === 0) {
      return (
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-sage border-2 border-mist flex items-center justify-center">
            <img
              src="/images/default-profile-picture.png"
              alt="Default profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      );
    }

    // Move the primary friend (first in array) to the end
    const friendsToShow =
      friendsToShowRaw.length > 1
        ? [...friendsToShowRaw.slice(1), friendsToShowRaw[0]]
        : friendsToShowRaw;

    return (
      <div className="flex items-center">
        {friendsToShow.map((friend, index) => (
          <div
            key={friend.id}
            className={`w-12 h-12 rounded-full bg-sage border-2 border-mist flex items-center justify-center${index > 0 ? ' ml-[-1rem]' : ''}`}
            style={{ zIndex: index === friendsToShow.length - 1 ? 10 : index + 1 }} // Highest z-index for last item
          >
            <div className="w-full h-full relative">
              <UserProfilePicture userId={friend.id} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  const messageParts = getMessageParts();
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap mt-9">
        {renderProfilePhotos()}
        <div className="ml-2 flex flex-col relative">
          <p className="text-xl text-slate">{messageParts.names}</p>
          <p className="text-l text-moss">{messageParts.action}</p>
          
          {messageParts.hasMultipleFriends && (
            <div className="relative">
              <ContextualMenu 
                isOpen={isNamesMenuOpen} 
                onClose={() => setIsNamesMenuOpen(false)}
              >
                <div>
                  <ul className="space-y-1">
                    {friendsWhoHaveBagged.map(friend => (
                      <li key={friend.id} className="text-xl">
                        {friend.firstName} {friend.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </ContextualMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}