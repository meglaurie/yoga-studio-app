'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

interface PurchaseButtonProps {
  productId: string | undefined;
}

export default function PurchaseButton({
  productId,
}: PurchaseButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handlePurchase() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError(data.error ?? 'Unable to start checkout.');
        return;
      }

      if (!data.url) {
        setError('Unable to start checkout.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Unable to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handlePurchase}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Started'}
      </Button>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}
    </div>
  );
}