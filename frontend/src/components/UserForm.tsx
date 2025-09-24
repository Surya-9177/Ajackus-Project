import { useForm } from 'react-hook-form';
import { User, UserFormData } from '@/types/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: User;
  isLoading?: boolean;
}

export function UserForm({ isOpen, onClose, onSubmit, user, isLoading }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      website: user?.website || '',
      company: user?.company?.name || '',
    },
  });

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] gradient-surface border-0 shadow-elegant">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {user ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {user ? 'Update user information below.' : 'Fill in the details for the new user.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              className="transition-smooth"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
            <Input
              id="username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
              className="transition-smooth"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="transition-smooth"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium">Phone</Label>
            <Input
              id="phone"
              {...register('phone', {
                required: 'Phone is required',
              })}
              className="transition-smooth"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-foreground font-medium">Website</Label>
            <Input
              id="website"
              {...register('website')}
              className="transition-smooth"
              placeholder="Enter website URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-foreground font-medium">Company</Label>
            <Input
              id="company"
              {...register('company', {
                required: 'Company is required',
              })}
              className="transition-smooth"
              placeholder="Enter company name"
            />
            {errors.company && (
              <p className="text-sm text-destructive">{errors.company.message}</p>
            )}
          </div>

          <DialogFooter className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="transition-smooth"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gradient-primary border-0 text-primary-foreground font-medium transition-smooth hover:opacity-90"
            >
              {isLoading ? (user ? 'Updating...' : 'Creating...') : (user ? 'Update User' : 'Create User')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}