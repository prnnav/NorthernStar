import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    CalendarCheck,
    ChevronLeft,
    Gift,
    Heart,
    Moon,
    Sparkles,
    Target,
    X
} from 'lucide-react';
import React from 'react';

interface SuggestionsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClaimCredits: () => void;
  onScheduleCheckIn: (params: any) => void;
}

interface SidebarSuggestion {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
  action: () => void;
}

export const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({
  isOpen,
  onToggle,
  onClaimCredits,
  onScheduleCheckIn
}) => {
  const { toast } = useToast();

  const suggestions: SidebarSuggestion[] = [
    {
      id: 'daily-credits',
      icon: Gift,
      title: 'Claim Daily Credits',
      description: 'Your daily bonus is ready to collect',
      badge: '+25',
      action: onClaimCredits
    },
    {
      id: 'sleep-habit',
      icon: Moon,
      title: 'Add Better Sleep Habit',
      description: 'Based on your energy patterns, a sleep routine could help',
      action: () => {
        toast({
          title: "Sleep Habit Added! 🌙",
          description: "Kali will help you track your sleep journey",
        });
        console.log('Add sleep habit');
      }
    },
    {
      id: 'check-in',
      icon: CalendarCheck,
      title: 'Schedule Check-in Call',
      description: 'Kali suggests a motivational session tomorrow',
      action: () => onScheduleCheckIn({ type: 'motivational', time: 'tomorrow' })
    },
    {
      id: 'weekly-goal',
      icon: Target,
      title: 'Set Weekly Goal',
      description: 'Track your progress with specific targets',
      action: () => {
        toast({
          title: "Weekly Goal Set! 🎯",
          description: "Your magical journey towards growth begins now",
        });
        console.log('Set weekly goal');
      }
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full bg-card border-l border-border/50 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out",
        "w-80 shadow-magical",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary star-twinkle" />
              <h3 className="font-semibold gradient-text">AI Suggestions</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Personalized recommendations
          </p>
        </div>

        {/* Suggestions List */}
        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <Card
                key={suggestion.id}
                className="cosmic-border hover:border-primary/30 cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                onClick={suggestion.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {suggestion.title}
                        </h4>
                        {suggestion.badge && (
                          <Badge 
                            variant="secondary" 
                            className="bg-primary/20 text-primary text-xs ml-2 shrink-0"
                          >
                            {suggestion.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary star-twinkle" />
              <span className="text-sm font-medium gradient-text">Kali's Insight</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Suggestions update based on your activity and magical journey with me!
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          variant="outline"
          size="icon"
          className="fixed top-1/2 right-4 -translate-y-1/2 z-40 rounded-full cosmic-border magical-glow hover:scale-110 transition-all duration-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};