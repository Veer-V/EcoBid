import React, { useState } from 'react';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

interface Order {
    id: string;
    items: string[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered';
    date: string;
}

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    // In the future, we will fetch real orders here.
    // For now, cleaner to show empty than mock data.

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No recent orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-500">Order #{order.id}</p>
                                    <p className="text-xs text-gray-400">{order.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {order.status === 'Delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Total Amount</span>
                                <span className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
