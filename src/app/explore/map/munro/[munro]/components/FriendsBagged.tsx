import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import UserProfilePicture from '@/components/global/UserProfilePicture';
import { fetchUserProfile } from '@/utils/data/clientDataFetchers';

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
  names: string;
  action: string;
}

export default function FriendsBagged({ munroId, className = '' }: FriendsBaggedProps) {
  const { friends, userProfile } = useAuthContext();
  const { friendsBaggedMunros } = useBaggedMunroContext();
  const [friendsWhoHaveBagged, setFriendsWhoHaveBagged] = useState<FriendWithProfile[]>([]);
  
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
        action: "have bagged this hill"
      };
    }
    
    if (count === 1) {
      const friend = friendsWhoHaveBagged[0];
      return {
        names: `${friend.firstName} ${friend.lastName}`,
        action: "has bagged this hill"
      };
    }
    
    // For 2+ friends
    const primaryFriend = friendsWhoHaveBagged[0];
    const othersCount = count - 1;
    return {
      names: `${primaryFriend.firstName} and ${othersCount} other ${othersCount === 1 ? 'friend' : 'friends'}`,
      action: "have bagged this hill"
    };
  };
  
    // Render profile photos - populate from right to left
    const renderProfilePhotos = () => {
        const totalFrames = 3;
        const displayArray = Array(totalFrames).fill(null);
        
        const friendsToShow = friendsWhoHaveBagged.slice(0, totalFrames);
        
        // Place the primary friend (mentioned in the message) at the rightmost position
        if (friendsToShow.length > 0) {
            displayArray[totalFrames - 1] = friendsToShow[0];
            
            // Place remaining friends from right to left
            for (let i = 1; i < friendsToShow.length; i++) {
            displayArray[totalFrames - 1 - i] = friendsToShow[i];
            }
        }
        
        return (
            <div className="flex items-center">
                {displayArray.map((friend, index) => (
                    <div 
                        key={friend?.id || `empty-${index}`}
                        className={`w-12 h-12 rounded-full bg-sage border-2 border-mist flex items-center justify-center ${index > 0 ? 'ml-[-1rem]' : ''}`}
                        style={{ zIndex: index }} // Higher z-index for items on the right
                    >
                        {friend && (
                            <div className="w-full h-full relative">
                                <UserProfilePicture userId={friend.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
  
  const { names, action } = getMessageParts();
  
  return (
    <div className={`mt-8 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {renderProfilePhotos()}
        <div className="ml-2 flex flex-col">
          <p className="text-xl text-slate">{names}</p>
          <p className="text-l text-moss">{action}</p>
        </div>
      </div>
    </div>
  );
}