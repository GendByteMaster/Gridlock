import React from 'react';

// Basic Units
import GuardianSvg from '../../assets/icons/guardian.svg';
import ScoutSvg from '../../assets/icons/scout.svg';
import StrikerSvg from '../../assets/icons/striker.svg';
import ArcanistSvg from '../../assets/icons/arcanist.svg';
import VanguardSvg from '../../assets/icons/vanguard.svg';
import SentinelBowSvg from '../../assets/icons/sentinel_bow.svg';
import MechanistSvg from '../../assets/icons/mechanist.svg';
import MonkSvg from '../../assets/icons/monk.svg';
import FrostAdeptSvg from '../../assets/icons/frost_adept.svg';
import WarImpSvg from '../../assets/icons/war_imp.svg';

// Unique Units
import ChronoKnightSvg from '../../assets/icons/chrono_knight.svg';
import StormTitanSvg from '../../assets/icons/storm_titan.svg';
import ShadowDancerSvg from '../../assets/icons/shadow_dancer.svg';
import SolarPriestSvg from '../../assets/icons/solar_priest.svg';
import VoidWalkerSvg from '../../assets/icons/void_walker.svg';
import IronColossusSvg from '../../assets/icons/iron_colossus.svg';
import ArcaneArcherSvg from '../../assets/icons/arcane_archer.svg';
import BoneReaperSvg from '../../assets/icons/bone_reaper.svg';
import EmberWitchSvg from '../../assets/icons/ember_witch.svg';
import AstralSentinelSvg from '../../assets/icons/astral_sentinel.svg';

interface IconProps {
    size?: number;
    className?: string;
    color?: string; // Kept for compatibility, but ignored for now as icons are pre-colored
}

const IconImg: React.FC<{ src: string } & IconProps> = ({ src, size = 24, className = '' }) => (
    <img
        src={src}
        alt="Unit Icon"
        width={size}
        height={size}
        className={className}
        style={{ display: 'block' }}
    />
);

// Basic Units
export const GuardianIcon: React.FC<IconProps> = (props) => <IconImg src={GuardianSvg} {...props} />;
export const ScoutIcon: React.FC<IconProps> = (props) => <IconImg src={ScoutSvg} {...props} />;
export const StrikerIcon: React.FC<IconProps> = (props) => <IconImg src={StrikerSvg} {...props} />;
export const ArcanistIcon: React.FC<IconProps> = (props) => <IconImg src={ArcanistSvg} {...props} />;
export const VanguardIcon: React.FC<IconProps> = (props) => <IconImg src={VanguardSvg} {...props} />;
export const SentinelIcon: React.FC<IconProps> = (props) => <IconImg src={SentinelBowSvg} {...props} />;
export const MechanistIcon: React.FC<IconProps> = (props) => <IconImg src={MechanistSvg} {...props} />;
export const MonkIcon: React.FC<IconProps> = (props) => <IconImg src={MonkSvg} {...props} />;
export const FrostAdeptIcon: React.FC<IconProps> = (props) => <IconImg src={FrostAdeptSvg} {...props} />;
export const WarImpIcon: React.FC<IconProps> = (props) => <IconImg src={WarImpSvg} {...props} />;

// Unique Units
export const ChronoKnightIcon: React.FC<IconProps> = (props) => <IconImg src={ChronoKnightSvg} {...props} />;
export const StormTitanIcon: React.FC<IconProps> = (props) => <IconImg src={StormTitanSvg} {...props} />;
export const ShadowDancerIcon: React.FC<IconProps> = (props) => <IconImg src={ShadowDancerSvg} {...props} />;
export const SolarPriestIcon: React.FC<IconProps> = (props) => <IconImg src={SolarPriestSvg} {...props} />;
export const VoidWalkerIcon: React.FC<IconProps> = (props) => <IconImg src={VoidWalkerSvg} {...props} />;
export const IronColossusIcon: React.FC<IconProps> = (props) => <IconImg src={IronColossusSvg} {...props} />;
export const ArcaneArcherIcon: React.FC<IconProps> = (props) => <IconImg src={ArcaneArcherSvg} {...props} />;
export const BoneReaperIcon: React.FC<IconProps> = (props) => <IconImg src={BoneReaperSvg} {...props} />;
export const EmberWitchIcon: React.FC<IconProps> = (props) => <IconImg src={EmberWitchSvg} {...props} />;
export const AstralSentinelIcon: React.FC<IconProps> = (props) => <IconImg src={AstralSentinelSvg} {...props} />;
