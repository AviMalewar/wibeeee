import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isOwn }) {
  const time = message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : '';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div 
        className={`relative max-w-[85%] md:max-w-[65%] px-2 py-1.5 rounded-lg shadow-sm ${
          isOwn 
            ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' 
            : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
        }`}
      >
        <div className="flex flex-col">
          <p className="text-[14.2px] leading-relaxed pr-12 whitespace-pre-wrap break-words">
            {message.text}
          </p>
          <div className="flex items-center justify-end gap-1 mt-[-4px]">
            <span className="text-[11px] text-[#8696a0]">
              {time}
            </span>
            {isOwn && (
              <div className="text-[#53bdeb]">
                {message.status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 opacity-50" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
