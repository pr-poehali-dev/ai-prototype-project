import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isReady, setIsReady] = useState(false);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-90s p-6 retro-border border-primary">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-shadow-retro mb-2">
            🤖 AI ЧАТ-БОТ 2027
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            Запуск: 12 декабря 2025 года • Поработаем!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {isReady ? (
            <Card className="p-8 md:p-12 retro-border border-accent bg-card text-center animate-fade-in">
              <div className="mb-8">
                <Icon name="Rocket" size={80} className="mx-auto text-accent mb-4" />
                <h2 className="text-4xl md:text-6xl font-bold text-accent text-shadow-retro mb-4">
                  МЫ ГОТОВЫ! 🚀
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  ИИ активирован и готов к работе
                </p>
              </div>
              
              <Button className="retro-button bg-accent hover:bg-accent/90 border-accent px-8 py-6 text-xl">
                ЗАПУСТИТЬ СИСТЕМУ
              </Button>
            </Card>
          ) : (
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
                    <div>
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
                    <div>
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
                    <div>
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
          )}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-accent px-4 py-2 retro-border border-accent text-accent-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
        <span className="text-xs font-bold">АЛЬФА 0</span>
      </div>
    </div>
  );
};

export default Index;