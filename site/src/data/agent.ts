// Joey's details: the one place they live. Every page reads them from here.
export const agent = {
  name: 'Joey Lee',
  role: 'Real Estate Negotiator',
  ren: 'REN 80914',
  agency: 'IQI Realty Sdn Bhd',
  // The agency's Board of Valuers firm number, "E (1) ####". Malaysian property ads must show it
  // beside the REN. Empty until Joey confirms it; the footer then shows it automatically.
  agencyReg: '',
  // Agency's company (SSM) registration, as given by El on 12 Oct 2026.
  company: { name: 'IQI Holdings Sdn Bhd', reg: '201201034354 (1018842-U)' },
  whatsapp: '601165039733', // wa.me format: country code + number, digits only
  tel: '+601165039733',
  phone: '+60 11-6503 9733',
  instagram: { handle: '@joeyjbproperty', url: 'https://www.instagram.com/joeyjbproperty/' },
  // From Joey's Instagram bio
  line: 'Helping you find your perfect home in JB.',
  lineZh: '陪你找到属于你的JB家',
};

export const site = {
  name: 'Ask Joey',
  tagline: 'New homes by the Causeway, for Singapore buyers',
};
