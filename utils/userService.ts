// Initial State (Empty)
const INITIAL_USER = {
  name: '',
  email: '',
  company: '',
  phone: '',
  address: '',
  type: '',
  walletBalance: 0,
  emdBlocked: 0,
  avatar: ''
};

const INITIAL_AUCTIONS: any[] = [];
const INITIAL_BIDS: any[] = [];
const INITIAL_TRANSACTIONS: any[] = [];
const INITIAL_NOTIFICATIONS: any[] = [];

// In-memory store (simulating DB state during session)
let appState = {
  user: { ...INITIAL_USER },
  auctions: [...INITIAL_AUCTIONS],
  bids: [...INITIAL_BIDS],
  transactions: [...INITIAL_TRANSACTIONS],
  notifications: [...INITIAL_NOTIFICATIONS]
};

export const UserService = {
  initializeSession: (authUser: any) => {
    // Map auth user (from login) to dashboard profile structure
    appState.user = {
      name: authUser.fullName || '',
      email: authUser.email || '',
      company: authUser.company || authUser.fullName || '', // Default company to name if missing
      phone: authUser.phone || '',
      address: authUser.address || '',
      type: authUser.type || 'Recycler',
      walletBalance: 0, // Start with 0 balance
      emdBlocked: 0,
      avatar: authUser.fullName ? authUser.fullName.charAt(0) : 'U'
    };
  },

  getUserProfile: () => {
    return { ...appState.user };
  },

  updateUserProfile: (data: Partial<typeof INITIAL_USER>) => {
    appState.user = { ...appState.user, ...data };
    return appState.user;
  },

  getAuctions: () => {
    return [...appState.auctions];
  },

  getBids: () => {
    return [...appState.bids];
  },

  getTransactions: () => {
    return [...appState.transactions];
  },

  getNotifications: () => {
    return [...appState.notifications];
  },

  markNotificationsRead: () => {
    appState.notifications = appState.notifications.map(n => ({ ...n, read: true }));
    return [...appState.notifications];
  },

  placeBid: (auctionId: number, amount: number) => {
    const auctionIndex = appState.auctions.findIndex(a => a.id === auctionId);
    if (auctionIndex === -1) throw new Error("Auction not found");

    const auction = appState.auctions[auctionIndex];
    if (amount <= auction.currentBid) throw new Error("Bid must be higher than current bid");
    
    // EMD Logic: 5% of bid amount is blocked
    const emdAmount = Math.floor(amount * 0.05);
    const availableBalance = appState.user.walletBalance - appState.user.emdBlocked;

    if (availableBalance < emdAmount) {
      throw new Error(`Insufficient Available Balance for EMD (₹${emdAmount})`);
    }

    // Update Auction
    appState.auctions[auctionIndex] = { ...auction, currentBid: amount };

    // Update User Wallet (Block EMD)
    appState.user.emdBlocked += emdAmount;

    // Add Bid Record
    const newBid = {
      id: Math.floor(Math.random() * 10000),
      auctionTitle: auction.title,
      bidAmount: amount,
      status: 'Leading',
      date: new Date().toISOString().split('T')[0],
      transactionId: '-'
    };
    appState.bids.unshift(newBid);

    // Add Transaction Record
    const newTxn = {
      id: `TXN-${Math.floor(Math.random() * 10000)}`,
      type: 'Debit',
      amount: emdAmount,
      desc: `EMD Block - ${auction.title.substring(0, 15)}...`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    appState.transactions.unshift(newTxn);

    // Add Notification
    const newNotif = {
        id: Math.floor(Math.random() * 100000),
        type: 'success',
        title: 'Bid Placed Successfully',
        message: `You are now leading for "${auction.title}" with ₹${amount.toLocaleString()}.`,
        time: 'Just now',
        read: false
    };
    appState.notifications.unshift(newNotif);

    return { success: true, newBid, newBalance: appState.user.walletBalance };
  },

  addFunds: (amount: number) => {
    appState.user.walletBalance += amount;
    
    const newTxn = {
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        type: 'Credit',
        amount: amount,
        desc: 'Wallet Top-up',
        date: new Date().toISOString().split('T')[0],
        status: 'Success'
    };
    appState.transactions.unshift(newTxn);
    return appState.user.walletBalance;
  }
};