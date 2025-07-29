// src/components/friends/FriendsMenu.tsx
// This component defines the tab menu component for the friends modal

interface FriendsMenuProps {
    activeTab: 'friends' | 'requests' | 'addFriends';
    setActiveTab: (tab: 'friends' | 'requests' | 'addFriends') => void;
    setSearchQuery: (query: string) => void;
    pendingRequestsCount?: number;
}

export default function FriendsMenu({ 
    activeTab, 
    setActiveTab, 
    setSearchQuery,
    pendingRequestsCount = 0 
}: FriendsMenuProps) {

    console.log("pending requests:", pendingRequestsCount)

    return (
        <div className="flex gap-6">
            <button 
            className={`text-l cursor-pointer ${activeTab === 'friends' ? 'underline underline-offset-4' : ''}`}
            onClick={() => { setActiveTab('friends'); setSearchQuery(''); }}
            >
                Friends
            </button>
            <div className="flex items-center gap-2">
                <button 
                    className={`text-l cursor-pointer ${activeTab === 'requests' ? 'underline underline-offset-4' : ''}`}
                    onClick={() => { setActiveTab('requests'); setSearchQuery(''); }}
                >
                Requests
                </button>
                {pendingRequestsCount > 0 && (
                    <span className="flex justify-center items-center bg-apple text-slate text-xs rounded h-4 w-4 pr-0.5">
                        {pendingRequestsCount}
                    </span>
                )}
            </div>
            <button 
                className={`text-l cursor-pointer ${activeTab === 'addFriends' ? 'underline underline-offset-4' : ''}`}
                onClick={() => { setActiveTab('addFriends'); setSearchQuery(''); }}
            >
                Add Friend +
            </button>
        </div>
    )
}