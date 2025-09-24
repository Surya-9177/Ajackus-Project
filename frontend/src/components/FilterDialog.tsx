import { useState } from 'react';
import { UserFilters } from '@/types/User';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Filter } from 'lucide-react';

interface FilterDialogProps {
  onApplyFilters: (filters: UserFilters) => void;
  currentFilters: UserFilters;
}

export function FilterDialog({ onApplyFilters, currentFilters }: FilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(currentFilters);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => value && value.trim() !== '');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={`transition-smooth ${
            hasActiveFilters ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : ''
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {hasActiveFilters && (
            <span className="ml-2 bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs font-medium">
              {Object.values(currentFilters).filter(value => value && value.trim() !== '').length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gradient-surface border-0 shadow-elegant">
        <DialogHeader>
          <DialogTitle className="text-foreground">Filter Users</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Apply filters to narrow down the user list.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name-filter" className="text-foreground font-medium">Name</Label>
            <Input
              id="name-filter"
              value={filters.name || ''}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              placeholder="Filter by name"
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username-filter" className="text-foreground font-medium">Username</Label>
            <Input
              id="username-filter"
              value={filters.username || ''}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
              placeholder="Filter by username"
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-filter" className="text-foreground font-medium">Email</Label>
            <Input
              id="email-filter"
              value={filters.email || ''}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              placeholder="Filter by email"
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-filter" className="text-foreground font-medium">Company</Label>
            <Input
              id="company-filter"
              value={filters.company || ''}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              placeholder="Filter by company"
              className="transition-smooth"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearFilters}
            className="transition-smooth"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="gradient-primary border-0 text-primary-foreground font-medium transition-smooth hover:opacity-90"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}