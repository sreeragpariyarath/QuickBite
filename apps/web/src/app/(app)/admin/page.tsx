'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  ShoppingBag, 
  Plus, 
  Utensils, 
  FolderPlus, 
  Check, 
  X, 
  Loader2, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { api, RESTAURANT_URL, ORDER_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Restaurant, Category, MenuItem, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

type Tab = 'restaurants' | 'orders';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();

  // Navigation state
  const [activeTab, setActiveTab] = useState<Tab>('restaurants');

  // Business entities state
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestId, setSelectedRestId] = useState<string | null>(null);
  const [restDetail, setRestDetail] = useState<{ categories: Category[]; menuItems: MenuItem[] } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Loading/Busy overlays
  const [loadingRest, setLoadingRest] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  // Form inputs: Create Restaurant
  const [showAddRest, setShowAddRest] = useState(false);
  const [restName, setRestName] = useState('');
  const [restDesc, setRestDesc] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restCity, setRestCity] = useState('');
  const [restImgUrl, setRestImgUrl] = useState('');
  const [restCuisines, setRestCuisines] = useState('');

  // Form inputs: Create Category
  const [showAddCat, setShowAddCat] = useState(false);
  const [catName, setCatName] = useState('');

  // Form inputs: Add/Edit Dish
  const [showAddDish, setShowAddDish] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishImgUrl, setDishImgUrl] = useState('');
  const [dishCatId, setDishCatId] = useState<string>('');
  const [dishAvailable, setDishAvailable] = useState(true);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading) {
      if (!profile) {
        router.push('/admin/login');
      } else if (profile.role !== 'OWNER') {
        router.push('/');
      }
    }
  }, [profile, authLoading, router]);

  // Fetch owned restaurants
  const fetchRestaurants = async () => {
    if (!profile) return;
    setLoadingRest(true);
    try {
      const data = await api<Restaurant[]>(RESTAURANT_URL, `/restaurants?ownerId=${profile.id}`, { auth: true });
      setRestaurants(data);
      if (data.length > 0 && !selectedRestId) {
        setSelectedRestId(data[0].id);
      }
    } catch (e) {
      console.error('Failed to load owned restaurants:', e);
    } finally {
      setLoadingRest(false);
    }
  };

  // Fetch active restaurant detail & menu catalog
  const fetchRestaurantDetail = async (id: string) => {
    try {
      // FindOne includes category structures and dishes
      const data = await api<any>(RESTAURANT_URL, `/restaurants/${id}`);
      setRestDetail({
        categories: data.categories || [],
        menuItems: data.menuItems || [],
      });
    } catch (e) {
      console.error('Failed to fetch restaurant details:', e);
    }
  };

  // Fetch incoming orders
  const fetchOrders = async () => {
    if (!profile) return;
    setLoadingOrders(true);
    try {
      const data = await api<Order[]>(ORDER_URL, '/orders', { auth: true });
      setOrders(data);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Initial Data Fetch triggers
  useEffect(() => {
    if (profile?.role === 'OWNER') {
      fetchRestaurants();
      fetchOrders();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedRestId) {
      fetchRestaurantDetail(selectedRestId);
    } else {
      setRestDetail(null);
    }
  }, [selectedRestId]);

  // Action: Create Restaurant
  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionBusy) return;
    setActionBusy('create_restaurant');

    const cuisinesArr = restCuisines.split(',').map(c => c.trim()).filter(Boolean);

    try {
      await api(RESTAURANT_URL, '/restaurants', {
        method: 'POST',
        auth: true,
        body: {
          name: restName,
          description: restDesc || undefined,
          address: restAddress,
          city: restCity,
          imageUrl: restImgUrl || undefined,
          cuisines: cuisinesArr,
        },
      });
      // Reset form states
      setRestName('');
      setRestDesc('');
      setRestAddress('');
      setRestCity('');
      setRestImgUrl('');
      setRestCuisines('');
      setShowAddRest(false);
      await fetchRestaurants();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create restaurant');
    } finally {
      setActionBusy(null);
    }
  };

  // Action: Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestId || actionBusy) return;
    setActionBusy('add_category');

    try {
      await api(RESTAURANT_URL, `/restaurants/${selectedRestId}/categories`, {
        method: 'POST',
        auth: true,
        body: { name: catName },
      });
      setCatName('');
      setShowAddCat(false);
      await fetchRestaurantDetail(selectedRestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setActionBusy(null);
    }
  };

  // Action: Add / Update Dish
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestId || actionBusy) return;
    setActionBusy('save_dish');

    const body = {
      name: dishName,
      description: dishDesc || undefined,
      price: parseFloat(dishPrice),
      imageUrl: dishImgUrl || undefined,
      categoryId: dishCatId || undefined,
      isAvailable: dishAvailable,
    };

    try {
      if (editingDishId) {
        await api(RESTAURANT_URL, `/restaurants/${selectedRestId}/menu-items/${editingDishId}`, {
          method: 'PATCH',
          auth: true,
          body,
        });
      } else {
        await api(RESTAURANT_URL, `/restaurants/${selectedRestId}/menu-items`, {
          method: 'POST',
          auth: true,
          body,
        });
      }
      // Reset inputs
      setDishName('');
      setDishDesc('');
      setDishPrice('');
      setDishImgUrl('');
      setDishCatId('');
      setDishAvailable(true);
      setEditingDishId(null);
      setShowAddDish(false);
      await fetchRestaurantDetail(selectedRestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save dish');
    } finally {
      setActionBusy(null);
    }
  };

  // Action: Delete Dish
  const handleDeleteDish = async (itemId: string) => {
    if (!selectedRestId || actionBusy || !confirm('Are you sure you want to delete this dish?')) return;
    setActionBusy(`delete_${itemId}`);

    try {
      await api(RESTAURANT_URL, `/restaurants/${selectedRestId}/menu-items/${itemId}`, {
        method: 'DELETE',
        auth: true,
      });
      await fetchRestaurantDetail(selectedRestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete dish');
    } finally {
      setActionBusy(null);
    }
  };

  // Action: Transition Order Status
  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject' | 'prepare' | 'deliver') => {
    if (actionBusy) return;
    setActionBusy(`order_${orderId}`);

    try {
      await api(ORDER_URL, `/orders/${orderId}/${action}`, {
        method: 'PATCH',
        auth: true,
      });
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : `Failed to ${action} order`);
    } finally {
      setActionBusy(null);
    }
  };

  // Setup form states for editing a dish
  const startEditDish = (dish: MenuItem, catId: string | null) => {
    setEditingDishId(dish.id);
    setDishName(dish.name);
    setDishDesc(dish.description || '');
    setDishPrice(dish.price.toString());
    setDishImgUrl(dish.imageUrl || '');
    setDishCatId(catId || '');
    setDishAvailable(dish.isAvailable);
    setShowAddDish(true);
  };

  if (authLoading || !profile || profile.role !== 'OWNER') {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#335438]" />
      </div>
    );
  }

  // Aggregate metrics for orders
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const activeOrders = orders.filter(o => ['ACCEPTED', 'PREPARING'].includes(o.status));
  const completedOrders = orders.filter(o => ['DELIVERED', 'REJECTED', 'CANCELLED'].includes(o.status));

  return (
    <div className="space-y-8 select-none py-6 max-w-6xl mx-auto px-4">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Partner Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Logged in as {profile.name} ({profile.email})</p>
        </div>
        
        {/* Navigation Tabs buttons */}
        <div className="flex bg-zinc-100 rounded-xl p-1 w-fit border border-zinc-200/40">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${
              activeTab === 'restaurants'
                ? 'bg-white text-[#335438] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Store className="h-4 w-4" />
            My Restaurants
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-[#335438] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Incoming Orders
            {pendingOrders.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* RENDER TAB: RESTAURANTS */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: list of restaurants */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Restaurants</h2>
              <button
                onClick={() => setShowAddRest(!showAddRest)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#335438] hover:bg-[#28422c] text-white text-[11px] font-bold rounded-lg shadow-2xs hover:shadow-xs transition focus:outline-none cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Store
              </button>
            </div>

            {/* Create Restaurant Form Expansion */}
            {showAddRest && (
              <form onSubmit={handleCreateRestaurant} className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-4 animate-scale-in">
                <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-2">New Restaurant Profile</h3>
                <TextField
                  label="Name"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  placeholder="e.g. Gourmet Pizza"
                  required
                />
                <TextField
                  label="Description"
                  value={restDesc}
                  onChange={(e) => setRestDesc(e.target.value)}
                  placeholder="e.g. Fine Italian wood-fired pizza"
                />
                <TextField
                  label="Address"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  placeholder="e.g. 102 Baker Street"
                  required
                />
                <TextField
                  label="City"
                  value={restCity}
                  onChange={(e) => setRestCity(e.target.value)}
                  placeholder="e.g. Indore"
                  required
                />
                <TextField
                  label="Cuisines (comma separated)"
                  value={restCuisines}
                  onChange={(e) => setRestCuisines(e.target.value)}
                  placeholder="e.g. Pizza, Italian, Healthy"
                  required
                />
                <TextField
                  label="Image URL"
                  value={restImgUrl}
                  onChange={(e) => setRestImgUrl(e.target.value)}
                  placeholder="https://..."
                />
                <div className="flex gap-2 justify-end pt-1">
                  <Button type="button" variant="secondary" className="text-xs font-bold py-1.5 h-auto px-3" onClick={() => setShowAddRest(false)}>Cancel</Button>
                  <Button type="submit" className="text-xs font-bold py-1.5 h-auto px-3 bg-[#335438]" loading={actionBusy === 'create_restaurant'}>Create</Button>
                </div>
              </form>
            )}

            {/* Restaurant List Cards */}
            {loadingRest ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-8 bg-zinc-50 border border-zinc-150 rounded-2xl text-xs text-zinc-500 font-medium">
                No restaurants registered under this account.
              </div>
            ) : (
              <div className="space-y-3">
                {restaurants.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRestId(r.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                      selectedRestId === r.id
                        ? 'border-[#335438] bg-[#F2F3E9]/40 shadow-xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      {r.imageUrl && (
                        <img src={r.imageUrl} alt={r.name} className="w-12 h-12 object-cover rounded-xl shrink-0 bg-zinc-100 border border-zinc-150" />
                      )}
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-zinc-800 truncate">{r.name}</h4>
                        <p className="text-[11px] font-medium text-zinc-500 truncate mt-0.5">{r.address}, {r.city}</p>
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {r.cuisines.slice(0, 3).map((c, i) => (
                            <span key={i} className="text-[9px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded-md">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Menus, Categories & Dishes catalog */}
          <div className="lg:col-span-8 space-y-6">
            {selectedRestId ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Restaurant Menu Manager</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAddCat(true);
                        setShowAddDish(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[11px] font-bold rounded-lg transition focus:outline-none cursor-pointer"
                    >
                      <FolderPlus className="h-3.5 w-3.5 text-zinc-500" />
                      Add Category
                    </button>
                    <button
                      onClick={() => {
                        setEditingDishId(null);
                        setDishName('');
                        setDishDesc('');
                        setDishPrice('');
                        setDishImgUrl('');
                        setDishCatId('');
                        setDishAvailable(true);
                        setShowAddDish(true);
                        setShowAddCat(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#335438] hover:bg-[#28422c] text-white text-[11px] font-bold rounded-lg transition focus:outline-none cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Dish
                    </button>
                  </div>
                </div>

                {/* Form Expansion: Add Category */}
                {showAddCat && (
                  <form onSubmit={handleAddCategory} className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-4 animate-scale-in">
                    <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-2">Add New Menu Category</h3>
                    <TextField
                      label="Category Name"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="e.g. Starters, Main Course, Drinks"
                      required
                    />
                    <div className="flex gap-2 justify-end pt-1">
                      <Button type="button" variant="secondary" className="text-xs font-bold py-1.5 h-auto px-3" onClick={() => setShowAddCat(false)}>Cancel</Button>
                      <Button type="submit" className="text-xs font-bold py-1.5 h-auto px-3 bg-[#335438]" loading={actionBusy === 'add_category'}>Save Category</Button>
                    </div>
                  </form>
                )}

                {/* Form Expansion: Add/Edit Dish */}
                {showAddDish && (
                  <form onSubmit={handleSaveDish} className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-4 animate-scale-in">
                    <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                      {editingDishId ? 'Edit Dish Profile' : 'Add New Dish'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        label="Dish Name"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="e.g. Spicy Pepperoni Pizza"
                        required
                      />
                      <TextField
                        label="Price (₹)"
                        value={dishPrice}
                        onChange={(e) => setDishPrice(e.target.value)}
                        placeholder="e.g. 299"
                        type="number"
                        step="0.01"
                        required
                      />
                    </div>
                    <TextField
                      label="Description"
                      value={dishDesc}
                      onChange={(e) => setDishDesc(e.target.value)}
                      placeholder="e.g. Loaded with fresh cheese and pepperoni slices"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</label>
                        <select
                          value={dishCatId}
                          onChange={(e) => setDishCatId(e.target.value)}
                          className="h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#335438]"
                        >
                          <option value="">Uncategorized (Other items)</option>
                          {restDetail?.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <TextField
                        label="Image URL"
                        value={dishImgUrl}
                        onChange={(e) => setDishImgUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_available"
                        checked={dishAvailable}
                        onChange={(e) => setDishAvailable(e.target.checked)}
                        className="rounded border-zinc-200 text-[#335438] focus:ring-[#335438]"
                      />
                      <label htmlFor="is_available" className="text-xs font-bold text-zinc-700">Available for Ordering</label>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <Button type="button" variant="secondary" className="text-xs font-bold py-1.5 h-auto px-3" onClick={() => setShowAddDish(false)}>Cancel</Button>
                      <Button type="submit" className="text-xs font-bold py-1.5 h-auto px-3 bg-[#335438]" loading={actionBusy === 'save_dish'}>
                        {editingDishId ? 'Save Changes' : 'Create Dish'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Display Menu sections */}
                {restDetail ? (
                  <div className="space-y-6">
                    {/* Render by Category */}
                    {restDetail.categories.map((cat) => (
                      <div key={cat.id} className="bg-white border border-zinc-200/80 rounded-2xl shadow-2xs overflow-hidden">
                        <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-150 flex items-center justify-between">
                          <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">{cat.name}</h3>
                          <span className="text-[10px] font-bold text-zinc-400 bg-white px-2 py-0.5 border border-zinc-150 rounded-md">
                            {cat.menuItems.length} items
                          </span>
                        </div>
                        <div className="divide-y divide-zinc-100">
                          {cat.menuItems.length === 0 ? (
                            <p className="text-xs text-zinc-400 p-4 text-center">No dishes added to this category yet.</p>
                          ) : (
                            cat.menuItems.map((dish) => (
                              <div key={dish.id} className="p-4 flex justify-between items-center gap-4">
                                <div className="flex gap-3 items-center overflow-hidden">
                                  {dish.imageUrl ? (
                                    <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-zinc-100" />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center shrink-0">
                                      <Utensils className="h-5 w-5 text-zinc-400" />
                                    </div>
                                  )}
                                  <div className="overflow-hidden">
                                    <h4 className="text-xs font-bold text-zinc-800 truncate">{dish.name}</h4>
                                    <p className="text-[10px] text-zinc-500 truncate">{dish.description || 'No description'}</p>
                                    <span className="inline-block text-[10px] font-black text-[#335438] mt-1">₹{Number(dish.price).toFixed(2)}</span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditDish(dish, cat.id)}
                                    className="p-2 text-zinc-400 hover:text-zinc-600 transition rounded-lg hover:bg-zinc-50 cursor-pointer"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDish(dish.id)}
                                    className="p-2 text-zinc-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
                                    disabled={actionBusy === `delete_${dish.id}`}
                                  >
                                    {actionBusy === `delete_${dish.id}` ? (
                                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Render Uncategorized dishes */}
                    {restDetail.menuItems.length > 0 && (
                      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-2xs overflow-hidden">
                        <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-150">
                          <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Other Items (Uncategorized)</h3>
                        </div>
                        <div className="divide-y divide-zinc-100">
                          {restDetail.menuItems.map((dish) => (
                            <div key={dish.id} className="p-4 flex justify-between items-center gap-4">
                              <div className="flex gap-3 items-center overflow-hidden">
                                {dish.imageUrl ? (
                                  <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-zinc-100" />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center shrink-0">
                                    <Utensils className="h-5 w-5 text-zinc-400" />
                                  </div>
                                )}
                                <div className="overflow-hidden">
                                  <h4 className="text-xs font-bold text-zinc-800 truncate">{dish.name}</h4>
                                  <p className="text-[10px] text-zinc-500 truncate">{dish.description || 'No description'}</p>
                                  <span className="inline-block text-[10px] font-black text-[#335438] mt-1">₹{Number(dish.price).toFixed(2)}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEditDish(dish, null)}
                                  className="p-2 text-zinc-400 hover:text-zinc-600 transition rounded-lg hover:bg-zinc-50 cursor-pointer"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDish(dish.id)}
                                  className="p-2 text-zinc-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
                                  disabled={actionBusy === `delete_${dish.id}`}
                                >
                                  {actionBusy === `delete_${dish.id}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
                <Store className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
                <p className="text-sm text-zinc-500 font-bold">Select a store from the sidebar to manage menus.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER TAB: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Header Stats Indicator Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">New Requests</p>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">{pendingOrders.length}</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Prep</p>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">{activeOrders.length}</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Loader2 className="h-5 w-5 animate-pulse" />
              </div>
            </div>
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Completed Orders</p>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">{completedOrders.length}</h3>
              </div>
              <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#335438]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
              <ShoppingBag className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm text-zinc-500 font-bold">No incoming orders found for your restaurants.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Pending Requests & Active Prep */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Section 1: Pending Orders */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    Pending Acceptance
                    {pendingOrders.length > 0 && (
                      <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-[9px] font-black">{pendingOrders.length}</span>
                    )}
                  </h3>

                  {pendingOrders.length === 0 ? (
                    <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-150 rounded-xl p-4 text-center">No pending orders.</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingOrders.map((o) => (
                        <div key={o.id} className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 border border-amber-200/50 rounded-md">COD</span>
                              <h4 className="text-xs font-bold text-zinc-900 mt-2">Order ID: <span className="text-zinc-600 font-medium select-text">{o.id}</span></h4>
                            </div>
                            <span className="text-xs font-black text-[#335438]">₹{Number(o.total).toFixed(2)}</span>
                          </div>

                          <div className="border-t border-zinc-50 pt-3">
                            <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Order Items</h5>
                            <ul className="space-y-1.5 text-xs font-medium text-zinc-700">
                              {o.items?.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                  <span>{item.name} <span className="text-zinc-400 font-bold">x {item.quantity}</span></span>
                                  <span>₹{Number(item.price) * item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 justify-end pt-3 border-t border-zinc-50">
                            <button
                              onClick={() => handleOrderAction(o.id, 'reject')}
                              disabled={actionBusy === `order_${o.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition focus:outline-none cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleOrderAction(o.id, 'accept')}
                              disabled={actionBusy === `order_${o.id}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#335438] hover:bg-[#28422c] text-white text-xs font-bold rounded-xl shadow-xs transition focus:outline-none cursor-pointer"
                            >
                              <Check className="h-4 w-4" />
                              Accept Order
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Active Preparation */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Preparation</h3>
                  
                  {activeOrders.length === 0 ? (
                    <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-150 rounded-xl p-4 text-center">No active preparation orders.</p>
                  ) : (
                    <div className="space-y-4">
                      {activeOrders.map((o) => (
                        <div key={o.id} className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-200/50 rounded-md">
                                {o.status}
                              </span>
                              <h4 className="text-xs font-bold text-zinc-900 mt-2">Order ID: <span className="text-zinc-600 font-medium select-text">{o.id}</span></h4>
                            </div>
                            <span className="text-xs font-black text-[#335438]">₹{Number(o.total).toFixed(2)}</span>
                          </div>

                          <div className="border-t border-zinc-50 pt-3">
                            <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Order Items</h5>
                            <ul className="space-y-1.5 text-xs font-medium text-zinc-700">
                              {o.items?.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                  <span>{item.name} <span className="text-zinc-400 font-bold">x {item.quantity}</span></span>
                                  <span>₹{Number(item.price) * item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 justify-end pt-3 border-t border-zinc-50">
                            {o.status === 'ACCEPTED' ? (
                              <button
                                onClick={() => handleOrderAction(o.id, 'prepare')}
                                disabled={actionBusy === `order_${o.id}`}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#335438] hover:bg-[#28422c] text-white text-xs font-bold rounded-xl shadow-xs transition focus:outline-none cursor-pointer"
                              >
                                Start Preparing
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOrderAction(o.id, 'deliver')}
                                disabled={actionBusy === `order_${o.id}`}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-xs transition focus:outline-none cursor-pointer"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: History / Completed Orders */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Order History</h3>
                
                {completedOrders.length === 0 ? (
                  <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-150 rounded-xl p-4 text-center">No completed orders.</p>
                ) : (
                  <div className="space-y-3">
                    {completedOrders.map((o) => (
                      <div key={o.id} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-3xs space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="truncate max-w-[120px] text-zinc-700">ID: {o.id}</span>
                          <span className="text-[#335438]">₹{Number(o.total).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 rounded-md ${
                            o.status === 'DELIVERED'
                              ? 'bg-green-50 text-green-700 border border-green-200/50'
                              : o.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700 border border-red-200/50'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
