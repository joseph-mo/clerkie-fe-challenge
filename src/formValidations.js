import { useCallback } from 'react';
import { calculateSelectedAccountsTotal } from './utils';

export const ValidationErrorComponent = ({ errorMessage }) => {
  return <p className="form-validation-error">{errorMessage}</p>;
};

export const useFormValidations = (formValues, setFormValidations) => {
  const handleAccountNumberValidation = useCallback(() => {
    const { showValidation, errorMessage } = validateAccountNumber(
      formValues.accountNumber
    );
    setFormValidations((prevFormValidations) => ({
      ...prevFormValidations,
      accountNumber: { showValidation, errorMessage },
    }));
  }, [formValues.accountNumber]);

  const handleConfirmAccountNumberValidation = useCallback(() => {
    const { showValidation, errorMessage } = validateConfirmAccountNumber(
      formValues.accountNumber,
      formValues.confirmAccountNumber
    );
    setFormValidations((prevFormValidations) => ({
      ...prevFormValidations,
      confirmAccountNumber: { showValidation, errorMessage },
    }));
  }, [formValues.accountNumber, formValues.confirmAccountNumber]);

  const handleRoutingNumberValidation = useCallback(() => {
    const { showValidation, errorMessage } = validateRoutingNumber(
      formValues.routingNumber
    );
    setFormValidations((prevFormValidations) => ({
      ...prevFormValidations,
      routingNumber: { showValidation, errorMessage },
    }));
  }, [formValues.routingNumber]);

  const handleAccountTypeValidation = useCallback(() => {
    const { showValidation, errorMessage } = validateAccountType(
      formValues.accountType
    );
    setFormValidations((prevFormValidations) => ({
      ...prevFormValidations,
      accountType: { showValidation, errorMessage },
    }));
  }, [formValues.accountType]);

  const handlePaymentAmountValidation = useCallback(
    (accountsData, paymentAmount) => {
      const selectedTotalBalance = calculateSelectedAccountsTotal(accountsData);
      const { showValidation, errorMessage } = validatePaymentAmount(
        paymentAmount,
        selectedTotalBalance
      );
      setFormValidations((prevFormValidations) => ({
        ...prevFormValidations,
        paymentAmount: { showValidation, errorMessage },
      }));
    },
    [formValues.paymentAmount]
  );

  const handleAccountBalancesValidation = useCallback((accountsData) => {
    const { showValidation, errorMessage } =
      validateAccountBalances(accountsData);
    setFormValidations((prevFormValidations) => ({
      ...prevFormValidations,
      accountBalances: { showValidation, errorMessage },
    }));
  }, []);

  return {
    handleAccountNumberValidation,
    handleConfirmAccountNumberValidation,
    handleRoutingNumberValidation,
    handleAccountTypeValidation,
    handlePaymentAmountValidation,
    handleAccountBalancesValidation,
  };
};

export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) {
    return {
      showValidation: true,
      errorMessage: 'Account Number is required',
    };
  }
  const regExp = /^(\d{8,12})$/;
  if (regExp.test(accountNumber)) {
    return {
      showValidation: false,
      errorMessage: '',
    };
  }
  return {
    showValidation: true,
    errorMessage: 'Please enter a valid 8-12 digit Account Number',
  };
};

export const validateConfirmAccountNumber = (
  accountNumber,
  confirmAccountNumber
) => {
  if (!confirmAccountNumber) {
    return {
      showValidation: true,
      errorMessage: 'Confirm Account Number is required',
    };
  }
  if (accountNumber !== confirmAccountNumber) {
    return {
      showValidation: true,
      errorMessage: 'Account Numbers do not match',
    };
  }
  return {
    showValidation: false,
    errorMessage: '',
  };
};

export const validateRoutingNumber = (routingNumber) => {
  if (!routingNumber) {
    return {
      showValidation: true,
      errorMessage: 'Routing Number is required',
    };
  }
  const regExp = /^(\d{9})$/;
  if (regExp.test(routingNumber)) {
    return {
      showValidation: false,
      errorMessage: '',
    };
  }
  return {
    showValidation: true,
    errorMessage: 'Please enter a valid 9 digit Routing Number',
  };
};

export const validateAccountType = (accountType) => {
  if (!accountType) {
    return {
      showValidation: true,
      errorMessage: 'Account Type is required',
    };
  }
  return {
    showValidation: false,
    errorMessage: '',
  };
};

export const validatePaymentAmount = (paymentAmount, selectedTotalBalance) => {
  if (!paymentAmount) {
    return {
      showValidation: true,
      errorMessage: 'Payment Amount is required',
    };
  }
  if (paymentAmount < 0) {
    return {
      showValidation: true,
      errorMessage: 'Payment amount must be greater than 0',
    };
  }
  if (paymentAmount > selectedTotalBalance) {
    return {
      showValidation: true,
      errorMessage:
        'Payment amount should not exceed cumulative balance of selected accounts',
    };
  }

  return {
    showValidation: false,
    errorMessage: '',
  };
};

export const validateAccountBalances = (accountsData) => {
  for (const account of accountsData) {
    if (account.inputBalance > account.balance) {
      return {
        showValidation: true,
        errorMessage:
          'Payment to accounts cannot be more than original balance',
      };
    }
  }
  return {
    showValidation: false,
    errorMessage: '',
  };
};
