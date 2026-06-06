export const RANGES_100BB = {
  RFI: {
    UTG: {
      'AA': { action: 'Raise', size: 2.5, ev: '+2.45' },
      'AKs': { action: 'Raise', size: 2.5, ev: '+1.80' },
      '77': { action: 'Raise', size: 2.5, ev: '+0.50' },
      'A5s': { action: 'Raise', size: 2.5, ev: '+0.10' }, 
      '72o': { action: 'Fold', ev: '-0.10' }
    },
    BTN: {
      'AA': { action: 'Raise', size: 2.5, ev: '+2.45' },
      'AKs': { action: 'Raise', size: 2.5, ev: '+1.80' },
      'AKo': { action: 'Raise', size: 2.5, ev: '+1.40' },
      'J9o': { action: 'Raise', size: 2.5, ev: '+0.20' },
      '54s': { action: 'Raise', size: 2.5, ev: '+0.15' }
    },
  },
  FACING_OPEN: {
    BTN: {
      UTG: {
        'AA':  { action: '3-Bet', size: 7.5, ev: '+5.10' },
        'KK':  { action: '3-Bet', size: 7.5, ev: '+3.80' },
        'AKs': { action: '3-Bet', size: 7.5, ev: '+2.20' },
        'AQo': { action: 'Call', ev: '+0.45' },
        'JTs': { action: 'Call', ev: '+0.15' },
        '22':  { action: 'Call', ev: '+0.10' },
        'AJo': { action: 'Fold', ev: '-0.10' },
        '72o': { action: 'Fold', ev: '0.00' }
      },
      CO: {
        'AJo': { action: '3-Bet', size: 7.5, ev: '+0.80' },
        'JTs': { action: '3-Bet', size: 7.5, ev: '+0.40' }
      }
    }
  }
};