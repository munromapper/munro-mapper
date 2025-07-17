// src/app/explore/layout.tsx
import { ExploreMenu } from './components/ExploreMenu'

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full">
            <ExploreMenu/>
            <div className="flex-1">
            {children}
            </div>
        </div>
    )
}