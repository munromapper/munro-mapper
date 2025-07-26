// src/components/settings/SettingsPage.tsx
// SettingsPage component for managing user settings

'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsPageMenu from './SettingsPageMenu';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import PreferencesSettings from './PreferencesSettings';
import SubscriptionSettings from './SubscriptionSettings';


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex h-195 corners-xl overflow-hidden">
        <SettingsPageMenu 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />
        <div className="p-12 bg-mist overflow-auto">
            <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <ProfileSettings />
                    </motion.div>
                )}
                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <SecuritySettings />
                    </motion.div>
                )}
                {activeTab === 'preferences' && (
                    <motion.div
                        key="preferences"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <PreferencesSettings />
                    </motion.div>
                )}
                {activeTab === 'subscription' && (
                    <motion.div
                        key="subscription"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <SubscriptionSettings />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}