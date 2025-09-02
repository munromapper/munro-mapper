// src/app/explore/map/components/SidebarListPage.tsx
// This file contains the main layout for the sidebar list page

import SidebarHeader from "./SidebarHeader";
import SidebarList from "./SidebarList";
import { useMapState } from "@/contexts/MapStateContext";

export default function SidebarListPage() {
    const { isSidebarExpanded } = useMapState();

    return (
        <div className="rounded-xl overflow-auto no-scrollbar h-auto max-h-full shadow-standard">
            <SidebarHeader />
            <SidebarList />
        </div>
    );
}