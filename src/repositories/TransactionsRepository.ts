import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomes = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomes = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const totalIncome = incomes.reduce(function sum(accumulator, currentValue) {
      return accumulator + currentValue.value;
    }, 0);
    const totalOutcome = outcomes.reduce(function sum(
      accumulator,
      currentValue,
    ) {
      return accumulator + currentValue.value;
    },
    0);

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }

  public create(transaction: Transaction): Transaction {
    const balance = this.getBalance();

    if (
      transaction.type === 'outcome' &&
      balance.total - transaction.value < 0
    ) {
      throw Error('This transaction is above your limit.');
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
