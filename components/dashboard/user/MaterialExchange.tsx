import React, { useState } from 'react';
import { ShoppingBag, Plus, Tag, X, CheckCircle2, Image as ImageIcon, Search, Filter, CreditCard, ShoppingCart } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string; // URL or gradient class
  isGradient: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Recycled Plastic Pellets (HDPE)',
    price: 4500,
    description: 'High-quality recycled HDPE pellets suitable for injection molding. Washed and dried. Sourced from post-consumer waste.',
    category: 'Plastic',
    isGradient: true,
    image: 'from-blue-400 to-cyan-300'
  },
  {
    id: 2,
    title: 'Crushed Glass Cullet - Clear',
    price: 1200,
    description: 'Furnace-ready clear glass cullet. Free from ceramics and metals. Ideal for glass container manufacturing.',
    category: 'Glass',
    isGradient: true,
    image: 'from-emerald-300 to-teal-200'
  },
  {
    id: 3,
    title: 'Cardboard Bales (OCC)',
    price: 8500,
    description: 'Old Corrugated Containers (OCC) grade 11. Baled and wire-tied. Moisture content < 12%.',
    category: 'Paper',
    isGradient: true,
    image: 'from-amber-200 to-orange-100'
  },
  {
    id: 4,
    title: 'Aluminum Cans (Pressed)',
    price: 95000,
    description: 'Compressed aluminum beverage cans. Minimal contamination. Ready for smelting.',
    category: 'Metal',
    isGradient: true,
    image: 'from-slate-300 to-gray-400'
  }
];

interface MaterialExchangeProps {
  showToast: (type: 'success' | 'error', msg: string) => void;
}

const MaterialExchange: React.FC<MaterialExchangeProps> = ({ showToast }) => {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  
  // Sell Form State
  const [sellForm, setSellForm] = useState({
    title: '',
    price: '',
    category: 'Plastic',
    description: '',
    imageUrl: ''
  });

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.title || !sellForm.price || !sellForm.description) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      title: sellForm.title,
      price: parseFloat(sellForm.price),
      category: sellForm.category,
      description: sellForm.description,
      isGradient: !sellForm.imageUrl,
      image: sellForm.imageUrl || 'from-eco-green to-eco-teal'
    };

    setProducts([newProduct, ...products]);
    showToast('success', 'Item listed successfully!');
    
    // Reset and switch mode
    setSellForm({ title: '', price: '', category: 'Plastic', description: '', imageUrl: '' });
    setMode('buy');
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    showToast('success', 'Item added to cart!');
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    showToast('success', 'Purchase successful! Order #' + Math.floor(Math.random() * 10000));
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Material Exchange</h2>
              <p className="text-gray-500 text-sm">Buy and sell recyclable materials directly.</p>
            </div>
            {cartCount > 0 && (
                 <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-eco-green/10 text-eco-green rounded-full animate-fade-in">
                    <ShoppingCart size={18} />
                    <span className="font-bold text-sm">{cartCount} items</span>
                 </div>
             )}
        </div>

        <div className="bg-gray-100 p-1.5 rounded-xl flex items-center relative">
          <button
            onClick={() => setMode('buy')}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              mode === 'buy' 
                ? 'bg-white text-eco-darkGreen shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag size={18} /> Buy
          </button>
          <button
            onClick={() => setMode('sell')}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              mode === 'sell' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tag size={18} /> Sell
          </button>
        </div>
      </div>

      {/* MODE: BUY */}
      {mode === 'buy' && (
        <div className="animate-fade-in">
          {/* Search Bar */}
          <div className="mb-6 relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
             </div>
             <input 
                type="text" 
                placeholder="Search materials..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green outline-none transition-shadow"
             />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Product Image */}
                <div className={`h-48 w-full ${product.isGradient ? `bg-gradient-to-br ${product.image}` : 'bg-gray-100'} relative`}>
                    {!product.isGradient && product.image && (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 shadow-sm">
                        {product.category}
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-eco-green transition-colors">{product.title}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        <button className="p-2 bg-gray-100 hover:bg-eco-green hover:text-white rounded-lg transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE: SELL */}
      {mode === 'sell' && (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-blue-50/50">
                    <h3 className="text-lg font-bold text-gray-900">List New Item</h3>
                    <p className="text-sm text-gray-500">Fill in the details to list your material for sale.</p>
                </div>
                
                <form onSubmit={handleSellSubmit} className="p-6 space-y-5">
                    <Input 
                        label="Product Title *"
                        placeholder="e.g. Copper Wire Scrap"
                        value={sellForm.title}
                        onChange={(e) => setSellForm({...sellForm, title: e.target.value})}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Price (₹) *"
                            type="number"
                            placeholder="0.00"
                            value={sellForm.price}
                            onChange={(e) => setSellForm({...sellForm, price: e.target.value})}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green bg-white"
                                value={sellForm.category}
                                onChange={(e) => setSellForm({...sellForm, category: e.target.value})}
                            >
                                <option value="Plastic">Plastic</option>
                                <option value="Metal">Metal</option>
                                <option value="Paper">Paper</option>
                                <option value="Glass">Glass</option>
                                <option value="E-Waste">E-Waste</option>
                                <option value="Textile">Textile</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea 
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green transition-all"
                            placeholder="Describe condition, quantity, and packaging..."
                            value={sellForm.description}
                            onChange={(e) => setSellForm({...sellForm, description: e.target.value})}
                            required
                        />
                    </div>

                    <Input 
                        label="Image URL (Optional)"
                        placeholder="https://..."
                        value={sellForm.imageUrl}
                        onChange={(e) => setSellForm({...sellForm, imageUrl: e.target.value})}
                    />

                    <div className="pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-blue-200">
                            List Item for Sale
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedProduct(null)}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`h-48 w-full relative ${selectedProduct.isGradient ? `bg-gradient-to-br ${selectedProduct.image}` : 'bg-gray-100'}`}>
                     {!selectedProduct.isGradient && selectedProduct.image && (
                        <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
                    )}
                    <button 
                        onClick={() => setSelectedProduct(null)}
                        className="absolute top-4 right-4 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                            {selectedProduct.category}
                        </span>
                    </div>
                </div>
                
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.title}</h2>
                    <h3 className="text-3xl font-bold text-eco-green mb-6">₹{selectedProduct.price.toLocaleString()}</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-gray-700 leading-relaxed text-sm">{selectedProduct.description}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleAddToCart} variant="outline" className="flex-1 gap-2">
                            <ShoppingBag size={18} /> Add to Cart
                        </Button>
                        <Button onClick={handleBuyNow} className="flex-1 gap-2">
                            <CreditCard size={18} /> Buy Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MaterialExchange;