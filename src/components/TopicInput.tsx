
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TopicInputData, LearningPreference } from "@/lib/types";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface TopicInputProps {
  onSubmit: (data: TopicInputData) => void;
}

export default function TopicInput({ onSubmit }: TopicInputProps) {
  const [topic, setTopic] = useState("");
  const [timeframe, setTimeframe] = useState(4);
  const [timeframeUnit, setTimeframeUnit] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [knowledgeLevel, setKnowledgeLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [preferences, setPreferences] = useState<LearningPreference[]>(['video', 'text']);
  const [studyTimePerDay, setStudyTimePerDay] = useState(1);

  const preferenceOptions: { value: LearningPreference; label: string }[] = [
    { value: 'video', label: 'Video Tutorials' },
    { value: 'text', label: 'Text Articles & Guides' },
    { value: 'project', label: 'Practical Projects' },
    { value: 'interactive', label: 'Interactive Exercises' },
    { value: 'audio', label: 'Audio (Podcasts)' },
  ];

  const handlePreferenceToggle = (preference: LearningPreference) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter(p => p !== preference));
    } else {
      setPreferences([...preferences, preference]);
    }
  };

  const handleSubmit = () => {
    if (!topic.trim()) {
      toast.error("Please enter a learning topic");
      return;
    }
    
    if (preferences.length === 0) {
      toast.error("Please select at least one learning preference");
      return;
    }
    
    onSubmit({
      topic,
      timeframe,
      timeframeUnit,
      knowledgeLevel,
      preferences,
      studyTimePerDay
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in">
      <CardHeader className="bg-planner-purple-light rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-planner-purple-dark">Create Your Learning Plan</CardTitle>
        <CardDescription>Tell us what you want to learn and how you want to learn it</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium">What do you want to learn?</label>
          <Input
            id="topic"
            placeholder="E.g., Learn Python programming, Master digital marketing..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2 flex-1 min-w-[150px]">
            <label htmlFor="timeframe" className="block text-sm font-medium">Learning timeframe</label>
            <div className="flex gap-2">
              <Input
                id="timeframe"
                type="number"
                min="1"
                max="52"
                value={timeframe}
                onChange={(e) => setTimeframe(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <Select value={timeframeUnit} onValueChange={(value: 'days' | 'weeks' | 'months') => setTimeframeUnit(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Time Unit</SelectLabel>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label htmlFor="knowledgeLevel" className="block text-sm font-medium">Prior knowledge level</label>
            <Select value={knowledgeLevel} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setKnowledgeLevel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Knowledge Level</SelectLabel>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Learning preferences</label>
          <div className="flex flex-wrap gap-2">
            {preferenceOptions.map((option) => (
              <Button 
                key={option.value}
                type="button"
                variant={preferences.includes(option.value) ? "default" : "outline"}
                className={`flex items-center gap-1 ${preferences.includes(option.value) ? 'bg-planner-purple' : ''}`}
                onClick={() => handlePreferenceToggle(option.value)}
              >
                {preferences.includes(option.value) && <Check className="w-4 h-4" />}
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Available study time: {studyTimePerDay} {studyTimePerDay === 1 ? 'hour' : 'hours'} per day
          </label>
          <Slider
            defaultValue={[1]}
            min={0.5}
            max={8}
            step={0.5}
            value={[studyTimePerDay]}
            onValueChange={(values) => setStudyTimePerDay(values[0])}
            className="w-full"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-2 pb-6">
        <Button 
          onClick={handleSubmit} 
          className="bg-planner-purple hover:bg-planner-purple-dark transition-colors py-6 px-8 text-lg"
        >
          Generate Learning Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
