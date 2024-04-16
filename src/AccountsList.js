import { useCallback } from 'react';
import {
  calculateProratedAccountInput,
  calculateSelectedAccountsTotal,
  updateAccountInputsToProratedAmounts,
  sumSelectedAccountsInputBalance,
} from './utils';
import { formatMoney } from './formatters';
import { ValidationErrorComponent } from './formValidations';

const AccountsList = ({
  accountsData,
  setAccountsData,
  paymentAmount,
  setFormValues,
  formValidations,
  handlePaymentAmountValidation,
  handleAccountBalancesValidation,
}) => {
  const selectedAccounts = accountsData.filter(
    (account) => account.checked
  ).length;

  const totalBalance = accountsData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.balance,
    0
  );

  // Updates the state of accounts checked + prorates individual account balances
  const onSelectCheckboxHandler = useCallback(
    (index) => {
      const newAccountsData = accountsData.map((account, currIndex) =>
        currIndex === index
          ? { ...account, checked: !account.checked }
          : account
      );
      const selectedTotalBalance =
        calculateSelectedAccountsTotal(newAccountsData);

      const updatedAccountsData = updateAccountInputsToProratedAmounts(
        newAccountsData,
        selectedTotalBalance,
        paymentAmount
      );
      setAccountsData(updatedAccountsData);
      handlePaymentAmountValidation(updatedAccountsData, paymentAmount);
      handleAccountBalancesValidation(updatedAccountsData);
    },
    [
      accountsData,
      setAccountsData,
      calculateProratedAccountInput,
      paymentAmount,
      handlePaymentAmountValidation,
      handleAccountBalancesValidation,
    ]
  );

  // Finds and updates the individual account input value the
  // user is interacting with
  const onChangeAccountInputAmount = useCallback(
    (event, index) => {
      setAccountsData(
        accountsData.map((account, currIndex) =>
          currIndex === index
            ? { ...account, inputBalance: event.target.value }
            : account
        )
      );
    },
    [accountsData, setAccountsData]
  );

  // Update the payment amount after the focused is removed from the individual
  // account input. Offers a better UX so dollar values aren't changing every key stroke.
  const onBlurAccountInputAmount = useCallback(() => {
    const newPaymentAmount = sumSelectedAccountsInputBalance(accountsData);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      paymentAmount: newPaymentAmount,
    }));
    handlePaymentAmountValidation(accountsData, newPaymentAmount);
    handleAccountBalancesValidation(accountsData);
  }, [
    accountsData,
    setAccountsData,
    setFormValues,
    handleAccountBalancesValidation,
  ]);

  return (
    <div className="form-section">
      <div className="d-flex-align-center space-between b-margin-16">
        <div className="d-flex">
          <span className="text-base font-semibold r-margin-8">
            Account Lists
          </span>
          <span className="theme text-base">
            {selectedAccounts === 1
              ? `${selectedAccounts} Account Selected`
              : `${selectedAccounts} Accounts Selected`}
          </span>
        </div>
        <div className="d-flex text-base">
          Total Balance: {formatMoney(totalBalance, 'USD', 0)}
        </div>
      </div>
      {accountsData.map((row, idx) => (
        <div
          className="account-row d-flex-align-center space-between"
          key={`row-${idx}-${row.id}`}
        >
          <div className="d-flex-align-center">
            <input
              type="checkbox"
              id={row.id}
              name={row.id}
              value={row.id}
              onChange={() => onSelectCheckboxHandler(idx)}
            />
            <div className="d-flex-column">
              <span className="b-margin-4">{row.name}</span>
              <span className="account-row-balance-text">Balance</span>
              <span className="account-row-balance">
                {formatMoney(row.balance, 'USD', 0)}
              </span>
            </div>
          </div>
          <input
            className="w-30 text-right border-defaut-dark"
            type="number"
            placeholder="$0.00"
            disabled={!row.checked}
            min={0}
            max={row.balance}
            value={row.inputBalance}
            onChange={(e) => onChangeAccountInputAmount(e, idx)}
            onBlur={onBlurAccountInputAmount}
            step={0.01}
          />
        </div>
      ))}
      <div className="h-4">
        {formValidations.accountBalances.showValidation && (
          <ValidationErrorComponent
            errorMessage={formValidations.accountBalances.errorMessage}
          />
        )}
      </div>
    </div>
  );
};

export default AccountsList;
