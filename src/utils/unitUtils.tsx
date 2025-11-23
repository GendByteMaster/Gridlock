import React from 'react';
import { UnitType } from '../types';
import {
    GuardianIcon, ScoutIcon, StrikerIcon, ArcanistIcon, VanguardIcon,
    SentinelIcon, MechanistIcon, MonkIcon, FrostAdeptIcon, WarImpIcon,
    ChronoKnightIcon, StormTitanIcon, ShadowDancerIcon, SolarPriestIcon, VoidWalkerIcon,
    IronColossusIcon, ArcaneArcherIcon, BoneReaperIcon, EmberWitchIcon, AstralSentinelIcon
} from '../components/icons/UnitIcons';
import { Shield } from 'lucide-react';

export const getUnitIcon = (type: UnitType, size: number = 24) => {
    switch (type) {
        // Basic Units
        case 'Guardian': return <GuardianIcon size={size} />;
        case 'Scout': return <ScoutIcon size={size} />;
        case 'Striker': return <StrikerIcon size={size} />;
        case 'Arcanist': return <ArcanistIcon size={size} />;
        case 'Vanguard': return <VanguardIcon size={size} />;
        case 'Sentinel': return <SentinelIcon size={size} />;
        case 'Mechanist': return <MechanistIcon size={size} />;
        case 'Monk': return <MonkIcon size={size} />;
        case 'FrostAdept': return <FrostAdeptIcon size={size} />;
        case 'WarImp': return <WarImpIcon size={size} />;

        // Unique Units
        case 'ChronoKnight': return <ChronoKnightIcon size={size} />;
        case 'StormTitan': return <StormTitanIcon size={size} />;
        case 'ShadowDancer': return <ShadowDancerIcon size={size} />;
        case 'SolarPriest': return <SolarPriestIcon size={size} />;
        case 'VoidWalker': return <VoidWalkerIcon size={size} />;
        case 'IronColossus': return <IronColossusIcon size={size} />;
        case 'ArcaneArcher': return <ArcaneArcherIcon size={size} />;
        case 'BoneReaper': return <BoneReaperIcon size={size} />;
        case 'EmberWitch': return <EmberWitchIcon size={size} />;
        case 'AstralSentinel': return <AstralSentinelIcon size={size} />;

        default: return <Shield size={size} />;
    }
};
