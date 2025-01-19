import { TypeIcon as type, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface SuggestionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
}

export function SuggestionCard({
  // icon: Icon,
  title,
  description,
  onClick,
}: SuggestionCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:bg-black-200 hover:shadow-md bg-black-100"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2 ">
        <div className="flex items-center gap-2">
          {/* <Icon className="w-4 h-4 text-blue-500" /> */}
          <h3 className="font-medium text-sm text-white text-center w-full">
            {title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
