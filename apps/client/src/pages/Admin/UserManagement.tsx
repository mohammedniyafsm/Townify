import {  useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Calendar,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/stroe";
import type { UserSchema } from "@repo/types";
import { userStatusToggle } from "@/Redux/Slice/AdminUsers/UsersThunk";

function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null);
  const auth = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.users);
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch<AppDispatch>();
  const [filteredUsers, setFilteredUsers] = useState<UserSchema[]>([]);

  useEffect(() => {
    if (users.status !== "succeeded") return;
    const list = users?.users ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q && statusFilter === "all") {
      setFilteredUsers(list);
      return;
    }
    const filtered = list.filter((user) => {
      const matchesSearch =
        user.name.includes(searchQuery) || user.email.includes(searchQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter == "active" && user.isActive) ||
        (statusFilter == "blocked" && !user.isActive);
      return matchesSearch && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [users.users, searchQuery, statusFilter]);

  const handleSearch = (value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  const handleStatusToggle = async (userId: string) => {
    await dispatch(userStatusToggle(userId));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const openUserDetails = (user: UserSchema) => {
    setSelectedUser(user);
  };

  // Get user data for modal
  const getUserModalData = (user: UserSchema) => ({
    id: user.id,
    name: user.name,
    avatar: user.profile,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    joinedDate: user.createdAt,
  });

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Active: {users.users.filter((u) => u.isActive).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>
              Blocked: {users.users.filter((u) => !u.isActive).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Total: {users.users.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.users.length} users
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg md:rounded-xl overflow-hidden bg-white">
        <div className="overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                  Profile
                </TableHead>
                <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending ||
              users.status === "loading" ||
              auth.status === "loading" ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    <TableCell>
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <TableCell>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
                        {user.profile ? (
                          <img
                            src={user.profile}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const initial =
                                  user.name?.charAt(0)?.toUpperCase() || "?";
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">${initial}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium whitespace-nowrap">
                      {user.name}
                    </TableCell>

                    <TableCell className="text-gray-600 whitespace-nowrap">
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "outline"}
                        className={`whitespace-nowrap ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "destructive"}
                        className={`whitespace-nowrap ${
                          user.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                        }`}
                      >
                        {user.isActive ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {user.isActive ? "Active" : "Blocked"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "default"}
                          className={`whitespace-nowrap ${
                            !user.isActive
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }`}
                          onClick={() => handleStatusToggle(user.id)}
                        >
                          {user.isActive ? "Block" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="whitespace-nowrap"
                          onClick={() => openUserDetails(user)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <UserIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery
                          ? `No users match "${searchQuery}"`
                          : "No users match your filters"}
                      </p>
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          {selectedUser &&
            (() => {
              const userData = getUserModalData(selectedUser);
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        {userData.avatar ? (
                          <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const initial =
                                  userData.name?.charAt(0)?.toUpperCase() ||
                                  "?";
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">${initial}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {userData.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {userData.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge
                            variant={
                              userData.role === "admin" ? "default" : "outline"
                            }
                            className={
                              userData.role === "admin"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : ""
                            }
                          >
                            {userData.role === "admin" ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : (
                              <User className="h-3 w-3 mr-1" />
                            )}
                            {userData.role.charAt(0).toUpperCase() +
                              userData.role.slice(1)}
                          </Badge>
                          <Badge
                            variant={
                              userData.isActive ? "default" : "destructive"
                            }
                            className={
                              userData.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {userData.isActive ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {userData.isActive ? "Active" : "Blocked"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Joined Date</p>
                          <p className="font-medium">
                            {new Date(userData.joinedDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedUser(null)}
                      >
                        Close
                      </Button>
                      <Button
                        variant={userData.isActive ? "destructive" : "default"}
                        className={`flex-1 ${
                          userData.isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                        onClick={() => {
                          handleStatusToggle(userData.id);
                          setSelectedUser(null);
                        }}
                      >
                        {userData.isActive ? "Block User" : "Activate User"}
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;
