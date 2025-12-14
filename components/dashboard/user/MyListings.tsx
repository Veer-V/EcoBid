import React, { useState, useEffect } from 'react';
import { Package, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { MarketplaceService, MarketplaceItem } from '../../services/MarketplaceService';
import Button from '../../ui/Button';

interface MyListingsProps {
    showToast: (type: 'success' | 'error', msg: string) => void;
}

const MyListings: React.FC<MyListingsProps> = ({ showToast }) => {
    const [listings, setListings] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Refactor this to use a real user ID in the future
    const MOCK_USER_ID = "user-123";

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        setLoading(true);
        try {
            // ideally MarketplaceService.getUserItems(userId)
            // For now we filter locally or assuming getItems returns all
            const allItems = await MarketplaceService.getItems();
            // Filter logic would go here if API returned everyone's items
            // For demo purposes, we might just show all or filter by a mock ID if the item has one
            setListings(allItems);
        } catch (error) {
            console.error("Failed to load listings", error);
            showToast('error', 'Failed to load your listings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            await MarketplaceService.deleteItem(id);
            setListings(prev => prev.filter(item => item.id !== id));
            showToast('success', 'Listing deleted successfully');
        } catch (error) {
            console.error("Delete failed", error);
            showToast('error', 'Failed to delete listing');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-eco-green" size={32} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                <Button variant="outline" onClick={loadListings}>Refresh</Button>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">You haven't listed any items yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {listings.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                            <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.category} • {item.quantity}</p>
                                <p className="font-bold text-eco-green mt-1">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={() => handleDelete(item.id)}
                                    title="Delete Listing"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
