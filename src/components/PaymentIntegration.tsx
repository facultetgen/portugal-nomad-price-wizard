
import React, { useState } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface PaymentIntegrationProps {
  total: number;
  currency: string;
  onPayment: (method: string, amount: number) => void;
  isProcessing: boolean;
}

export const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  total,
  currency,
  onPayment,
  isProcessing
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'rub',
      name: 'Оплатить рубли',
      icon: '₽',
      color: 'from-blue-500 to-blue-600',
      description: 'Оплата российскими рублями через СБП или банковскую карту'
    },
    {
      id: 'eur',
      name: 'Оплатить евро',
      icon: '€',
      color: 'from-green-500 to-green-600',
      description: 'Оплата в евро через SEPA или международную карту'
    },
    {
      id: 'crypto',
      name: 'Оплатить крипто',
      icon: '₿',
      color: 'from-purple-500 to-purple-600',
      description: 'Оплата криптовалютой (BTC, ETH, USDT)'
    }
  ];

  const getConvertedAmount = (methodId: string) => {
    const rates = { rub: 100, eur: 1, crypto: 0.000015 }; // Примерные курсы
    const symbols = { rub: '₽', eur: '€', crypto: '₿' };
    
    return {
      amount: (total * rates[methodId as keyof typeof rates]).toFixed(methodId === 'crypto' ? 6 : 2),
      symbol: symbols[methodId as keyof typeof symbols]
    };
  };

  const handlePayment = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowDetails(true);
    
    // Симуляция процесса оплаты
    setTimeout(() => {
      onPayment(methodId, total);
      setShowDetails(false);
      setSelectedMethod('');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const converted = getConvertedAmount(method.id);
          const isSelected = selectedMethod === method.id;
          
          return (
            <div key={method.id} className="relative">
              <button
                onClick={() => handlePayment(method.id)}
                disabled={isProcessing}
                className={`w-full p-4 rounded-2xl bg-gradient-to-r ${method.color} text-white font-light 
                  shadow-2xl transition-all duration-300 active:scale-95 hover:-translate-y-0.5
                  ${isSelected ? 'ring-4 ring-white/50' : ''} 
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs opacity-80">{method.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {converted.amount} {converted.symbol}
                    </div>
                    <div className="text-xs opacity-80">
                      ≈ {total}€
                    </div>
                  </div>
                </div>
              </button>

              {/* Payment Processing Animation */}
              {isSelected && showDetails && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-white">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span className="font-light">Обработка платежа...</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Security Info */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-50/80 backdrop-blur-xl">
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-green-500">🔒</span>
          <span className="text-xs font-light">
            Все платежи защищены 256-битным SSL шифрованием
          </span>
        </div>
      </div>
    </div>
  );
};
