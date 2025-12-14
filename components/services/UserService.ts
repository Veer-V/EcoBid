
import { supabase } from '../lib/supabaseClient';
import { Bid, Auction } from './types';

export const UserService = {

    async getBids() {
        // In a real app, join bids with auctions
        // For now, return mock or try to fetch if table exists
        // We will simulate data for demonstration if DB is empty
        return [
            { id: 1, auctionTitle: 'Bulk Copper Scrap', bidAmount: 45000, date: '2023-10-15', status: 'Leading' },
            { id: 2, auctionTitle: 'Plastic Pellets', bidAmount: 12000, date: '2023-10-12', status: 'Outbid' },
            { id: 3, auctionTitle: 'E-Waste Lot #44', bidAmount: 8500, date: '2023-10-01', status: 'Won' },
        ];
    },

    async getTransactions() {
        return [
            { id: 'TXN-8821', desc: 'Wallet Deposit', amount: 50000, date: '2023-10-10', type: 'Credit', status: 'Success' },
            { id: 'TXN-8822', desc: 'EMD Block - Auction #12', amount: 2500, date: '2023-10-15', type: 'Debit', status: 'Hold' },
        ];
    },

    async getNotifications() {
        return [
            { id: 1, title: 'Bid Outbid', message: 'You have been outbid on Plastic Pellets.', time: '2 mins ago', read: false, type: 'warning' },
            { id: 2, title: 'Auction Won', message: 'Congratulations! You won E-Waste Lot #44.', time: '1 day ago', read: false, type: 'success' },
        ];
    },

    async markNotificationsRead() {
        // No-op for demo
        return true;
    },

    async addFunds(amount: number) {
        // Simulate adding funds
        return true;
    },

    async placeBid(auctionId: number, amount: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Please log in to place a bid");

        // 1. Check wallet balance
        // 2. Block EMD
        // 3. Insert bid to 'bids' table
        // 4. Update auction 'current_bid'

        // Simplified for this step:
        const { error } = await supabase
            .from('bids')
            .insert({
                auction_id: auctionId,
                bidder_id: user.id,
                amount: amount,
                status: 'placed'
            });

        if (error) throw error;

        // Update auction current bid (should ideally be trigger or transaction)
        await supabase
            .from('auctions')
            .update({ current_bid: amount })
            .eq('id', auctionId);

        return true;
    },

    // Mapping helper if needed, but we try to use AuthService
};
