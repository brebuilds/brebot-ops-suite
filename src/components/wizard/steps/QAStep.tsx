import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Brain, Lightbulb, Shield, Save, CheckCircle } from "lucide-react";

interface QAStepProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface QAEntry {
  category: 'experience' | 'emotion' | 'ideation' | 'ethics';
  question: string;
  answer: string;
}

const qaCategories = [
  {
    id: 'experience' as const,
    title: 'Experience',
    icon: Brain,
    description: 'Share your professional background and expertise',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    questions: [
      "What's your professional background?",
      "What are your core skills and expertise?",
      "What major projects have you worked on?",
      "What challenges have you overcome?",
      "What tools and technologies do you use?"
    ]
  },
  {
    id: 'emotion' as const,
    title: 'Emotion',
    icon: Heart,
    description: 'Define your values and emotional intelligence',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    questions: [
      "What motivates you?",
      "How do you handle stress or pressure?",
      "What are your core values?",
      "How do you prefer to communicate?",
      "What environments help you thrive?"
    ]
  },
  {
    id: 'ideation' as const,
    title: 'Ideation',
    icon: Lightbulb,
    description: 'Capture your creative thinking patterns',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    questions: [
      "How do you approach problem-solving?",
      "What sparks your creativity?",
      "How do you generate new ideas?",
      "What's your innovation process?",
      "How do you evaluate opportunities?"
    ]
  },
  {
    id: 'ethics' as const,
    title: 'Ethics',
    icon: Shield,
    description: 'Set ethical boundaries and principles',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    questions: [
      "What are your ethical principles?",
      "How do you handle conflicts of interest?",
      "What would you never compromise on?",
      "How do you approach sensitive topics?",
      "What responsibility do you feel toward others?"
    ]
  }
];

export function QAStep({ onComplete, isCompleted }: QAStepProps) {
  const [activeCategory, setActiveCategory] = useState<'experience' | 'emotion' | 'ideation' | 'ethics'>('experience');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedCategories, setSavedCategories] = useState<Set<string>>(new Set());

  const currentCategory = qaCategories.find(cat => cat.id === activeCategory)!;
  const totalAnswers = Object.keys(answers).length;
  const recommendedAnswers = 25;

  const saveCategory = async () => {
    const categoryAnswers = currentCategory.questions
      .map((question, index) => ({
        category: activeCategory,
        question,
        answer: answers[`${activeCategory}-${index}`] || ''
      }))
      .filter(qa => qa.answer.trim());

    // Mock API calls
    for (const qa of categoryAnswers) {
      console.log('Saving QA:', qa);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setSavedCategories(prev => new Set([...prev, activeCategory]));
    
    if (savedCategories.size >= 3) { // When 4 categories are saved (including current)
      onComplete();
    }
  };

  const updateAnswer = (questionIndex: number, answer: string) => {
    const key = `${activeCategory}-${questionIndex}`;
    setAnswers(prev => ({ ...prev, [key]: answer }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Deep Q&A Session</h3>
          <p className="text-muted-foreground">
            Help BreBot understand your thinking patterns and decision-making process
          </p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="text-sm">
            {totalAnswers}/{recommendedAnswers} answers
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {recommendedAnswers - totalAnswers} more recommended
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(value: any) => setActiveCategory(value)}>
        <TabsList className="grid w-full grid-cols-4">
          {qaCategories.map((category) => {
            const Icon = category.icon;
            const isSaved = savedCategories.has(category.id);
            
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <Icon className={`h-4 w-4 ${category.color}`} />
                {category.title}
                {isSaved && <CheckCircle className="h-3 w-3 text-success" />}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {qaCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card className={`${category.bgColor} border ${category.borderColor}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                  {category.title}
                </CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {category.questions.map((question, index) => {
                const key = `${category.id}-${index}`;
                const answer = answers[key] || '';
                
                return (
                  <div key={index} className="space-y-3">
                    <Label className="text-base font-medium">
                      {index + 1}. {question}
                    </Label>
                    <Textarea
                      placeholder="Share your thoughts and experiences..."
                      value={answer}
                      onChange={(e) => updateAnswer(index, e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    {answer && (
                      <div className="text-xs text-muted-foreground">
                        {answer.length} characters
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {category.questions.filter((_, index) => 
                  answers[`${category.id}-${index}`]?.trim()
                ).length} of {category.questions.length} questions answered
              </div>
              
              <Button 
                onClick={saveCategory}
                disabled={savedCategories.has(category.id)}
                className="flex items-center gap-2"
              >
                {savedCategories.has(category.id) ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save {category.title}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Progress Summary */}
      {savedCategories.size > 0 && (
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">
                  {savedCategories.size} of 4 categories completed
                </span>
              </div>
              {savedCategories.size === 4 && (
                <Badge className="bg-success text-success-foreground">
                  Deep Q&A Complete
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}