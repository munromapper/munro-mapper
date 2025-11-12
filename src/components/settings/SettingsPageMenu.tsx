// src/coomponents/settings/SettingsPageMenu.tsx
// SettingsPageMenu component for displaying the settings page sidebar menu

import IconLink from "../global/IconLink";
import { ProfileIcon, LockIcon, PreferencesIcon, PaymentIcon  } from "@/components/global/SvgComponents";

interface SettingsPageMenuProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function SettingsPageMenu({ 
    activeTab, setActiveTab 
}: SettingsPageMenuProps) {
    return (
        <div className="bg-pebble text-slate min-w-65 py-12 px-9">
            <h2 className="font-heading-font-family text-4xl mx-4">Settings</h2>
            <div className="flex flex-col gap-1 mt-6">
                <IconLink
                    icon={<ProfileIcon />}
                    label="Profile"
                    onClick={() => setActiveTab('profile')}
                    className={`${activeTab === 'profile' ? 'bg-sage/50' : ''} border-transparent hover:bg-sage/50`}
                />
                <IconLink
                    icon={<LockIcon />}
                    label="Security"
                    onClick={() => setActiveTab('security')}
                    className={`${activeTab === 'security' ? 'bg-sage/50' : ''} border-transparent hover:bg-sage/50`}
                />
                <IconLink
                    icon={<PreferencesIcon />}
                    label="Preferences"
                    onClick={() => setActiveTab('preferences')}
                    className={`${activeTab === 'preferences' ? 'bg-sage/50' : ''} border-transparent hover:bg-sage/50`}
                />
                <IconLink
                    icon={<PaymentIcon />}
                    label="Subscription"
                    onClick={() => setActiveTab('subscription')}
                    className={`${activeTab === 'subscription' ? 'bg-sage/50' : ''} border-transparent hover:bg-sage/50`}
                />
            </div>
        </div>
    )
}