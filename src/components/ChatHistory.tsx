import React from 'react';
import { format, isToday, isYesterday, startOfWeek, isThisWeek } from 'date-fns';
import { Clock, MessageSquare } from 'lucide-react';
import { Message } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface ChatHistoryProps {
  messages: Message[];
}

const groupMessagesByDate = (messages: Message[]) => {
  const groups = new Map<string, Message[]>();
  
  messages.forEach((message) => {
    let groupKey: string;
    
    if (isToday(message.timestamp)) {
      groupKey = 'Today';
    } else if (isYesterday(message.timestamp)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(message.timestamp)) {
      groupKey = 'This Week';
    } else {
      groupKey = format(message.timestamp, 'MMMM yyyy');
    }
    
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(message);
  });
  
  // Sort messages within each group by timestamp (newest first)
  groups.forEach((messages) => {
    messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });
  
  // Return groups in order: Today, Yesterday, This Week, then months (newest first)
  const orderedGroups: [string, Message[]][] = [];
  
  if (groups.has('Today')) orderedGroups.push(['Today', groups.get('Today')!]);
  if (groups.has('Yesterday')) orderedGroups.push(['Yesterday', groups.get('Yesterday')!]);
  if (groups.has('This Week')) orderedGroups.push(['This Week', groups.get('This Week')!]);
  
  // Add month groups sorted by date (newest first)
  const monthGroups = Array.from(groups.entries())
    .filter(([key]) => !['Today', 'Yesterday', 'This Week'].includes(key))
    .sort(([, a], [, b]) => b[0].timestamp.getTime() - a[0].timestamp.getTime());
  
  orderedGroups.push(...monthGroups);
  
  return orderedGroups;
};

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const userMessages = messages.filter(msg => msg.isUser);
  const groupedMessages = groupMessagesByDate(userMessages);

  const truncateContent = (content: string, maxLength: number = 50) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Chat History</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {groupedMessages.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No chat history yet
          </div>
        ) : (
          groupedMessages.map(([groupName, groupMessages]) => (
            <SidebarGroup key={groupName}>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-4 py-2">
                {groupName}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupMessages.map((message) => (
                    <SidebarMenuItem key={message.id}>
                      <SidebarMenuButton
                        className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                        asChild
                      >
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2 w-full">
                            <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {format(message.timestamp, 'HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm text-left line-clamp-2 w-full">
                            {truncateContent(message.content)}
                          </p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  );
};