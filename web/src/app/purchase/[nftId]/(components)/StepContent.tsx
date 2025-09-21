interface StepContentProps {
    icon?: React.ReactNode;
    title: string;
    description?: React.ReactNode;
    txHash?: string | null;
    actions?: React.ReactNode;
    children?: React.ReactNode;
}

export default function StepContent({
    icon,
    title,
    description,
    txHash,
    actions,
    children,
}: StepContentProps) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            {icon}
            <div className="w-full text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

                {description && (
                    <div className="text-gray-600 mb-6">{description}</div>
                )}

                {children}

                {txHash && (
                    <p className="text-xs text-gray-500 break-all mx-auto mb-6">
                        Transaction hash: {txHash}
                    </p>
                )}

                {actions && <div className="space-x-4">{actions}</div>}
            </div>
        </div>
    );
}
