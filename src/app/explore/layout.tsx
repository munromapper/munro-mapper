export default function ExploreLayout({ children }: { children: React.ReactNode}) {

    return (
        <div className="h-[calc(100vh-73px)] flex items-stretch"> {/* Main full height page element (100vh minus header height) */}
            <div className="w-80 max-w-80 bg-slate text-mist p-6"> {/* Sidebar Element */}
                This is the application sidebar {/* Sidebar Element Components go here */}
            </div>
            <div className="grow h-full"> {/* Main Page Content Wrapper */}
                {children} {/* Main page content goes here */}
            </div>
        </div>
    )

}