export type QuizOption = {
  label: string;
  value: string;
};

export type Question = {
  id: number;
  text: string;
  type: 'choice' | 'number';
  options?: QuizOption[];
  feedback?: string;
  placeholder?: string;
  unit?: string;
};

export type UserAnswers = {
  weight?: number;
  height?: number;
  goal?: string;
  bodyType?: string;
  focusArea?: string;
  routine?: string;
  sleep?: string;
  water?: string;
  obstacle?: string;
};

export type QuizState = {
  step: 'opening' | 'question' | 'partial_result' | 'social_proof' | 'final_result';
  currentQuestionIndex: number;
  answers: UserAnswers;
};
