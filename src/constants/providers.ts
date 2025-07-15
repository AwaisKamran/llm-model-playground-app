
export interface ProviderConfig {
  name: string;
  icon: string;
  tag: string
  gradient: string;
}

export const PROVIDER_CONFIGS: Record<number, ProviderConfig> = {
  0: {
    name: 'OpenAI',
    tag: 'openai',
    icon: './openai.svg',
    gradient: 'from-green-500/10 to-blue-500/10'
  },
  1: {
    name: 'Anthropic',
    tag: 'anthropic',
    icon: './claude.svg',
    gradient: 'from-orange-500/10 to-red-500/10'
  },
  2: {
    name: 'xAI',
    tag: 'xai',
    icon: './grok.svg',
    gradient: 'from-purple-500/10 to-pink-500/10'
  }
};

export const DEFAULT_PROVIDER_CONFIG: ProviderConfig = {
  name: 'AI Model',
  icon: '🤖',
  tag: '#',
  gradient: 'from-blue-500/10 to-purple-500/10'
};
