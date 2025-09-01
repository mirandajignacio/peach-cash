import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../../../storage/transactions';
import { transactionsService } from '../../../services/transactions-service';

const useTransactions = () => {
  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getTransactions(),
  });

  return { transactionsQuery };
};

export { useTransactions };
