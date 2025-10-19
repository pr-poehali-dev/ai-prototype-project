import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const Index = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isReady, setIsReady] = useState(false);
  const [showSequence, setShowSequence] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '👋 Привет! Я готов к общению. Как дела?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const now = new Date();
    const targetDate = new Date(now.getTime() + 56 * 60 * 1000);

    const updateCountdown = () => {
      const currentTime = new Date().getTime();
      const distance = targetDate.getTime() - currentTime;

      if (distance < 0) {
        setIsReady(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReady) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 1);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);

      const timer1 = setTimeout(() => setShowSequence(1), 500);
      const timer2 = setTimeout(() => setShowSequence(0), 13000);
      const timer3 = setTimeout(() => setShowSequence(2), 13500);
      const timer4 = setTimeout(() => setShowSequence(0), 26500);
      const timer5 = setTimeout(() => setShowSequence(3), 27000);
      const timer6 = setTimeout(() => setShowChat(true), 40000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        oscillator.disconnect();
        gainNode.disconnect();
      };
    }
  }, [isReady]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('привет') || input.includes('здравствуй')) {
      return '🎉 Рад тебя видеть! Чем могу помочь?';
    }
    if (input.includes('как дела') || input.includes('как ты')) {
      return '😊 Отлично! Готов помогать. А у тебя как?';
    }
    if (input.includes('2017') || input.includes('2024') || input.includes('2025')) {
      return '📅 Каждый год приносит что-то новое. Главное — двигаться вперёд!';
    }
    
    return '🤔 Интересно! Расскажи подробнее.';
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="gradient-90s p-6 retro-border border-primary">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-shadow-retro mb-2">
              🤖 AI ЧАТ-БОТ 2027
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Система активна • Готов к диалогу
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[70%] p-4 retro-border ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-secondary'
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed break-words">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-primary p-4 bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Напиши сообщение..."
                className="flex-1 retro-border border-primary bg-input"
              />
              <Button
                onClick={handleSendMessage}
                className="retro-button bg-primary hover:bg-primary/90 border-primary px-6"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-accent px-4 py-2 retro-border border-accent text-accent-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
          <span className="text-xs font-bold">ОНЛАЙН</span>
        </div>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {showSequence === 1 && (
          <h1 className="text-4xl md:text-7xl font-bold text-primary text-shadow-retro text-center animate-fade-in px-4">
            МЫ ГОТОВЫ! 🚀
          </h1>
        )}
        {showSequence === 2 && (
          <h1 className="text-3xl md:text-6xl font-bold text-secondary text-shadow-retro text-center animate-fade-in px-4">
            2017 был лучшим для меня
          </h1>
        )}
        {showSequence === 3 && (
          <h1 className="text-3xl md:text-6xl font-bold text-accent text-shadow-retro text-center animate-fade-in px-4">
            2024 год был худшим, а 2025 год еще посмотрим
          </h1>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="gradient-90s p-6 retro-border border-primary">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-shadow-retro mb-2">🤖 AI ЧАТ-БОТ 2025</h1>
          <p className="text-white/90 text-sm md:text-base">
            Запуск через 56 минут • Поработаем!
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Card className="p-8 md:p-12 retro-border border-primary bg-card animate-fade-in">
            <div className="text-center mb-8">
              <Icon name="Timer" size={60} className="mx-auto text-primary mb-4 animate-pulse" />
              <h2 className="text-2xl md:text-4xl font-bold text-primary text-shadow-retro mb-2">
                ОБРАТНЫЙ ОТСЧЁТ
              </h2>
              <p className="text-muted-foreground">до запуска ИИ-системы</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="retro-border border-primary bg-gradient-90s p-6 text-center">
                <div className="text-4xl md:text-6xl font-bold text-white text-shadow-retro mb-2">
                  {timeLeft.days}
                </div>
                <div className="text-sm md:text-base text-white/90 font-bold">ДНЕЙ</div>
              </div>

              <div className="retro-border border-secondary bg-gradient-90s p-6 text-center">
                <div className="text-4xl md:text-6xl font-bold text-white text-shadow-retro mb-2">
                  {timeLeft.hours}
                </div>
                <div className="text-sm md:text-base text-white/90 font-bold">ЧАСОВ</div>
              </div>

              <div className="retro-border border-accent bg-gradient-90s p-6 text-center">
                <div className="text-4xl md:text-6xl font-bold text-white text-shadow-retro mb-2">
                  {timeLeft.minutes}
                </div>
                <div className="text-sm md:text-base text-white/90 font-bold">МИНУТ</div>
              </div>

              <div className="retro-border border-primary bg-gradient-90s p-6 text-center">
                <div className="text-4xl md:text-6xl font-bold text-white text-shadow-retro mb-2">
                  {timeLeft.seconds}
                </div>
                <div className="text-sm md:text-base text-white/90 font-bold">СЕКУНД</div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-6 retro-border border-secondary bg-card/50">
                <div className="flex items-start gap-4">
                  <Icon name="Brain" size={32} className="text-secondary flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-secondary mb-2">ОБУЧЕНИЕ НЕЙРОСЕТИ</h3>
                    <div className="w-full bg-muted retro-border border-muted h-4 mb-2">
                      <div className="bg-secondary h-full animate-pulse" style={{ width: '78%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground">78% завершено</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 retro-border border-accent bg-card/50">
                <div className="flex items-start gap-4">
                  <Icon name="Database" size={32} className="text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-accent mb-2">БАЗА ЗНАНИЙ</h3>
                    <div className="w-full bg-muted retro-border border-muted h-4 mb-2">
                      <div className="bg-accent h-full animate-pulse" style={{ width: '92%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground">92% завершено</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 retro-border border-primary bg-card/50">
                <div className="flex items-start gap-4">
                  <Icon name="Zap" size={32} className="text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-primary mb-2">ОПТИМИЗАЦИЯ</h3>
                    <div className="w-full bg-muted retro-border border-muted h-4 mb-2">
                      <div className="bg-primary h-full animate-pulse" style={{ width: '85%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground">85% завершено</p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-accent px-4 py-2 retro-border border-accent text-accent-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
        <span className="text-xs font-bold">АЛЬФА 0</span>
      </div>
    </div>
  );
};

export default Index;