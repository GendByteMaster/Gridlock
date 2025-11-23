import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sword, Move, Shield } from 'lucide-react';
import { clsx } from 'clsx';

const SkillNode = memo(({ data }: NodeProps) => {
    const getIcon = (category: string) => {
        switch (category) {
            case 'Offense': return <Sword size={20} />;
            case 'Mobility': return <Move size={20} />;
            case 'Control': return <Shield size={20} />;
            default: return <Sword size={20} />;
        }
    };

    return (
        <div className="relative group">
            {/* Glow Effect */}
            <div className={clsx(
                "absolute -inset-0.5 rounded-2xl blur opacity-30 transition duration-500 group-hover:opacity-75",
                data.category === 'Offense' ? "bg-accent-red" :
                    data.category === 'Mobility' ? "bg-accent-blue" : "bg-accent-purple"
            )} />

            {/* Node Content */}
            <div className="relative flex flex-col items-center justify-center w-32 h-32 bg-system-gray1/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                <div className={clsx(
                    "p-3 rounded-xl mb-2 transition-colors duration-300",
                    data.category === 'Offense' ? "bg-accent-red/20 text-accent-red" :
                        data.category === 'Mobility' ? "bg-accent-blue/20 text-accent-blue" : "bg-accent-purple/20 text-accent-purple"
                )}>
                    {getIcon(data.category)}
                </div>

                <div className="text-center px-2">
                    <h3 className="text-sm font-bold text-white mb-0.5">{data.label}</h3>
                    <p className="text-[10px] text-system-gray4 leading-tight">{data.description}</p>
                </div>

                {/* Handles */}
                <Handle type="target" position={Position.Top} className="!bg-white/50 !w-3 !h-3 !-top-1.5" />
                <Handle type="source" position={Position.Bottom} className="!bg-white/50 !w-3 !h-3 !-bottom-1.5" />
            </div>
        </div>
    );
});

export default SkillNode;
