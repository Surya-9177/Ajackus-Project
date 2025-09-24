import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserFormData, UserFilters, SortField, SortOrder } from '@/types/User';
import { UserService } from '@/services/userService';
import { UserCard } from '@/components/UserCard';
import { UserForm } from '@/components/UserForm';
import { FilterDialog } from '@/components/FilterDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
} from 'lucide-react';

export function UserManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [deleteUser, setDeleteUser] = useState<User | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: UserService.getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User created successfully.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UserFormData }) =>
      UserService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!filters.name || user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.username || user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
        (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.company || user.company?.name.toLowerCase().includes(filters.company.toLowerCase()));

      return matchesSearch && matchesFilters;
    });

    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'username':
          aValue = a.username;
          bValue = b.username;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'company':
          aValue = a.company?.name || '';
          bValue = b.company?.name || '';
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchTerm, filters, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleCreateUser = async (userData: UserFormData) => {
    await createUserMutation.mutateAsync(userData);
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    if (editingUser) {
      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        userData,
      });
      setEditingUser(undefined);
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUser) {
      await deleteUserMutation.mutateAsync(deleteUser.id);
      setDeleteUser(undefined);
    }
  };

  const openCreateForm = () => {
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Users</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Ajackus-Assignment</h1>
            <p className="text-muted-foreground">
              User Management Dashboard - Manage and organize users efficiently
            </p>
          </div>
          <Button
            onClick={openCreateForm}
            className="gradient-primary border-0 text-primary-foreground font-medium transition-smooth hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-smooth"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FilterDialog onApplyFilters={setFilters} currentFilters={filters} />
            
            <Select value={sortField} onValueChange={(value: SortField) => handleSort(value)}>
              <SelectTrigger className="w-[140px] transition-smooth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="username">Sort by Username</SelectItem>
                <SelectItem value="email">Sort by Email</SelectItem>
                <SelectItem value="company">Sort by Company</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSort(sortField)}
              className="transition-smooth"
            >
              {getSortIcon(sortField)}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing {paginatedUsers.length} of {filteredAndSortedUsers.length} users
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading users...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={openEditForm}
                onDelete={setDeleteUser}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="transition-smooth"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`transition-smooth ${
                        currentPage === pageNumber 
                          ? 'bg-primary text-primary-foreground' 
                          : ''
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="transition-smooth"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <Badge variant="secondary" className="bg-secondary/50">
              Page {currentPage} of {totalPages}
            </Badge>
          </div>
        )}
      </div>

      <UserForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        user={editingUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(undefined)}>
        <AlertDialogContent className="gradient-surface border-0 shadow-elegant">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete <strong>{deleteUser?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-smooth">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="bg-destructive text-destructive-foreground transition-smooth hover:bg-destructive-hover"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}