import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type TabType = 'chat' | 'settings' | 'analytics' | 'knowledge';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface Lead {
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '👋 Привет! Я твой виртуальный помощник! Как тебя зовут?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isCollectingLead, setIsCollectingLead] = useState(false);

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
    if (input.includes('помощь') || input.includes('помоги')) {
      return '💡 Я могу помочь тебе с вопросами о наших услугах. Хочешь оставить заявку?';
    }
    if (input.includes('заявка') || input.includes('контакт')) {
      setIsCollectingLead(true);
      return '📝 Отлично! Заполни форму ниже, и я передам твои данные менеджеру!';
    }
    if (input.includes('цена') || input.includes('стоимость')) {
      return '💰 Цены начинаются от 1000₽. Оставь заявку для точного расчета!';
    }
    
    return '🤔 Интересный вопрос! Могу предложить оставить заявку для связи с менеджером.';
  };

  const handleSubmitLead = () => {
    if (!leadForm.name || !leadForm.email) {
      toast.error('Заполни имя и email!');
      return;
    }

    const newLead: Lead = {
      ...leadForm,
      timestamp: new Date(),
    };

    setLeads([...leads, newLead]);
    setLeadForm({ name: '', email: '', phone: '', message: '' });
    setIsCollectingLead(false);
    
    toast.success('✅ Заявка отправлена!');

    const confirmMessage: Message = {
      id: messages.length + 1,
      text: `✨ Спасибо, ${newLead.name}! Твоя заявка принята. Скоро свяжемся!`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([...messages, confirmMessage]);
  };

  const renderChat = () => (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-[70%] p-3 retro-border ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-secondary'
              }`}
            >
              <p className="text-sm leading-relaxed break-words">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isCollectingLead && (
          <Card className="p-4 retro-border border-accent bg-card animate-fade-in">
            <h3 className="text-sm font-bold mb-4 text-accent">📋 ФОРМА ЗАЯВКИ</h3>
            <div className="space-y-3">
              <Input
                placeholder="Твоё имя *"
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                className="retro-border border-muted"
              />
              <Input
                type="email"
                placeholder="Email *"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                className="retro-border border-muted"
              />
              <Input
                type="tel"
                placeholder="Телефон"
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                className="retro-border border-muted"
              />
              <Textarea
                placeholder="Сообщение"
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                className="retro-border border-muted"
              />
              <Button
                onClick={handleSubmitLead}
                className="w-full retro-button bg-accent hover:bg-accent/90 border-accent"
              >
                ОТПРАВИТЬ
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="p-4 border-t-2 border-primary bg-card">
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
  );

  const renderAnalytics = () => (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-primary text-shadow-retro">📊 АНАЛИТИКА</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 retro-border border-primary bg-card text-center">
          <div className="text-4xl font-bold text-primary mb-2">{messages.length}</div>
          <p className="text-sm text-muted-foreground">ВСЕГО СООБЩЕНИЙ</p>
        </Card>
        
        <Card className="p-6 retro-border border-secondary bg-card text-center">
          <div className="text-4xl font-bold text-secondary mb-2">{leads.length}</div>
          <p className="text-sm text-muted-foreground">СОБРАНО ЛИДОВ</p>
        </Card>
        
        <Card className="p-6 retro-border border-accent bg-card text-center">
          <div className="text-4xl font-bold text-accent mb-2">
            {leads.length > 0 ? Math.round((leads.length / messages.length) * 100) : 0}%
          </div>
          <p className="text-sm text-muted-foreground">КОНВЕРСИЯ</p>
        </Card>
      </div>

      <Card className="p-6 retro-border border-primary bg-card">
        <h3 className="text-sm font-bold mb-4 text-primary">📈 ГРАФИК АКТИВНОСТИ</h3>
        <div className="flex items-end justify-around h-40 gap-2">
          {[65, 85, 45, 95, 75, 55, 80].map((height, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-90s retro-border border-primary transition-all hover:opacity-80"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-around mt-2 text-xs text-muted-foreground">
          <span>ПН</span>
          <span>ВТ</span>
          <span>СР</span>
          <span>ЧТ</span>
          <span>ПТ</span>
          <span>СБ</span>
          <span>ВС</span>
        </div>
      </Card>

      <Card className="p-6 retro-border border-secondary bg-card">
        <h3 className="text-sm font-bold mb-4 text-secondary">🎯 ПОСЛЕДНИЕ ЛИДЫ</h3>
        {leads.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Пока нет лидов</p>
        ) : (
          <div className="space-y-3">
            {leads.slice(-5).reverse().map((lead, idx) => (
              <div key={idx} className="p-3 bg-muted retro-border border-muted">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">{lead.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {lead.timestamp.toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
                {lead.phone && <p className="text-sm text-muted-foreground">{lead.phone}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-primary text-shadow-retro">⚙️ НАСТРОЙКИ</h2>
      
      <Card className="p-6 retro-border border-primary bg-card">
        <h3 className="text-sm font-bold mb-4 text-primary">🤖 НАСТРОЙКИ БОТА</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Имя бота</label>
            <Input defaultValue="AI Помощник 2025" className="retro-border border-muted" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Приветственное сообщение</label>
            <Textarea
              defaultValue="👋 Привет! Я твой виртуальный помощник!"
              className="retro-border border-muted"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 retro-border border-secondary bg-card">
        <h3 className="text-sm font-bold mb-4 text-secondary">🔗 ИНТЕГРАЦИИ</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted retro-border border-muted">
            <span className="text-sm">CRM Система</span>
            <Button size="sm" variant="outline" className="retro-button border-primary">
              ПОДКЛЮЧИТЬ
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted retro-border border-muted">
            <span className="text-sm">Email рассылка</span>
            <Button size="sm" variant="outline" className="retro-button border-primary">
              ПОДКЛЮЧИТЬ
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted retro-border border-muted">
            <span className="text-sm">Telegram</span>
            <Button size="sm" variant="outline" className="retro-button border-primary">
              ПОДКЛЮЧИТЬ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderKnowledge = () => (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-primary text-shadow-retro">📚 БАЗА ЗНАНИЙ</h2>
      
      <Card className="p-6 retro-border border-accent bg-card">
        <h3 className="text-sm font-bold mb-4 text-accent">➕ ДОБАВИТЬ СТАТЬЮ</h3>
        <div className="space-y-3">
          <Input placeholder="Заголовок" className="retro-border border-muted" />
          <Textarea placeholder="Содержание статьи..." className="retro-border border-muted" rows={6} />
          <Button className="retro-button bg-accent hover:bg-accent/90 border-accent">
            СОХРАНИТЬ
          </Button>
        </div>
      </Card>

      <Card className="p-6 retro-border border-primary bg-card">
        <h3 className="text-sm font-bold mb-4 text-primary">📖 СТАТЬИ</h3>
        <div className="space-y-3">
          {['Как работает чат-бот?', 'Интеграция с CRM', 'Настройка автоответов'].map((title, idx) => (
            <div key={idx} className="p-4 bg-muted retro-border border-muted hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="font-medium">{title}</span>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-90s p-6 retro-border border-primary">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-shadow-retro mb-2">
            🤖 AI ЧАТ-БОТ 2027
          </h1>
          <p className="text-white/90 text-sm">Запуск: 12 декабря 2027 года • Поработаем!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: 'chat', label: 'ЧАТ', icon: 'MessageSquare' },
            { id: 'analytics', label: 'АНАЛИТИКА', icon: 'BarChart3' },
            { id: 'settings', label: 'НАСТРОЙКИ', icon: 'Settings' },
            { id: 'knowledge', label: 'БАЗА ЗНАНИЙ', icon: 'BookOpen' },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`retro-button flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary border-primary'
                  : 'bg-muted border-muted hover:bg-muted/80'
              }`}
            >
              <Icon name={tab.icon as any} size={16} className="mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        <Card className="retro-border border-primary bg-card overflow-hidden">
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'knowledge' && renderKnowledge()}
        </Card>
      </div>

      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-accent px-4 py-2 retro-border border-accent text-accent-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
        <span className="text-xs font-bold">АЛЬФА 0</span>
      </div>
    </div>
  );
};

export default Index;