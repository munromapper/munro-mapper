// src/components/friends/FriendsMenu.tsx
// This component defines the tab menu component for the friends modal

interface FriendsMenuProps {
    activeTab: 'friends' | 'requests' | 'addFriends';
    setActiveTab: (tab: 'friends' | 'requests' | 'addFriends') => void;
}

export default function FriendsMenu({ 
    activeTab, 
    setActiveTab 
}: FriendsMenuProps) {
    return (
        <div className="flex gap-6">
            <button 
            className={`text-l cursor-pointer ${activeTab === 'friends' ? 'underline underline-offset-4' : ''}`}
            onClick={() => setActiveTab('friends')}
            >
                Friends
            </button>
            <button 
                className={`text-l cursor-pointer ${activeTab === 'requests' ? 'underline underline-offset-4' : ''}`}
                onClick={() => setActiveTab('requests')}
            >
                Requests
            </button>
            <button 
                className={`text-l cursor-pointer ${activeTab === 'addFriends' ? 'underline underline-offset-4' : ''}`}
                onClick={() => setActiveTab('addFriends')}
            >
                Add Friend +
            </button>
        </div>
    )
}