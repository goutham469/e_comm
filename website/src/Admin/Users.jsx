import React, { useEffect, useState } from 'react';
import SectionIndicatorCard from '../components/SectionIndicator';
import { API } from '../utils/API';
import { toast } from 'react-toastify';
import { Search, Filter, UserPlus, MoreVertical, Edit, Trash2, Shield, User, Calendar, Mail, Crown, Grid3x3, List, ChevronLeft, ChevronRight, ShieldBan } from 'lucide-react';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [params, setParams] = useState({ page: 0, limit: 20, email:null, name:null });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showActions, setShowActions] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [totalPages, setTotalPages] = useState(1);

  async function getData() {
    try {
      setLoading(true);
      const response = await API.ADMIN.USER.list_users(params);
      if (response.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        // Calculate total pages if API provides total count
        // setTotalPages(Math.ceil(response.data.total / params.limit));
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [params]);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // TODO: Implement delete API call
      const response = await API.ADMIN.USER.delete_user(userId);
      if(response.success)
      {
        toast.success("user deleted");
      }else{ toast.error(response.error) }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditUser = async (user) => {
    if(user.isBlocked)
    {
      const response = await API.ADMIN.USER.unblock_user( user.email );
      if(response.success){ toast.success("Blocked") }
      else{ toast.error(response.error) }
    }
    else{
      const response = await API.ADMIN.USER.block_user( user.email );
      if(response.success){ toast.success("Blocked") }
      else{ toast.error(response.error) }
    }
  };

  const handleChangeRole = async (email, newRole) => {
    try {
      console.log(newRole);
      if( newRole == 'ADMIN' )
      {
        const response = await API.ADMIN.USER.make_admin( email );
        if(response.success){ toast.success("Role changed USER -> ADMIN") }
        else{
          toast.error(response.error)
        }
      }
      else{
        const response = await API.ADMIN.USER.revoke_admin( email );
        if(response.success){ toast.success("Role changed to USER -> ADMIN") }
        else{
          toast.error(response.error)
        }
      }
      setShowActions(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div>
        <SectionIndicatorCard text={'ADMIN/Users'} />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionIndicatorCard text={'ADMIN/Users'} />

      <div className="p-6">
        {/* Header & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 text-sm">
                Total {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'table' 
                      ? 'bg-white shadow-sm text-green-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Table View"
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-green-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={20} />
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <UserPlus size={20} />
                Add User
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content - Table or Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Start by adding your first user'}
            </p>
          </div>
        ) : viewMode === 'table' ? (
          // Table View
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profile_pic}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=80`;
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          { user.isBlocked &&<ShieldBan size={20} color='red'  /> }
                          {user.role === 'ADMIN' ? <Crown size={14} /> : <User size={14} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm">{API.TOOLS.formatDate(user.ac_created_on)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActions(showActions === user._id ? null : user._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {showActions === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                        >
                          <Edit size={16} />
                          {user.isBlocked? "un-Block" : "block"}
                        </button>
                        <button
                          onClick={() => handleChangeRole(user.email, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                        >
                          <Shield size={16} />
                          {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 text-left text-sm border-t"
                        >
                          <Trash2 size={16} />
                          Delete User
                        </button>
                      </div>
                    )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative h-24 bg-gradient-to-r from-green-500 to-green-600">
                  <div className="absolute -bottom-12 left-6">
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=128`;
                      }}
                    />
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setShowActions(showActions === user._id ? null : user._id)}
                      className="p-2 bg-white/90 hover:bg-white rounded-lg transition"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {showActions === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                        >
                          <Edit size={16} />
                          Edit User
                        </button>
                        <button
                          onClick={() => handleChangeRole(user.email, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                        >
                          <Shield size={16} />
                          {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 text-left text-sm border-t"
                        >
                          <Trash2 size={16} />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-16 px-6 pb-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role === 'ADMIN' ? <Crown size={14} /> : <User size={14} />}
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Mail size={16} />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">
                      Joined {API.TOOLS.formatDate(user.ac_created_on)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setParams({ ...params, page: Math.max(0, params.page - 1) })}
              disabled={params.page === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              <span className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
                {params.page + 1}
              </span>
            </div>
            
            <button
              onClick={() => setParams({ ...params, page: params.page + 1 })}
              disabled={users.length < params.limit}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;