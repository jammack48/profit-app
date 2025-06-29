import { QuoteData } from '../types/quote';

export const sampleQuoteData: QuoteData = {
  gstRate: 0.15,
  lineItems: [
    {
      id: '1',
      name: 'Labour - Dave',
      type: 'labour',
      quantity: 6.00,
      cost: 58.00,
      price: 95.00,
      markup: 63.79,
      tax: 15,
      discount: 0
    },
    {
      id: '2',
      name: '33006820 Wall cap 80mm PVC GY EWC80 Ezyduct',
      type: 'material',
      quantity: 1.00,
      cost: 9.68,
      price: 18.17,
      markup: 88.10,
      tax: 15,
      discount: 0
    },
    {
      id: '3',
      name: '33000900 Drain hose flex 16mmx50m FDP16 Ezyduct',
      type: 'material',
      quantity: 0.10,
      cost: 93.59,
      price: 175.95,
      markup: 88.03,
      tax: 15,
      discount: 0
    },
    {
      id: '4',
      name: '37100020 Slab poly 465x885x51mm medium PSAC-MED Polyslab',
      type: 'material',
      quantity: 1.00,
      cost: 41.90,
      price: 78.77,
      markup: 88.00,
      tax: 15,
      discount: 0
    },
    {
      id: '5',
      name: '33000320 Duct 80x66mmx2m PVC GY ECD80 Ezyduct',
      type: 'material',
      quantity: 1.00,
      cost: 20.27,
      price: 38.11,
      markup: 88.01,
      tax: 15,
      discount: 0
    },
    {
      id: '6',
      name: '33000370 Condenser mount PVC 500mm GY ECM500 Ezyduct',
      type: 'material',
      quantity: 2.00,
      cost: 14.51,
      price: 27.28,
      markup: 88.01,
      tax: 15,
      discount: 0
    },
    {
      id: '7',
      name: '55650320 Switch isolator 20A 2P IP66 small NL120S N-line',
      type: 'material',
      quantity: 1.00,
      cost: 12.15,
      price: 22.84,
      markup: 87.98,
      tax: 15,
      discount: 0
    },
    {
      id: '8',
      name: '30800040 Conduit flex 25mm uPVC GY prm 25m 30.25G Marley',
      type: 'material',
      quantity: 5.00,
      cost: 2.17,
      price: 4.08,
      markup: 88.02,
      tax: 15,
      discount: 0
    },
    {
      id: '9',
      name: '41412000 Anchor wall dog 35mm SQ pk26 ELWDSA35SD Elmark',
      type: 'material',
      quantity: 1.00,
      cost: 15.87,
      price: 29.84,
      markup: 88.03,
      tax: 15,
      discount: 0
    },
    {
      id: '10',
      name: '49142020 Tape duct 48mmx30m utility BK 33023024 Tkt Tape',
      type: 'material',
      quantity: 1.00,
      cost: 10.82,
      price: 20.34,
      markup: 87.99,
      tax: 15,
      discount: 0
    },
    {
      id: '11',
      name: '44320220 Cable tie std 280x4.8mm NAT pk100 EL3004 Elmark',
      type: 'material',
      quantity: 0.10,
      cost: 16.46,
      price: 30.94,
      markup: 87.27,
      tax: 15,
      discount: 0
    },
    {
      id: '12',
      name: '48450040 Silicone industrial 300ml CL 30804311 Bostik',
      type: 'material',
      quantity: 0.50,
      cost: 18.08,
      price: 33.99,
      markup: 88.05,
      tax: 15,
      discount: 0
    },
    {
      id: '13',
      name: 'FTXV50U',
      type: 'material',
      quantity: 1.00,
      cost: 1352.00,
      price: 1690.00,
      markup: 25.00,
      tax: 15,
      discount: 0,
      isBigTicket: true,
      maxMarkup: 25
    }
  ]
};