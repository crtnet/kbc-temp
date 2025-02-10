export type Theme = 'classic' | 'fantasy' | 'modern';

export interface CharacterDetails {
  name: string;
  personality: {
    traits: string[];
    motivation: string;
    fears: string[];
  };
  appearance: {
    height: string;
    hairColor: string;
    eyeColor: string;
    clothing: string;
  };
  relationships: {
    family: string[];
    friends: string[];
    others: string[];
  };
}

export interface StorySettings {
  structure: 'linear' | 'branching' | 'circular';
  emotionalTone: string[];
  educationalElements: {
    subjects: string[];
    learningGoals: string[];
    ageGroup: string;
  };
  pacing: 'slow' | 'medium' | 'fast';
  narrativeStyle: 'first-person' | 'third-person';
}

export interface VisualElements {
  illustrations: {
    style: 'realistic' | 'cartoon' | 'watercolor';
    colorPalette: string[];
    density: 'minimal' | 'balanced' | 'rich';
  };
  layout: {
    textPosition: 'left' | 'right' | 'center';
    imageSize: 'small' | 'medium' | 'large';
    margins: number;
  };
}