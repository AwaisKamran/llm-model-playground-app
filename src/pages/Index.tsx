
import React, { useCallback } from 'react';
import { ChatPanel } from '@/components/ChatPanel';
import { ChatHistory } from '@/components/ChatHistory';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Send, Trash2, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/hooks/useChat';
import { useChatContext } from '@/contexts/ChatContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { APP_CONFIG } from '@/types';

const Index: React.FC = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    chatStats,
    sendMessage
  } = useChat();
  
  const { 
    state: { selectedModels, modelParameters }, 
    clearMessages, 
    setSelectedModel, 
    setModelParameters 
  } = useChatContext();

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleClearMessages = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const handleModelParametersChange = useCallback((panelIndex: number, parameters: any) => {
    setModelParameters(panelIndex, parameters);
  }, [setModelParameters]);

  const handleModelChange = useCallback((panelIndex: number, modelId: string) => {
    setSelectedModel(panelIndex, modelId);
  }, [setSelectedModel]);

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col w-full">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 flex-shrink-0 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="lg:hidden" aria-label="Toggle sidebar">
                    <PanelLeft className="h-4 w-4" />
                  </SidebarTrigger>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LP</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">LLM Playground</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">Compare AI responses side by side</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="hidden lg:flex" aria-label="Toggle sidebar">
                    <PanelLeft className="h-4 w-4" />
                  </SidebarTrigger>
                  {messages.length > 0 && (
                    <Button
                      onClick={handleClearMessages}
                      variant="outline"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all"
                      aria-label="Clear all messages"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

        <div className="flex flex-1 w-full">
          <ChatHistory messages={messages} />
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex flex-col p-4 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[60vh]">
                {Array.from({ length: APP_CONFIG.panelCount }, (_, index) => (
                  <ChatPanel
                    key={index}
                    panelIndex={index}
                    messages={messages}
                    isLoading={isLoading}
                    stats={chatStats[index]}
                    onModelParametersChange={handleModelParametersChange}
                    onModelChange={handleModelChange}
                    selectedModel={selectedModels[index]}
                  />
                ))}
              </div>

              <div className="w-full flex-shrink-0 mt-6 sticky bottom-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      disabled={isLoading}
                      className="flex-1 border-0 bg-white/50 backdrop-blur-sm focus:bg-white/70 transition-all duration-200"
                      aria-label="Message input"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 flex-shrink-0 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              </div>
              <div className="text-sm text-gray-500">
                © 2025 That Interview With BTI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default Index;
