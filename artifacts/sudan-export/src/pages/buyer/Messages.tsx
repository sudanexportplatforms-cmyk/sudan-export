import { useState } from "react";
import { useListMessages, useSendMessage, getListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useUser } from "@clerk/react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function BuyerMessages() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { data: messages = [], isLoading } = useListMessages();
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations = messages.reduce((acc: any, msg) => {
    const isSentByMe = msg.senderId === user?.id;
    const contactId = isSentByMe ? msg.recipientId : msg.senderId;
    const contactName = isSentByMe ? msg.recipientName : msg.senderName;
    if (!acc[contactId]) {
      acc[contactId] = { id: contactId, name: contactName || t("buyer.messages.unknown"), messages: [] };
    }
    acc[contactId].messages.push(msg);
    return acc;
  }, {});

  const contactList = Object.values(conversations);
  const activeConversation = selectedContact ? conversations[selectedContact]?.messages || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    sendMessage.mutate({ data: { recipientId: selectedContact, body: newMessage } }, {
      onSuccess: () => {
        setNewMessage("");
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
      }
    });
  };

  return (
    <PortalLayout role="buyer" title={t("buyer.messages.title")}>
      <Card className="border-none shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-12rem)] min-h-[500px]">
        <div className="w-full md:w-80 ltr:border-r rtl:border-l border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <Input placeholder={t("buyer.messages.searchPlaceholder")} className="bg-gray-50" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" /></div>
            ) : contactList.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">{t("buyer.messages.noConversations")}</div>
            ) : (
              contactList.map((contact: any) => {
                const lastMsg = contact.messages[contact.messages.length - 1];
                return (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-white transition-colors ${selectedContact === contact.id ? 'bg-white ltr:border-l-4 rtl:border-r-4 ltr:border-l-primary rtl:border-r-primary' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900 truncate ltr:pr-2 rtl:pl-2">{contact.name}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{format(new Date(lastMsg.createdAt), 'MMM d')}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{lastMsg.body}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{conversations[selectedContact]?.name}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.map((msg: any) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                        {msg.body}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-gray-100">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Textarea
                    placeholder={t("buyer.messages.typePlaceholder")}
                    className="min-h-[44px] h-11 resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  />
                  <Button type="submit" size="icon" className="shrink-0 h-11 w-11" disabled={!newMessage.trim() || sendMessage.isPending}>
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-900">{t("buyer.messages.emptyTitle")}</p>
              <p className="max-w-sm mt-1">{t("buyer.messages.emptyDesc")}</p>
            </div>
          )}
        </div>
      </Card>
    </PortalLayout>
  );
}
