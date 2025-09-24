import { User } from '@/types/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Mail, Phone, Globe, Building } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card className="gradient-surface border-0 shadow-elegant transition-spring hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground leading-none">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
            ID: {user.id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-primary" />
          <span className="text-foreground truncate">{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-primary" />
          <span className="text-foreground">{user.phone}</span>
        </div>
        
        {user.website && (
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-foreground truncate">{user.website}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm">
          <Building className="h-4 w-4 text-primary" />
          <span className="text-foreground truncate">{user.company?.name}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(user)}
          className="transition-smooth hover:bg-secondary-hover"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user)}
          className="bg-destructive text-destructive-foreground transition-smooth hover:bg-destructive-hover"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}