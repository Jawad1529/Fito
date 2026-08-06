'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { H2, Text } from '@/components/atoms/Typography';
import Card from '@/components/atoms/Card';
import Tag from '@/components/atoms/Tag';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import useAuth from '@/hooks/useAuth';
import useTestingMode from '@/hooks/useTestingMode';
import { getMyOrders } from '@/services/order.service';

const STATUS_VARIANT = {
  delivered: 'solid',
  shipped: 'outline',
  processing: 'muted',
  cancelled: 'muted',
};

function loadLocalOrders() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('Fitoo_orders') || '[]').reverse();
  } catch {
    return [];
  }
}

export default function OrdersPage() {
  const { testingMode } = useTestingMode();
  const { isAuthenticated } = useAuth();
  // Remounts (resetting all local state) whenever testing mode or auth
  // state changes, instead of syncing that reset through an effect.
  return (
    <OrdersPageInner
      key={`${testingMode}-${isAuthenticated}`}
      testingMode={testingMode}
      isAuthenticated={isAuthenticated}
    />
  );
}

function OrdersPageInner({ testingMode, isAuthenticated }) {
  const [orders, setOrders] = useState(testingMode ? loadLocalOrders() : []);
  const [loading, setLoading] = useState(!testingMode && isAuthenticated);
  const [error, setError] = useState('');

  useEffect(() => {
    if (testingMode || !isAuthenticated) return;
    let cancelled = false;
    getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load your orders.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [testingMode, isAuthenticated]);

  if (!testingMode && !isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <H2>My Orders</H2>
        <Text muted className="mt-2">
          Sign in to view your order history.
        </Text>
        <Link href="/login">
          <Button variant="primary" size="lg" className="mt-6">
            Log In
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <Text className="text-danger">{error}</Text>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <H2>My Orders</H2>
        <Text muted className="mt-2">
          You haven&apos;t placed any orders yet.
        </Text>
        <Link href="/shop">
          <Button variant="primary" size="lg" className="mt-6">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <H2 className="mb-6">My Orders</H2>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-surface border border-border">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-semibold text-text">Order #{order.id}</p>
                <Text muted className="text-sm">
                  {new Date(order.placedAt).toLocaleString()}
                </Text>
              </div>
              {order.status && (
                <Tag variant={STATUS_VARIANT[order.status] || 'muted'} className="capitalize">
                  {order.status}
                </Tag>
              )}
            </div>

            <div className="flex flex-col gap-1 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {item.name} × {item.quantity ?? item.qty}
                  </span>
                  <span className="text-text">
                    PKR {(item.price * (item.quantity ?? item.qty)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-semibold text-text border-t border-border-light pt-3">
              <span>Total</span>
              <span>PKR {order.total.toFixed(2)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
