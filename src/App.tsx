import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, Compass, ExternalLink, Leaf, Menu as MenuIcon, MessageCircle, Star, Utensils, Wheat, Wine, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const IFOOD_URL = 'https://www.ifood.com.br/delivery/curitiba-pr/o-barba-pizza-centro/a39e545d-f5f9-412f-b234-5ebdade61976';
const WHATSAPP_URL = 'https://wa.me/5541991240301';
const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=O+Barba+Pizza+R.+Dr.+Faivre+581+Curitiba';

type MenuCategory = 'Todas' | 'Pizzas' | 'Doces' | 'Entradas' | 'Extras';
type MenuItem = { name: string; description: string; price: string; category: Exclude<MenuCategory, 'Todas'>; tags?: string[] };

const menuItems: MenuItem[] = [
  { name: 'Corn&Bacon', description: 'Milho, bacon e aquele contraste doce-salgado que pede mais uma fatia.', price: 'R$ 46', category: 'Pizzas' },
  { name: 'Pirate', description: 'Um dos clássicos da casa, com personalidade de quem não pede licença.', price: 'R$ 44', category: 'Pizzas' },
  { name: 'Tio Peppe', description: 'Intenso, aromático e feito para acompanhar uma boa conversa.', price: 'R$ 48', category: 'Pizzas' },
  { name: 'Mary Read', description: 'Uma escolha de respeito para quem gosta de sabores bem resolvidos.', price: 'R$ 43', category: 'Pizzas' },
  { name: 'Edward Low', description: 'Recheio generoso, borda leve e final que fica na memória.', price: 'R$ 46', category: 'Pizzas' },
  { name: "Grace O'Malley", description: 'A capitã da mesa: disponível também no tamanho grande por R$ 87.', price: 'R$ 45', category: 'Pizzas' },
  { name: 'William Kidd', description: 'Equilíbrio entre o familiar e o inesperado.', price: 'R$ 44', category: 'Pizzas' },
  { name: 'Captain Hook', description: 'Uma fatia puxa a outra. Sem promessas, só evidências.', price: 'R$ 44', category: 'Pizzas' },
  { name: 'Barbinha', description: 'A escolha carinhosa da casa para dividir — ou não.', price: 'R$ 46', category: 'Pizzas' },
  { name: 'Henry Morgan', description: 'Direta ao ponto, com preço camarada e massa de longa fermentação.', price: 'R$ 41', category: 'Pizzas' },
  { name: 'Phillipe Bequel', description: 'Leve no nome, marcante no prato.', price: 'R$ 40', category: 'Pizzas' },
  { name: 'Black Bart', description: 'Doce para fechar o mapa da noite.', price: 'R$ 47', category: 'Doces' },
  { name: "Bento's Pirate", description: 'Uma sobremesa com sotaque de aventura.', price: 'R$ 44', category: 'Doces' },
  { name: 'Captain Nina', description: 'A última parada antes de declarar a noite encerrada.', price: 'R$ 43', category: 'Doces' },
  { name: 'Crostini tradicional', description: 'Para começar enquanto a pizza se prepara.', price: 'R$ 32', category: 'Entradas' },
  { name: 'Alho, picante ou vegan', description: 'Garlic mayo, molho picante e maionese de alho vegana.', price: 'R$ 6 cada', category: 'Extras', tags: ['3 opções'] },
];

