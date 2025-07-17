// src/app/explore/components/ExploreMenu
import Link from 'next/link';

const menuItems = [
  { label: 'Map View', href: '/explore/map' },
  { label: 'List View', href: '/explore/list' },
  { label: 'Your Statistics', href: '/explore/statistics' },
];

export function ExploreMenu() {
    return(
        <aside className="w-80 p-4 bg-slate text-mist h-full" aria-label="Explore Sidebar">
            <ul className="space-y-2">
                {menuItems.map((item) => (
                <li key={item.href}>
                    <Link
                    href={item.href}
                    className="block px-3 py-2 rounded hover:bg-mist hover:text-slate transition"
                    >
                    {item.label}
                    </Link>
                </li>
                ))}
            </ul>
        </aside>
    )
}