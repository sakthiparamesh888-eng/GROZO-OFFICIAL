import {
  IconLeaf,
  IconTruck,
  IconTag,
  IconCheck
} from './icons.jsx';

const REASONS = [
  {
    icon: IconLeaf,
    title: 'Direct From Farmers',
    text: 'Sourced straight from Ooty & Thondamuthur growers — no middlemen.'
  },
  {
    icon: IconTruck,
    title: 'No Delivery Charges',
    text: 'What you see is what you pay. Delivery is always on us.'
  },
  {
    icon: IconCheck,
    title: 'No Unwanted Stickers',
    text: 'Just clean, honest produce — no labels you have to peel off.'
  },
  {
    icon: IconTag,
    title: 'No Extra Packing Costs',
    text: 'We skip the fancy plastic so you pay only for the food.'
  },
  {
    icon: IconLeaf,
    title: 'Fresh Daily',
    text: 'We upload real photos of today’s harvest — never stock images.'
  },
  {
    icon: IconTag,
    title: 'Affordable Prices',
    text: 'Lower than the big grocery apps, because the chain is shorter.'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="section" id="why-choose-us">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Why GROZO</span>
            <h2 className="section-title">Why Choose Us</h2>
          </div>
        </div>
        <div className="why-grid">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <div className="why-card fade-up" key={i} style={{ animationDelay: `${i * 40}ms` }}>
                <div className="why-icon">
                  <Icon />
                </div>
                <h4>{r.title}</h4>
                <p>{r.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
