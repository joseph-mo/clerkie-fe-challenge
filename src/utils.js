// Calculation for getting the prorated amount for each selected
// account input
export const calculateProratedAccountInput = (
  accountBalance,
  selectedTotalBalance,
  paymentAmount
) => {
  return (
    (accountBalance / selectedTotalBalance) *
    Number(paymentAmount)
  ).toFixed(2);
};

// Sums up the balances of all selected accounts
export const calculateSelectedAccountsTotal = (accounts) =>
  accounts.reduce(
    (accumulator, currentValue) =>
      currentValue.checked ? accumulator + currentValue.balance : accumulator,
    0
  );

// For all checked accounts, update the input balance to its prorated amount
export const updateAccountInputsToProratedAmounts = (
  accounts,
  selectedTotalBalance,
  paymentAmount
) =>
  accounts.map((account) =>
    account.checked
      ? {
          ...account,
          inputBalance: calculateProratedAccountInput(
            account.balance,
            selectedTotalBalance,
            paymentAmount
          ),
        }
      : { ...account, inputBalance: 0 }
  );

// Sums up the input balances of all selected accounts
export const sumSelectedAccountsInputBalance = (accounts) =>
  accounts.reduce(
    (accumulator, currentValue) =>
      currentValue.checked
        ? accumulator + Number(currentValue.inputBalance)
        : Number(accumulator),
    0
  );
