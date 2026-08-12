'use client';

import { useEffect, useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Users, 
  Utensils, 
  Loader2,
  Trash2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Hash
} from 'lucide-react';
import { request } from '@/lib/api-client';
import { RESTAURANT_SERVICE_URL } from '@/lib/api';
import { Modal } from '@/components/ui';

interface StaffMember {
  id: string;
  userId: string;
  name?: string;
  phone?: string;
  email?: string;
  role: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

interface RestaurantDetail {
  id: string;
  name: string;
  ownerId: string;
  description?: string;
  address: string;
  city: string;
  imageUrl?: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  isActive: boolean;
  fssaiLicense?: string;
  contactPhone?: string;
  gstin?: string;
  cuisines?: string[];
  createdAt: string;
  categories?: Category[];
  menuItems?: MenuItem[];
  staff?: StaffMember[];
}

interface RestaurantDetailModalProps {
  restaurantId: string | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL') => void;
  onDeleteStore?: (id: string, name: string) => void;
}

export function RestaurantDetailModal({
  restaurantId,
  onClose,
  onStatusChange,
  onDeleteStore,
}: RestaurantDetailModalProps) {
  const [detail, setDetail] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'staff'>('info');

  useEffect(() => {
    if (!restaurantId) {
      setDetail(null);
      return;
    }

    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await request<RestaurantDetail>(
          RESTAURANT_SERVICE_URL,
          `/restaurants/${restaurantId}`,
          { auth: true }
        );
        setDetail(data);
      } catch (err: any) {
        console.error('Failed to load store detail:', err);
        setError(err?.message || 'Failed to fetch restaurant details');
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [restaurantId]);

  const isOpen = Boolean(restaurantId);

  const modalFooter = detail ? (
    <>
      <div className="flex items-center gap-2">
        {detail.status === 'PENDING_APPROVAL' ? (
          <button
            onClick={() => {
              onStatusChange?.(detail.id, 'ACTIVE');
              onClose();
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 shadow-sm transition cursor-pointer"
          >
            Approve & Activate Store ✓
          </button>
        ) : detail.status === 'ACTIVE' ? (
          <button
            onClick={() => {
              onStatusChange?.(detail.id, 'SUSPENDED');
              onClose();
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold border border-red-200/80 transition cursor-pointer"
          >
            Suspend Store
          </button>
        ) : (
          <button
            onClick={() => {
              onStatusChange?.(detail.id, 'ACTIVE');
              onClose();
            }}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl font-bold text-xs hover:bg-emerald-100 transition cursor-pointer"
          >
            Re-Activate Store
          </button>
        )}

        <button
          onClick={() => {
            onDeleteStore?.(detail.id, detail.name);
            onClose();
          }}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer ml-1"
          title="Delete Store Listing"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onClose}
        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
      >
        Close
      </button>
    </>
  ) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={detail?.name || 'Restaurant Profile'}
      subtitle={restaurantId ? `ID: ${restaurantId}` : undefined}
      icon={<Store className="w-5 h-5 text-blue-600" />}
      footer={modalFooter}
      maxWidth="2xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-14 gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Fetching restaurant profile & catalog...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-semibold border border-red-200">
          {error}
        </div>
      ) : detail ? (
        <div className="space-y-5 select-none">
          {/* Top Status & Date Banner Card */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              {detail.status === 'ACTIVE' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active & Live
                </span>
              ) : detail.status === 'PENDING_APPROVAL' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs animate-pulse">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Approval
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-xs">
                  <XCircle className="w-3.5 h-3.5 text-red-600" /> Suspended
                </span>
              )}
            </div>

            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Registered: {new Date(detail.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Segmented Control Navigation Bar */}
          <div className="flex bg-slate-100/90 rounded-xl p-1 border border-slate-200/50 w-fit">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview & Verification</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Menu Catalog ({detail.menuItems?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Roster ({detail.staff?.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & COMPLIANCE CARDS */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Location Details</span>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-snug">{detail.address}</p>
                <p className="text-xs text-slate-500">City: <strong className="text-slate-800 font-semibold">{detail.city}</strong></p>
              </div>

              {/* Owner Info Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Partner Ownership</span>
                </div>
                <p className="text-xs font-mono font-semibold text-slate-900 truncate">Owner ID: {detail.ownerId}</p>
                {detail.contactPhone && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {detail.contactPhone}
                  </p>
                )}
              </div>

              {/* FSSAI License Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-2xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FSSAI License</p>
                <p className="text-sm font-mono font-bold text-slate-900">
                  {detail.fssaiLicense || 'Not provided'}
                </p>
              </div>

              {/* GSTIN Registration Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-2xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">GSTIN Tax Registration</p>
                <p className="text-sm font-mono font-bold text-slate-900">
                  {detail.gstin || 'Not provided'}
                </p>
              </div>

              {/* Description Card */}
              {detail.description && (
                <div className="sm:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-2xs">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{detail.description}</p>
                </div>
              )}

              {/* Cuisines Card */}
              {detail.cuisines && detail.cuisines.length > 0 && (
                <div className="sm:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2 shadow-2xs">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cuisines / Food Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.cuisines.map((c) => (
                      <span key={c} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MENU CATALOG */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              {detail.categories && detail.categories.length > 0 ? (
                detail.categories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {cat.name} ({cat.menuItems?.length || 0} items)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.menuItems?.map((item) => (
                        <div key={item.id} className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs border border-slate-200/60">
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-slate-500 text-[11px]">₹{item.price}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {item.isAvailable ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : detail.menuItems && detail.menuItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detail.menuItems.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs border border-slate-200/60">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-slate-500 text-[11px]">₹{item.price}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No menu items or categories configured yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STAFF ROSTER */}
          {activeTab === 'staff' && (
            <div className="space-y-2.5">
              {detail.staff && detail.staff.length > 0 ? (
                detail.staff.map((s) => (
                  <div key={s.id} className="bg-white border border-slate-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-2xs">
                    <div>
                      <p className="font-bold text-slate-900">{s.name || 'Staff Member'}</p>
                      <p className="text-[11px] text-slate-500">{s.email || s.phone || s.userId}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-bold text-[10px]">
                      {s.role}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No staff members or managers assigned yet.
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
