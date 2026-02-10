/**
 * Genera datos de prueba para el dashboard
 * Solo para demostración - se puede eliminar en producción
 */

/**
 * Crea transacciones de ejemplo para un usuario
 */
export const createSampleTransactions = (userId, country) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const transactions = [];

  // Depósito pendiente (más reciente)
  if (country === 'CO') {
    transactions.push({
      id: `tx_${Date.now()}_1`,
      userId,
      type: 'deposit',
      amount: 100000,
      status: 'pending',
      createdAt: now.toISOString(),
    });

    // Inversión activa
    transactions.push({
      id: `tx_${Date.now()}_2`,
      userId,
      type: 'investment',
      amount: 50000,
      status: 'active',
      createdAt: yesterday.toISOString(),
    });

    // Ganancia diaria aprobada
    transactions.push({
      id: `tx_${Date.now()}_3`,
      userId,
      type: 'daily_return',
      amount: 8600,
      status: 'approved',
      createdAt: twoDaysAgo.toISOString(),
    });
  } else if (country === 'PE') {
    transactions.push({
      id: `tx_${Date.now()}_1`,
      userId,
      type: 'deposit',
      amount: 260,
      status: 'pending',
      createdAt: now.toISOString(),
    });

    transactions.push({
      id: `tx_${Date.now()}_2`,
      userId,
      type: 'investment',
      amount: 130,
      status: 'active',
      createdAt: yesterday.toISOString(),
    });

    transactions.push({
      id: `tx_${Date.now()}_3`,
      userId,
      type: 'daily_return',
      amount: 22,
      status: 'approved',
      createdAt: twoDaysAgo.toISOString(),
    });
  }

  return transactions;
};

/**
 * Crea inversiones de ejemplo para un usuario
 */
export const createSampleInvestments = (userId, country) => {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 30);

  const investments = [];

  if (country === 'CO') {
    investments.push({
      id: `inv_${Date.now()}_1`,
      userId,
      planId: 'starter',
      planName: 'Plan Starter',
      amount: 50000,
      dailyReturn: 8600,
      duration: 30,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: now.toISOString(),
    });
  } else if (country === 'PE') {
    investments.push({
      id: `inv_${Date.now()}_1`,
      userId,
      planId: 'starter',
      planName: 'Plan Starter',
      amount: 130,
      dailyReturn: 22,
      duration: 30,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: now.toISOString(),
    });
  }

  return investments;
};

/**
 * Inicializa datos de prueba para un nuevo usuario
 * Se llama opcionalmente después del registro
 */
export const initializeSampleData = (user) => {
  const transKey = `moneta_transactions_${user.id}`;
  const invKey = `moneta_investments_${user.id}`;

  // Solo crear datos si no existen
  if (!localStorage.getItem(transKey)) {
    const sampleTransactions = createSampleTransactions(user.id, user.country);
    localStorage.setItem(transKey, JSON.stringify(sampleTransactions));
  }

  if (!localStorage.getItem(invKey)) {
    const sampleInvestments = createSampleInvestments(user.id, user.country);
    localStorage.setItem(invKey, JSON.stringify(sampleInvestments));
  }
};
