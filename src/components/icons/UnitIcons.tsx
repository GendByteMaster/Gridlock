import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
    color?: string;
}

export const GuardianIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 22s-8-4-8-10V5l8-3" strokeOpacity="0.5" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

export const ScoutIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 22h6a2 2 0 0 0 2-2V7l-5-5-6 6v12a2 2 0 0 0 2 2z" />
        <path d="M14 10l4-4m0 0l-4-4m4 4H10" />
    </svg>
);

export const StrikerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />
        <path d="M4 20l16-16" strokeOpacity="0.5" strokeDasharray="4 4" />
    </svg>
);

export const ArcanistIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
    </svg>
);

export const VanguardIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h-6V4z" />
        <path d="M4 8h16v2a8 8 0 0 1-16 0V8z" />
        <path d="M12 10v10" />
        <path d="M9 20h6" />
    </svg>
);

export const SentinelIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10" />
        <path d="M2 12h20" />
        <path d="M18 12l-4-4" />
        <path d="M18 12l-4 4" />
    </svg>
);

export const MechanistIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

export const MonkIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2l-6 6-6-6" />
        <path d="M12 22V8" />
        <path d="M8 12h8" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

export const FrostAdeptIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12h20" />
        <path d="M12 2v20" />
        <path d="M20 20L4 4" />
        <path d="M4 20L20 4" />
    </svg>
);

export const WarImpIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M8 20v2h8v-2" />
        <path d="M12 19v-3" />
        <path d="M10 2l-2 4h8l-2-4" />
        <path d="M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6z" />
    </svg>
);

export const ChronoKnightIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        <path d="M12 12l4 4" />
    </svg>
);

export const StormTitanIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M13 2l-2 10h4l-2 10" />
    </svg>
);

export const ShadowDancerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 22l3-3 3 3" />
        <path d="M12 19v-6" />
        <path d="M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M15 11l3-3" />
        <path d="M9 11l-3-3" />
    </svg>
);

export const SolarPriestIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </svg>
);

export const VoidWalkerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        <path d="M12 2v6" />
    </svg>
);

export const IronColossusIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 4v16" />
        <path d="M16 4v16" />
        <path d="M4 12h16" />
    </svg>
);

export const ArcaneArcherIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 2l-11 11" />
        <path d="M22 2l-7 0" />
        <path d="M22 2l0 7" />
        <path d="M11 13a5 5 0 1 0-7.07 7.07" />
    </svg>
);

export const BoneReaperIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 4v16" />
        <path d="M4 4h16" />
        <path d="M4 4a8 8 0 0 0 8 8" />
    </svg>
);

export const EmberWitchIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c0 0-6 8-6 12a6 6 0 1 0 12 0c0-4-6-12-6-12z" />
        <path d="M12 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
);

export const AstralSentinelIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" />
        <circle cx="12" cy="12" r="10" strokeOpacity="0.5" />
    </svg>
);
