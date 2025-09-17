import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import StepContent from '../StepContent';

interface ErrorStepProps {
    onRetry: () => void;
    onGoHome: () => void;
}

export default function ErrorStep({ onRetry, onGoHome }: ErrorStepProps) {
    return (
        <StepContent
            icon={<XCircle className="w-16 h-16 text-red-500" />}
            title="Error in Purchase"
            description="An error occurred while processing your purchase. Try again."
            actions={
                <>
                    <Link href="/">
                        <Button variant="outline" onClick={onGoHome}>
                            Go back to home
                        </Button>
                    </Link>
                    <Button onClick={onRetry}>
                        Try Again
                    </Button>
                </>
            }
        />
    );
}
