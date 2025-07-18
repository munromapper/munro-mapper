'use client';
import { SmallArrow } from '@/SvgIcons';
import Link from 'next/link';

type BackButtonProps = {
    link: string;
    text: string;
};

export default function BackButton({ link, text }: BackButtonProps) {
    return (
        <Link href={link}>
            <div className="flex items-center gap-2 cursor-pointer hover:translate-x-1 transition-transform duration-200 group">
                <div className="h-5 w-5 rounded-full bg-pebble group-hover:bg-apple p-1 flex items-center justify-center transition-colors duration-200">
                    <SmallArrow />
                </div>
                <span className="text-l">{text}</span>
            </div>
        </Link>
    );
}