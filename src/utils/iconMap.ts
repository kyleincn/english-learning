import type { ComponentType } from 'react';
import { 
  Bot, 
  Code, 
  Globe,
  Sparkles,
  FileText,
  Lightbulb
} from 'lucide-react';

interface IconProps {
  size?: number;
  color?: string;
}

// Icon 映射
export const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  Bot,
  Sparkles,
  Code,
  FileText,
  Globe,
  Lightbulb,
};
