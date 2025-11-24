import { BusinessCardData } from '../types';

export const generateVCard = (card: BusinessCardData) => {
  const version = '3.0';
  
  // Clean phone numbers
  const cleanPhone = (p: string) => p.replace(/[^0-9+]/g, '');

  // Construct the direct link to this card
  // Using window.location.href to ensure we capture the full path including hash if present
  // But cleaner to just rebuild it based on origin + hash logic
  const cardUrl = `${window.location.origin}/#/${card.slug}`;

  const vCardLines = [
    'BEGIN:VCARD',
    `VERSION:${version}`,
    `FN:${card.fullName}`,
    `N:${card.fullName.split(' ').pop()};${card.fullName.split(' ')[0]};;;`,
    `ORG:${card.companyName}`,
    `TITLE:${card.title}`,
    `TEL;TYPE=CELL:${cleanPhone(card.contact.personalPhone)}`,
    `TEL;TYPE=WORK:${cleanPhone(card.contact.companyPhone)}`,
    `EMAIL:${card.contact.email}`,
    `URL:${card.social.website}`,
    // Explicitly add links to services/projects in the Note field
    `NOTE:${card.tagline} | خدماتنا: ${card.services.map(s => s.name).join(', ')} | رابط المشاريع والملف الرقمي: ${cardUrl}`,
    `ADR;TYPE=WORK:;;${card.contact.location};;;;`,
    'END:VCARD'
  ];

  return vCardLines.join('\n');
};

export const downloadVCard = (card: BusinessCardData) => {
  const vCardData = generateVCard(card);
  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${card.fullName}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};