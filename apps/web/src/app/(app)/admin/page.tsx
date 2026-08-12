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
  Clock,
  Users,
  Shield,
  Phone,
  Mail,
  UserCheck,
  RefreshCw,
  Radio
} from 'lucide-react';
import { api, RESTAURANT_URL, ORDER_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Restaurant, Category, MenuItem, Order, RestaurantStaff } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { PartnerHeader } from '@/components/partner-header';

type Tab = 'restaurants' | 'orders' | 'staff';

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
  const [restFssai, setRestFssai] = useState('');
  const [restPhone, setRestPhone] = useState('');
  const [restGstin, setRestGstin] = useState('');

  // Staff Management state
  const [staffList, setStaffList] = useState<RestaurantStaff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffUserId, setStaffUserId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<'MANAGER' | 'CASHIER' | 'KITCHEN_STAFF'>('MANAGER');

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

  // Edit Store State
  const [showEditStore, setShowEditStore] = useState(false);
  const [editRestName, setEditRestName] = useState('');
  const [editRestDesc, setEditRestDesc] = useState('');
  const [editRestAddress, setEditRestAddress] = useState('');
  const [editRestCity, setEditRestCity] = useState('');
  const [editRestPhone, setEditRestPhone] = useState('');
  const [editRestFssai, setEditRestFssai] = useState('');
  const [editRestGstin, setEditRestGstin] = useState('');
  const [editRestImgUrl, setEditRestImgUrl] = useState('');
  const [editRestCuisines, setEditRestCuisines] = useState('');

  // Authentication Guard
  useEffect(() => {
    if (!authLoading) {
      if (!profile) {
        router.push('/admin/login');
      } else if (profile.role !== 'OWNER' && (profile.role as string) !== 'SUPER_ADMIN') {
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

  // Fetch staff members for selected restaurant
  const fetchStaff = async (id: string) => {
    setLoadingStaff(true);
    try {
      const data = await api<RestaurantStaff[]>(RESTAURANT_URL, `/restaurants/${id}/staff`, { auth: true });
      setStaffList(data || []);
    } catch (e) {
      console.error('Failed to fetch staff members:', e);
      setStaffList([]);
    } finally {
      setLoadingStaff(false);
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
    if (profile?.role === 'OWNER' || (profile?.role as string) === 'SUPER_ADMIN') {
      fetchRestaurants();
      fetchOrders();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedRestId) {
      fetchRestaurantDetail(selectedRestId);
      fetchStaff(selectedRestId);
    } else {
      setRestDetail(null);
      setStaffList([]);
    }
  }, [selectedRestId]);

  // Live KDS Polling Interval (Syncs every 8 seconds)
  useEffect(() => {
    if (activeTab !== 'orders' || !profile) return;

    const interval = setInterval(() => {
      fetchOrders();
    }, 8000);

    return () => clearInterval(interval);
  }, [activeTab, profile]);

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
          fssaiLicense: restFssai || undefined,
          contactPhone: restPhone || undefined,
          gstin: restGstin || undefined,
        },
      });
      // Reset form states
      setRestName('');
      setRestDesc('');
      setRestAddress('');
      setRestCity('');
      setRestImgUrl('');
      setRestCuisines('');
      setRestFssai('');
      setRestPhone('');
      setRestGstin('');
      setShowAddRest(false);
      await fetchRestaurants();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create restaurant');
    } finally {
      setActionBusy(null);
    }
  };

  const openEditStore = (r: Restaurant) => {
    setEditRestName(r.name || '');
    setEditRestDesc(r.description || '');
    setEditRestAddress(r.address || '');
    setEditRestCity(r.city || '');
    setEditRestPhone(r.contactPhone || '');
    setEditRestFssai(r.fssaiLicense || '');
    setEditRestGstin(r.gstin || '');
    setEditRestImgUrl(r.imageUrl || '');
    setEditRestCuisines(r.cuisines ? r.cuisines.join(', ') : '');
    setShowEditStore(true);
    setShowAddRest(false);
  };

  const handleEditRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestId || actionBusy) return;
    setActionBusy('edit_restaurant');

    const cuisinesArray = editRestCuisines
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await api(RESTAURANT_URL, `/restaurants/${selectedRestId}`, {
        method: 'PATCH',
        auth: true,
        body: {
          name: editRestName,
          description: editRestDesc || undefined,
          address: editRestAddress,
          city: editRestCity,
          contactPhone: editRestPhone || undefined,
          fssaiLicense: editRestFssai || undefined,
          gstin: editRestGstin || undefined,
          imageUrl: editRestImgUrl || undefined,
          cuisines: cuisinesArray,
        },
      });

      setShowEditStore(false);
      await fetchRestaurants();
      await fetchRestaurantDetail(selectedRestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update store');
    } finally {
      setActionBusy(null);
    }
  };

  // Action: Add Staff Member / Invite Manager
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestId || actionBusy) return;
    setActionBusy('add_staff');

    try {
      await api(RESTAURANT_URL, `/restaurants/${selectedRestId}/staff`, {
        method: 'POST',
        auth: true,
        body: {
          userId: staffUserId,
          name: staffName || undefined,
          phone: staffPhone || undefined,
          email: staffEmail || undefined,
          role: staffRole,
        },
      });
      setStaffUserId('');
      setStaffName('');
      setStaffPhone('');
      setStaffEmail('');
      setStaffRole('MANAGER');
      setShowAddStaff(false);
      await fetchStaff(selectedRestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add staff member');
    } finally {
      setActionBusy(null);
    }
  };

  // Action: Remove Staff Member
  const handleDeleteStaff = async (staffId: string) => {
    if (!selectedRestId || actionBusy || !confirm('Are you sure you want to remove this staff member?')) return;
    setActionBusy(`delete_staff_${staffId}`);

    try {
      await api(RESTAURANT_URL, `/restaurants/${selectedRestId}/staff/${staffId}`, {
        method: 'DELETE',
        auth: true,
      });
      await fetchStaff(selectedRestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove staff member');
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

  if (authLoading || !profile || (profile.role !== 'OWNER' && (profile.role as string) !== 'SUPER_ADMIN')) {
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
    <div className="min-h-screen bg-slate-50/50 pb-28">
      <PartnerHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingOrdersCount={pendingOrders.length}
      />
      
      <div className="space-y-8 select-none py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

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
                  label="FSSAI License No."
                  value={restFssai}
                  onChange={(e) => setRestFssai(e.target.value)}
                  placeholder="e.g. 11223344556677"
                />
                <TextField
                  label="Contact Phone"
                  value={restPhone}
                  onChange={(e) => setRestPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                />
                <TextField
                  label="GSTIN (optional)"
                  value={restGstin}
                  onChange={(e) => setRestGstin(e.target.value)}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                />
                <TextField
                  label="Image URL"
                  value={restImgUrl}
                  onChange={(e) => setRestImgUrl(e.target.value)}
                  placeholder="https://..."
                />
                <div className="flex gap-2 justify-end pt-1">
                  <Button type="button" variant="secondary" className="text-xs font-bold py-1.5 h-auto px-3" onClick={() => setShowAddRest(false)}>Cancel</Button>
                  <Button type="submit" className="text-xs font-bold py-1.5 h-auto px-3 bg-[#335438]" loading={actionBusy === 'create_restaurant'}>Submit for Approval</Button>
                </div>
              </form>
            )}

            {/* Form Expansion: Edit Store */}
            {showEditStore && (
              <form onSubmit={handleEditRestaurant} className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-3 animate-scale-in">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-[#335438]" />
                    Edit Restaurant Profile
                  </h3>
                  <button type="button" onClick={() => setShowEditStore(false)} className="text-zinc-400 hover:text-zinc-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <TextField
                  label="Restaurant Name"
                  value={editRestName}
                  onChange={(e) => setEditRestName(e.target.value)}
                  placeholder="e.g. Dosa Palace"
                  required
                />
                <TextField
                  label="Description"
                  value={editRestDesc}
                  onChange={(e) => setEditRestDesc(e.target.value)}
                  placeholder="e.g. Authentic South Indian Delicacies"
                />
                <TextField
                  label="Address"
                  value={editRestAddress}
                  onChange={(e) => setEditRestAddress(e.target.value)}
                  placeholder="Address"
                  required
                />
                <TextField
                  label="City"
                  value={editRestCity}
                  onChange={(e) => setEditRestCity(e.target.value)}
                  placeholder="City"
                  required
                />
                <TextField
                  label="Cuisines (comma separated)"
                  value={editRestCuisines}
                  onChange={(e) => setEditRestCuisines(e.target.value)}
                  placeholder="e.g. South Indian, Dosa"
                />
                <TextField
                  label="FSSAI License No."
                  value={editRestFssai}
                  onChange={(e) => setEditRestFssai(e.target.value)}
                  placeholder="14-digit license"
                />
                <TextField
                  label="Contact Phone"
                  value={editRestPhone}
                  onChange={(e) => setEditRestPhone(e.target.value)}
                  placeholder="+91..."
                />
                <TextField
                  label="GSTIN"
                  value={editRestGstin}
                  onChange={(e) => setEditRestGstin(e.target.value)}
                  placeholder="GSTIN"
                />
                <TextField
                  label="Image URL"
                  value={editRestImgUrl}
                  onChange={(e) => setEditRestImgUrl(e.target.value)}
                  placeholder="https://..."
                />
                <div className="flex gap-2 justify-end pt-1">
                  <Button type="button" variant="secondary" className="text-xs font-bold py-1.5 h-auto px-3" onClick={() => setShowEditStore(false)}>Cancel</Button>
                  <Button type="submit" className="text-xs font-bold py-1.5 h-auto px-3 bg-[#335438]" loading={actionBusy === 'edit_restaurant'}>Save Changes</Button>
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
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition relative group ${
                      selectedRestId === r.id
                        ? 'border-[#335438] bg-[#F2F3E9]/40 shadow-xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      {r.imageUrl && (
                        <img 
                          src={r.imageUrl} 
                          alt={r.name} 
                          className="w-12 h-12 object-cover rounded-xl shrink-0 bg-zinc-100 border border-zinc-150"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-zinc-800 truncate">{r.name}</h4>
                          <div className="flex items-center gap-1.5">
                            {r.status === 'ACTIVE' || r.isActive ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                Active
                              </span>
                            ) : r.status === 'PENDING_APPROVAL' ? (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                                Pending Approval
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                                Suspended
                              </span>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRestId(r.id);
                                openEditStore(r);
                              }}
                              className="p-1 text-zinc-400 hover:text-[#335438] hover:bg-[#F2F3E9] rounded-md transition cursor-pointer"
                              title="Edit Store Profile"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
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
                    {(() => {
                      const selectedStore = restaurants.find((r) => r.id === selectedRestId);
                      return selectedStore ? (
                        <button
                          onClick={() => openEditStore(selectedStore)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[11px] font-bold rounded-lg transition focus:outline-none cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-zinc-500" />
                          Edit Store
                        </button>
                      ) : null;
                    })()}
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

      {/* RENDER TAB: ORDERS (Kitchen Display System) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* KDS Live Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-150">
            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                Kitchen Display System (KDS)
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Auto-Sync (8s)
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Real-time incoming orders, preparation queue & delivery status pipeline
              </p>
            </div>

            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-700 shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-[#335438]' : ''}`} />
              <span>Sync Orders</span>
            </button>
          </div>
          
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

      {/* RENDER TAB: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="space-y-6 animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Staff & Restaurant Managers</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Assign managers, cashiers, and kitchen staff to manage daily restaurant operations.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Select Active Store */}
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs">
                <Store className="h-4 w-4 text-[#335438]" />
                <select
                  value={selectedRestId || ''}
                  onChange={(e) => setSelectedRestId(e.target.value)}
                  className="bg-transparent text-zinc-900 font-bold focus:outline-none cursor-pointer"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddStaff(!showAddStaff)}
                disabled={!selectedRestId}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#335438] hover:bg-[#28422c] text-white text-xs font-bold rounded-xl shadow-xs transition focus:outline-none cursor-pointer disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Invite Manager / Staff
              </button>
            </div>
          </div>

          {/* Form Expansion: Invite Staff */}
          {showAddStaff && (
            <form onSubmit={handleAddStaff} className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl mx-auto animate-scale-in">
              <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">Invite Staff Member to Restaurant</h3>
              
              <TextField
                label="Manager / Staff User ID"
                value={staffUserId}
                onChange={(e) => setStaffUserId(e.target.value)}
                placeholder="UUID e.g. 11111111-1111-1111-1111-111111111111"
                required
              />
              <TextField
                label="Full Name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Phone Number"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="e.g. +919876543211"
                />
                <TextField
                  label="Email Address"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Staff Operational Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#335438]"
                >
                  <option value="MANAGER">Restaurant Manager (Full Operations & Menu)</option>
                  <option value="CASHIER">Cashier (Order Accepting & Payments)</option>
                  <option value="KITCHEN_STAFF">Kitchen Display Staff (Order Prep Statuses)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-zinc-100">
                <Button type="button" variant="secondary" className="text-xs font-bold py-1.5 h-auto px-4" onClick={() => setShowAddStaff(false)}>Cancel</Button>
                <Button type="submit" className="text-xs font-bold py-1.5 h-auto px-4 bg-[#335438]" loading={actionBusy === 'add_staff'}>Send Invitation & Assign</Button>
              </div>
            </form>
          )}

          {/* Staff List Table */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
            {loadingStaff ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : staffList.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 space-y-2">
                <Users className="h-8 w-8 text-zinc-300 mx-auto" />
                <p className="text-xs font-bold text-zinc-700">No staff members assigned yet.</p>
                <p className="text-[11px] text-zinc-400">Click "Invite Manager / Staff" above to grant operational access to your team.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="px-6 py-3.5 font-bold">Staff Member</th>
                      <th className="px-6 py-3.5 font-bold">Assigned Role</th>
                      <th className="px-6 py-3.5 font-bold">User UUID</th>
                      <th className="px-6 py-3.5 font-bold">Assigned Date</th>
                      <th className="px-6 py-3.5 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
                    {staffList.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#F2F3E9] text-[#335438] flex items-center justify-center font-bold text-xs">
                              {s.name ? s.name[0] : 'M'}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-xs">{s.name || 'Unnamed Staff'}</p>
                              <p className="text-[10px] text-zinc-400">{s.phone || s.email || 'No contact provided'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            s.role === 'MANAGER'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : s.role === 'CASHIER'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                            <Shield className="h-3 w-3" />
                            {s.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-zinc-500">
                          {s.userId}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-[11px]">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteStaff(s.id)}
                            disabled={actionBusy === `delete_staff_${s.id}`}
                            className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition focus:outline-none cursor-pointer"
                            title="Revoke Staff Access"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
