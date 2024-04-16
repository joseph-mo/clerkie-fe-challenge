import { useState, useCallback, useMemo } from 'react';
import AccountsList from './AccountsList';
import {
  updateAccountInputsToProratedAmounts,
  calculateSelectedAccountsTotal,
} from './utils';
import { ACCOUNT_BALANCE_DATA } from './AccountsData';
import {
  ValidationErrorComponent,
  useFormValidations,
} from './formValidations';

const App = () => {
  const initialValues = {
    accountNumber: '',
    confirmAccountNumber: '',
    routingNumber: '',
    accountType: null,
    paymentAmount: '',
  };
  const initialValidationValues = {
    accountNumber: { showValidation: false, errorMessage: '' },
    confirmAccountNumber: { showValidation: false, errorMessage: '' },
    routingNumber: { showValidation: false, errorMessage: '' },
    accountType: { showValidation: false, errorMessage: '' },
    paymentAmount: { showValidation: false, errorMessage: '' },
    accountBalances: { showValidation: false, errorMessage: '' },
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formValidations, setFormValidations] = useState(
    initialValidationValues
  );
  const [accountsData, setAccountsData] = useState(ACCOUNT_BALANCE_DATA);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const {
    handleAccountNumberValidation,
    handleConfirmAccountNumberValidation,
    handleRoutingNumberValidation,
    handleAccountTypeValidation,
    handlePaymentAmountValidation,
    handleAccountBalancesValidation,
  } = useFormValidations(formValues, setFormValidations);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const onBlurPaymentAmount = useCallback(
    (event) => {
      handlePaymentAmountValidation(accountsData, event.target.value);
      const selectedTotalBalance = calculateSelectedAccountsTotal(accountsData);
      // Update all individual account input balances that are checked
      const newAccounts = updateAccountInputsToProratedAmounts(
        accountsData,
        selectedTotalBalance,
        event.target.value
      );
      setAccountsData(newAccounts);
      handleAccountBalancesValidation(newAccounts);
    },
    [
      accountsData,
      formValues.paymentAmount,
      setAccountsData,
      updateAccountInputsToProratedAmounts,
      handleAccountBalancesValidation,
    ]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsFormSubmitted(true);
    console.log('Form Values: ', formValues);
  };

  const isSubmitButtonDisabled = useMemo(() => {
    // Check if all values are defined
    for (const key in formValues) {
      if (!formValues[key]) {
        return true;
      }
    }
    // Check if there are no validation errors
    for (const key in formValidations) {
      if (formValidations[key].showValidation) {
        return true;
      }
    }
    // Check if at least one account is checked
    if (accountsData.every((account) => !account.checked)) {
      return true;
    }
    return false;
  }, [formValues, formValidations, accountsData]);

  return (
    <>
      {isFormSubmitted ? (
        <div className="container">
          <div className="form">
            <p className="form-submitted">Form Submitted!</p>
          </div>
        </div>
      ) : (
        <div className="container" onSubmit={handleSubmit}>
          <form className="form">
            {/* Payment Information Section */}
            <div className="form-section">
              <p className="form-section-title b-margin-16">
                Payment Information
              </p>
              <div className="form-row b-margin-16">
                <div className="d-flex-column">
                  <label htmlFor="account-number-input" className="b-margin-4">
                    Account Number
                  </label>
                  <input
                    id="account-number-input"
                    name="accountNumber"
                    placeholder="Account Number"
                    type="number"
                    value={formValues.accountNumber}
                    onChange={handleInputChange}
                    onBlur={handleAccountNumberValidation}
                  />
                  <div className="h-4">
                    {formValidations.accountNumber.showValidation && (
                      <ValidationErrorComponent
                        errorMessage={
                          formValidations.accountNumber.errorMessage
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex-column">
                  <label
                    htmlFor="confirm-account-number-input"
                    className="b-margin-4"
                  >
                    Confirm Account Number
                  </label>
                  <input
                    id="confirm-account-number-input"
                    name="confirmAccountNumber"
                    placeholder="Account Number"
                    type="number"
                    value={formValues.confirmAccountNumber}
                    onChange={handleInputChange}
                    onBlur={handleConfirmAccountNumberValidation}
                  />
                  <div className="h-4">
                    {formValidations.confirmAccountNumber.showValidation && (
                      <ValidationErrorComponent
                        errorMessage={
                          formValidations.confirmAccountNumber.errorMessage
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="d-flex-column">
                  <label htmlFor="routing-number-input" className="b-margin-4">
                    Routing Number
                  </label>
                  <input
                    id="routing-number-input"
                    name="routingNumber"
                    placeholder="Routing Number"
                    type="number"
                    value={formValues.routingNumber}
                    onChange={handleInputChange}
                    onBlur={handleRoutingNumberValidation}
                  />
                  <div className="h-4">
                    {formValidations.routingNumber.showValidation && (
                      <ValidationErrorComponent
                        errorMessage={
                          formValidations.routingNumber.errorMessage
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex-column">
                  <label className="b-margin-20">Account Type</label>
                  <div className="d-flex gap-20">
                    <div className="d-flex-align-center gap-8">
                      <input
                        type="radio"
                        id="checking"
                        name="accountType"
                        value="checking"
                        required={true}
                        onChange={handleInputChange}
                        onBlur={handleAccountTypeValidation}
                      />
                      <label htmlFor="checking" className="text-default-subtle">
                        Checking
                      </label>
                    </div>
                    <div className="d-flex-align-center gap-8">
                      <input
                        type="radio"
                        id="savings"
                        name="accountType"
                        value="savings"
                        required={true}
                        onChange={handleInputChange}
                        onBlur={handleAccountTypeValidation}
                      />
                      <label htmlFor="savings" className="text-default-subtle">
                        Savings
                      </label>
                    </div>
                  </div>
                  <div className="h-4">
                    {formValidations.accountType.showValidation && (
                      <ValidationErrorComponent
                        errorMessage={formValidations.accountType.errorMessage}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Detail Section */}
            <div className="form-section">
              <p className="form-section-title b-margin-16">Payment Detail</p>
              <div className="form-row">
                <div className="d-flex-column">
                  <label htmlFor="payment-amount-input" className="b-margin-4">
                    Payment Amount
                  </label>
                  <input
                    id="payment-amount-input"
                    name="paymentAmount"
                    placeholder="$0.00"
                    type="number"
                    min={0}
                    max={calculateSelectedAccountsTotal(accountsData)}
                    required={true}
                    value={formValues.paymentAmount}
                    onChange={handleInputChange}
                    onBlur={onBlurPaymentAmount}
                  />
                  <div className="h-4">
                    {formValidations.paymentAmount.showValidation && (
                      <ValidationErrorComponent
                        errorMessage={
                          formValidations.paymentAmount.errorMessage
                        }
                      />
                    )}
                  </div>
                </div>
                <div></div>
              </div>
            </div>

            <AccountsList
              accountsData={accountsData}
              setAccountsData={setAccountsData}
              paymentAmount={formValues.paymentAmount}
              setFormValues={setFormValues}
              formValidations={formValidations}
              handlePaymentAmountValidation={handlePaymentAmountValidation}
              handleAccountBalancesValidation={handleAccountBalancesValidation}
            />

            <div className="form-section">
              <button type="submit" disabled={isSubmitButtonDisabled}>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default App;
