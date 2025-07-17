// src/types.ts

export type Munro = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    height: number;
    region: string;
    nameMeaning: string;
    description: string;
    slug: string;
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
    startLink: string;
    style: string;
    estimatedTime: number;
}

export type RouteMunroLink = {
    id: number;
    routeId: number;
    munroId: number;
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

export type FilterFieldWrapperProps = {
    isOpen: boolean;
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

export type Filters = {
    routeStyle: string;
    difficulty: string;
    length: [number, number];
    ascent: [number, number];
}