const drinks = [
  { name: 'Coca-Cola 310 ml', note: 'A clássica, bem gelada', price: 'R$ 8' },
  { name: 'Coca-Cola Zero 310 ml', note: 'Para manter o foco na pizza', price: 'R$ 8' },
  { name: 'Coca-Cola 1 L', note: 'Para a mesa toda', price: 'R$ 15' },
  { name: 'Chope & vinho', note: 'A seleção disponível aparece no iFood ou na casa', price: 'consultar' },
];

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function BrandMark() {
  return (
    <span className="brand-symbol" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="25" height="25" fill="none">
        <path d="M8.5 10.2c.8-3.5 3.2-5.4 7.5-5.4s6.7 1.9 7.5 5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.4 11.3c.7 7.5 3.5 11.6 8.6 15.1 5.1-3.5 7.9-7.6 8.6-15.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11.5 15.4c.5 3.1 1.9 5.4 4.5 7.3M20.5 15.4c-.5 3.1-1.9 5.4-4.5 7.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const close = () => setIsOpen(false);
  return (
    <nav className={`topbar ${isScrolled ? 'scrolled' : ''}`} aria-label="Navegação principal">
      <div className="container-wide nav-inner">
        <a className="brand-link" href="#inicio" onClick={close} data-testid="link-brand">
          <BrandMark />
          <span className="brand-wordmark">O <span>BARBA</span></span>
        </a>
        <div className="nav-links">
          <a href="#historia" data-testid="link-nav-history">História</a>
          <a href="#cardapio" data-testid="link-nav-menu">Cardápio</a>
          <a href="#harmoniza" data-testid="link-nav-drinks">Harmoniza</a>
          <a href="#local" data-testid="link-nav-location">Onde estamos</a>
        </div>
        <div className="flex items-center gap-3">
          <a className="button-primary" href={IFOOD_URL} target="_blank" rel="noreferrer" data-testid="link-nav-order">Pedir agora <ArrowUpRight size={14} /></a>
          <button className="menu-toggle" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'} data-testid="button-mobile-menu">
            {isOpen ? <X size={25} /> : <MenuIcon size={25} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mobile-nav container-wide">
          <a href="#historia" onClick={close} data-testid="link-mobile-history">História</a>
          <a href="#cardapio" onClick={close} data-testid="link-mobile-menu">Cardápio</a>
          <a href="#harmoniza" onClick={close} data-testid="link-mobile-drinks">Harmoniza</a>
          <a href="#local" onClick={close} data-testid="link-mobile-location">Onde estamos</a>
          <a className="button-primary" href={IFOOD_URL} target="_blank" rel="noreferrer" data-testid="link-mobile-order">Pedir no iFood <ArrowUpRight size={14} /></a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <header className="hero" id="inicio">
      <div className="container-wide hero-grid">
        <div className="reveal">
          <div className="hero-kicker">Centro de Curitiba · desde 2022</div>
          <h1 className="display-title">Pizza feita<br />com <em>tempo.</em></h1>
          <p className="hero-copy">Massa de fermentação longa, sabores com nome de pirata e o par certo para acompanhar. A tripulação entrega no seu endereço.</p>
          <div className="hero-actions">
            <a className="button-primary" href={IFOOD_URL} target="_blank" rel="noreferrer" data-testid="link-hero-order">Pedir no iFood <ArrowUpRight size={15} /></a>
            <a className="button-outline" href="#cardapio" data-testid="link-hero-menu">Explorar o cardápio <ArrowRight size={15} /></a>
          </div>
          <div className="hero-meta">
            <span><strong>30 cm</strong> de pizza</span>
            <span><strong>delivery-first</strong> no Centro</span>
            <span><strong>vegano e não vegano</strong></span>
          </div>
        </div>
        <div className="hero-image-frame reveal" style={{ transitionDelay: '120ms' }}>
         <img className="hero-image" src={`${import.meta.env.BASE_URL}barba-pizza.jpg`} alt="Pizza artesanal de longa fermentação com borda dourada em uma mesa escura" />
          <span className="hero-image-caption">Feita para chegar quente</span>
        </div>
      </div>
    </header>
  );
}

function Story() {
  return (
    <section className="section-space" id="historia">
      <div className="container-wide intro-grid">
        <div className="reveal">
          <div className="eyebrow">01 · Nossa história</div>
          <h2 className="intro-title mt-5">Sem pressa.<br />Sem frescura.</h2>
          <span className="stamp" aria-label="O Barba Pizza desde 2022">O BARBA<br />CURITIBA<br />2022</span>
        </div>
        <div className="intro-copy body-copy reveal" style={{ transitionDelay: '120ms' }}>
          <p>O Barba Pizza nasceu no Centro de Curitiba com uma ideia simples: dar tempo ao que merece tempo. A massa descansa, desenvolve sabor e chega leve — do jeito que uma boa pizza deve ser.</p>
          <p>Os sabores ganharam nomes de pirata porque a casa nunca quis ser séria demais. Aqui, Corn&Bacon divide a mesa com Grace O’Malley, a fatia clássica conversa com a opção vegetal, e toda noite pode virar uma pequena expedição.</p>
          <p>Hoje, o foco é delivery. A cozinha fica na R. Dr. Faivre, perto da UFPR, e a tripulação segue fazendo tudo em ritmo de bairro: massa honesta, forno quente e cuidado na embalagem.</p>
        </div>
      </div>
      <div className="container-wide mt-20 reveal" style={{ transitionDelay: '180ms' }}>
      <img className="w-full object-cover" style={{ height: 'min(440px, 52vw)', minHeight: '260px' }} src={`${import.meta.env.BASE_URL}barba-kitchen.jpg`} alt="Mãos de pizzaiolo abrindo massa ao lado do forno quente" loading="lazy" />
      </div>
    </section>
  );
}

function Craft() {
  const features = [
    { icon: Wheat, title: 'Fermentação longa', text: 'Mais tempo de descanso para uma massa leve, saborosa e com borda que faz barulho na primeira mordida.' },
    { icon: Leaf, title: 'Vegetal de verdade', text: 'A casa abre espaço para escolhas veganas criativas, além dos sabores para quem não abre mão do queijo.' },
    { icon: Wine, title: 'A mesa pede um par', text: 'Chopes, vinhos e refrigerantes para completar a pizza — sem inventar rótulo, só indicando o que está disponível.' },
  ];
  return (
    <section className="dark-section section-space">
      <div className="container-wide">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">02 · O jeito Barba</div>
            <h2 className="section-heading mt-5">O que entra<br />na receita.</h2>
          </div>
          <p className="section-head-copy">Uma cozinha pequena, uma massa que não aceita atalhos e um cardápio que sabe brincar sem perder o sabor.</p>
        </div>
        <div className="feature-grid reveal" style={{ transitionDelay: '120ms' }}>
          {features.map(({ icon: Icon, title, text }, index) => (
            <article className="feature-card" key={title}>
              <span className="feature-number">0{index + 1}</span>
              <Icon className="mt-5 text-[#c88a3a]" size={23} strokeWidth={1.4} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Menu() {
  const [category, setCategory] = useState<MenuCategory>('Todas');
  const categories: MenuCategory[] = ['Todas', 'Pizzas', 'Doces', 'Entradas', 'Extras'];
  const visibleItems = useMemo(() => category === 'Todas' ? menuItems : menuItems.filter((item) => item.category === category), [category]);
  return (
    <section className="section-space" id="cardapio">
      <div className="container-wide">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">03 · Cardápio</div>
            <h2 className="section-heading mt-5">Escolha seu<br /><span className="text-[#b84d31]">tesouro.</span></h2>
          </div>
          <p className="section-head-copy">Sabores do cardápio público atual. As pizzas têm 30 cm e todos os preços abaixo são referências — confirme o valor final e a disponibilidade no iFood.</p>
        </div>
        <div className="filter-row reveal" style={{ transitionDelay: '80ms' }} role="tablist" aria-label="Filtrar cardápio">
          {categories.map((item) => (
            <button className={`filter-button ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} key={item} role="tab" aria-selected={category === item} data-testid={`button-filter-${item.toLowerCase()}`}>{item}</button>
          ))}
        </div>
        <div className="menu-grid" role="tabpanel">
          {visibleItems.map((item) => (
            <article className="menu-item reveal" key={item.name} data-testid={`menu-item-${item.name.toLowerCase().replaceAll(' ', '-')}`}>
              <div>
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-desc">{item.description}</p>
                {item.tags && <div className="menu-tags">{item.tags.map((tag) => <span className="menu-tag" key={tag}>{tag}</span>)}</div>}
              </div>
              <span className="menu-item-price" data-testid={`text-price-${item.name.toLowerCase().replaceAll(' ', '-')}`}>{item.price}</span>
            </article>
          ))}
        </div>
        <div className="price-note reveal">REFERÊNCIA DE CARDÁPIO PÚBLICO · VALORES E DISPONIBILIDADE PODEM MUDAR</div>
        <a className="button-primary mt-8 reveal" href={IFOOD_URL} target="_blank" rel="noreferrer" data-testid="link-menu-order">Ver disponibilidade e pedir <ArrowUpRight size={15} /></a>
      </div>
    </section>
  );
}

function Pairing() {
  return (
    <section className="dark-section section-space" id="harmoniza">
      <div className="container-wide pairing-layout">
        <div className="reveal">
          <div className="eyebrow">04 · Para beber</div>
          <h2 className="pairing-title mt-5">A pizza<br />não navega<br /><em>sozinha.</em></h2>
          <p className="section-head-copy mt-7">A carta de bebidas varia. Para ver o que está disponível agora, consulte o iFood ou pergunte direto à casa.</p>
        </div>
        <div className="drink-list reveal" style={{ transitionDelay: '130ms' }}>
          {drinks.map((drink) => (
            <div className="drink-item" key={drink.name}>
              <div><h3>{drink.name}</h3><p>{drink.note}</p></div>
              <span className="drink-price">{drink.price}</span>
            </div>
          ))}
          <div className="mt-6 flex items-center gap-3 text-[#d4b35e] font-mono-ui text-[.68rem] uppercase tracking-[.1em]"><Utensils size={16} /> Peça seu par junto no iFood</div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { quote: 'A pizza vegana com flor de abobrinha é surpreendente — melhor pizza vegana que já comi.', source: 'Cliente · HappyCow' },
    { quote: 'Atendimento rápido e simpático, ótima carta de vinhos, ambiente super agradável.', source: 'Cliente · Google' },
    { quote: 'A pizza de batata é sensacional, e o chope na torneira sempre bem gelado.', source: 'Cliente · Untappd' },
  ];
  return (
    <section className="dark-section section-space border-t border-[#d6c8ad]/15">
      <div className="container-wide review-layout">
        <div className="reveal">
          <div className="eyebrow">05 · Quem já embarcou</div>
          <h2 className="review-lead mt-5">A melhor parte é ouvir quem provou.</h2>
        </div>
        <div className="review-list reveal" style={{ transitionDelay: '120ms' }}>
          {reviews.map((review, index) => (
            <article className="review-card" key={review.source}>
              <div className="review-stars" aria-label="5 de 5 estrelas"><Star size={12} fill="currentColor" className="inline" /><Star size={12} fill="currentColor" className="inline" /><Star size={12} fill="currentColor" className="inline" /><Star size={12} fill="currentColor" className="inline" /><Star size={12} fill="currentColor" className="inline" /></div>
              <p className="review-quote mt-8">“{review.quote}”</p>
              <span className="review-source mt-7">0{index + 1} · {review.source}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section className="section-space" id="local">
      <div className="container-wide location-grid">
        <div className="reveal">
          <div className="eyebrow">06 · Onde estamos</div>
          <h2 className="section-heading mt-5">No meio do<br />Centro.</h2>
          <div className="details">
            <div className="detail-row">
              <span className="detail-label">Endereço</span>
              <div className="detail-value">R. Dr. Faivre, 581 <small>Centro, Curitiba – PR · perto da UFPR</small></div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Atendimento</span>
              <div className="detail-value">Delivery-first <small>Listagens públicas indicam terça a domingo, 18h30–00h. Confirme o horário atual no iFood.</small></div>
            </div>
            <div className="detail-row">
              <span className="detail-label">Eventos</span>
              <div className="detail-value"><a className="underline decoration-[#b84d31]/40 underline-offset-4" href={WHATSAPP_URL} target="_blank" rel="noreferrer" data-testid="link-location-whatsapp">+55 41 99124-0301</a><small>Catering, eventos e encomendas maiores</small></div>
            </div>
          </div>
        </div>
        <div className="map-card reveal" style={{ transitionDelay: '120ms' }}>
          <div className="map-top"><Compass size={15} className="inline mr-2" /> Centro de Curitiba</div>
          <div className="map-bottom">
            <strong>R. Dr. Faivre, 581</strong>
            <span>Uma rota curta até uma pizza longa.</span>
            <a className="button-outline mt-6 border-[#d6c8ad]/45 !text-[#f2ead7]" href={MAP_URL} target="_blank" rel="noreferrer" data-testid="link-open-map">Abrir no mapa <ExternalLink size={14} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <>
      <section className="final-cta">
        <div className="container-wide final-cta-content reveal">
          <div className="eyebrow !text-[#f4d46d]">07 · A próxima fatia é sua</div>
          <h2 className="mt-6">Forno quente.<br /><em>Mar calmo.</em></h2>
          <p>Escolha seu sabor, chame a tripulação e deixe o Centro de Curitiba levar a noite até a sua porta.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a className="button-dark" href={IFOOD_URL} target="_blank" rel="noreferrer" data-testid="link-final-order">Pedir no iFood <ArrowUpRight size={15} /></a>
            <a className="button-outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer" data-testid="link-final-events"><MessageCircle size={15} /> Falar sobre eventos</a>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container-wide footer-inner">
          <p>© 2026 O Barba Pizza · Centro, Curitiba</p>
          <p><a href="#inicio" data-testid="link-footer-top">Voltar ao topo <ArrowRight size={12} className="inline ml-1" /></a></p>
        </div>
      </footer>
    </>
  );
}

function Home() {
  useScrollReveal();
  return (
    <div className="site-shell noise">
      <Nav />
      <Hero />
      <div className="strip" aria-label="Informações rápidas">
        <div className="container-wide strip-track"><span>Fermentação longa</span><i className="strip-dot" /><span>30 cm</span><i className="strip-dot" /><span>Centro · Curitiba</span><i className="strip-dot" /><span>Peça no iFood</span><i className="strip-dot" /><span>Fermentação longa</span></div>
      </div>
      <Story />
      <Craft />
      <Menu />
      <Pairing />
      <Reviews />
      <Location />
      <FinalCta />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;