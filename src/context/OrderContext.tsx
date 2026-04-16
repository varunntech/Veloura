import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, CartItem, Address } from '@/types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query } from 'firebase/firestore';

interface OrderContextType {
  orders: Order[];
  createOrder: (userId: string, items: CartItem[], totalAmount: number, shippingAddress: Address) => Order;
  updateOrderPayment: (orderId: string, paymentId: string) => Promise<void>;
  getUserOrders: (userId: string) => Order[];
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order));
      ordersData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const createOrder = (userId: string, items: CartItem[], totalAmount: number, shippingAddress: Address): Order => {
    const newId = 'ORD' + Date.now().toString();
    const newOrder: Order = {
      id: newId,
      userId: userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    try {
      setDoc(doc(db, 'orders', newId), newOrder);
    } catch (e) {
      console.error("Error creating order:", e);
    }
    return newOrder;
  };

  const updateOrderPayment = async (orderId: string, paymentId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentId,
        status: 'paid'
      });
    } catch (e) {
      console.error("Error updating order payment:", e);
    }
  };

  const getUserOrders = (userId: string) => orders.filter(o => o.userId === userId);
  const getOrder = (orderId: string) => orders.find(o => o.id === orderId);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderPayment, getUserOrders, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
