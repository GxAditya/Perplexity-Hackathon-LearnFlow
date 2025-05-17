
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Resource } from "@/lib/types";
import { Check, Clock, FileText, Video, Play, PenTool } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  onComplete: (resourceId: string, completed: boolean) => void;
  onRate?: (resourceId: string, rating: number) => void;
}

export default function ResourceCard({ resource, onComplete, onRate }: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCheckChange = (checked: boolean) => {
    onComplete(resource.id, checked);
  };
  
  const getResourceIcon = () => {
    switch (resource.type) {
      case "video":
        return <Video className="h-5 w-5 text-planner-blue" />;
      case "text":
        return <FileText className="h-5 w-5 text-planner-purple" />;
      case "project":
        return <PenTool className="h-5 w-5 text-planner-gray-dark" />;
      case "interactive":
        return <Play className="h-5 w-5 text-planner-blue-dark" />;
      case "audio":
        return <Play className="h-5 w-5 text-planner-purple-dark" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formattedDate = resource.dueDate ? 
    new Date(resource.dueDate).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric'
    }) : '';

  return (
    <Card 
      className={`transition-all duration-300 ${
        resource.completed ? 'bg-gray-50 border-green-200' : 
        isHovered ? 'shadow-md transform -translate-y-1' : ''
      } ${
        resource.completed ? 'opacity-80' : 'opacity-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6">
              {getResourceIcon()}
            </div>
            <CardTitle className={`text-base ${resource.completed ? 'line-through text-gray-500' : ''}`}>
              {resource.title}
            </CardTitle>
          </div>
          <Checkbox 
            checked={resource.completed} 
            onCheckedChange={handleCheckChange}
            className="h-5 w-5 border-2"
          />
        </div>
        <CardDescription className="text-xs">
          {resource.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-planner-gray">
            <Clock className="h-3.5 w-3.5" />
            <span>{resource.estimatedTime} min</span>
          </div>
          
          {formattedDate && (
            <div className="text-xs px-2 py-1 bg-planner-purple-light text-planner-purple rounded">
              Due {formattedDate}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full border-planner-blue text-planner-blue hover:bg-planner-blue hover:text-white"
          >
            {resource.completed ? (
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                Completed
              </span>
            ) : (
              "Start Learning"
            )}
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
