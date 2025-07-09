export default function ExploreLayout({ children }: { children: React.ReactNode}) {

    return (
        <div className="h-[calc(100vh-73px)] flex items-stretch">
            <div className="w-80 max-w-80 bg-slate text-mist p-6">
                This is the application sidebar
            </div>
            <div className="grow h-full">
                {children}
            </div>
        </div>
    )

}