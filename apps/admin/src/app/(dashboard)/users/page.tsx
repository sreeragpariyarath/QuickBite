'use client';

import { useState } from 'react';
import { MOCK_USERS } from '@/constants';
import { UsersHeader, UsersFilterBar, UsersTable } from '@/components/users';

export default function UsersManagementPage() {
  const [users] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <UsersHeader />

      {/* Filter and Search Bar */}
      <UsersFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Users Data Table */}
      <UsersTable users={filteredUsers} />
    </div>
  );
}
