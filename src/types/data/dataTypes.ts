// src/types/data/dataTypes.ts
// This file defines the data types used in the application

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    isEmailOptIn: boolean;
    profilePhotoUrl: string | null;
    preferences: {
        lengthUnit: string;
        elevationUnit: string;
    };
    discriminator: string;
    isPremium: string;
} | null;

export type UserSubscription = {
    id: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    plan: string;
    status: string;
    currentPeriodEnd: string;
    createdAt: string;
    updatedAt: string;
    canceledAt: string | null;
    cancelAtPeriodEnd: boolean;
} | null;

export type Friend = {
    id: string;
    requesterId: string;
    addresseeId: string;
    requestStatus: string;
    createdAt: string;
    respondedAt: string | null;
} | null;

export type Munro = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    height: number;
    region: string;
    nameMeaning: string;
    description: string;
    gridRef: string;
    slug: string;
    harveyMM: string;
    harveyMMUrl: string;
    harveySW: string;
    harveySWUrl: string;
    osExplorer: string;
    osExplorerUrl: string;
    osLandranger: string;
    osLandrangerUrl: string;
}

export type Route = {
    id: number;
    name: string;
    gpxFile: string;
    description: string;
    length: number;
    ascent: number;
    difficulty: string;
    startLocation: string;
    startLongitude: number;
    startLatitude: number;
    style: string;
    estimatedTime: number;
    garminLink: string;
}

export type RouteMunroLink = {
    id: number;
    routeId: number;
    munroId: number;
}

export type GpxRoute = {
  id: number;
  coordinates: [number, number][];
  name: string;
  rawGpx: string;
};

export type Filters = {
    routeStyle: string;
    difficulty: string;
    length: [number, number];
    ascent: [number, number];
    friends: {
        selectedPeople: string[];
        baggedMode: 'bagged' | 'incomplete';
    };
}

export type FilterGroupProps = {
    id: string;
    label: string;
    currentValue?: string;
    isOpen: boolean;
    isActive: boolean;
    onToggle: () => void;
    onReset: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

export type FilterHeaderProps = {
    label: string;
    currentValue?: string;
    isActive: boolean;
    isOpen: boolean;
    onClick: () => void;
    onReset: (e: React.MouseEvent) => void;
}

export type FilterFieldWrapperProps = {
    isOpen: boolean;
    children: React.ReactNode;
}

export type FilterCheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

export type RadioOption = {
    value: string;
    label: string;
}

export type FilterRadioGroupProps = {
    name: string;
    selectedValue: string;
    options: RadioOption[];
    onChange: (value: string) => void;
}

export type FilterSliderGroupProps = {
    value: [number, number];
    onChange: (value: [number, number]) => void;
    onAfterChange?: (value: [number, number]) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
}