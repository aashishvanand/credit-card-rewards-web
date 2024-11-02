import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import DynamicCardInputs from "./DynamicCardInputs";
import {
  fetchBanks,
  fetchCards,
  fetchMCC,
  fetchCardQuestions,
} from "../utils/api";
import _ from "lodash";

const CalculatorForm = ({
  selectedBank,
  selectedCard,
  selectedMcc,
  spentAmount,
  additionalInputs,
  onBankChange,
  onCardChange,
  onMccChange,
  onSpentAmountChange,
  onAdditionalInputChange,
  onCalculate,
  onClear,
  onError,
  isEmbedded = false,
  tokenReady = true,
  isCalculating = false,
}) => {
  const theme = useTheme();
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [mccOptions, setMccOptions] = useState([]);
  const [cardQuestions, setCardQuestions] = useState(null);
  const [mccInputValue, setMccInputValue] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  useEffect(() => {
    if (tokenReady) {
      loadBanks();
    }
  }, [isEmbedded, tokenReady]);

  useEffect(() => {
    if (selectedBank && tokenReady) {
      loadCards();
    } else {
      setCards([]);
    }
  }, [selectedBank, isEmbedded, tokenReady]);

  useEffect(() => {
    if (selectedBank && selectedCard && tokenReady) {
      loadCardQuestions();
    } else {
      setCardQuestions(null);
    }
  }, [selectedBank, selectedCard, isEmbedded, tokenReady]);

  const loadBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const fetchedBanks = await fetchBanks(isEmbedded);
      setBanks(fetchedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
      onError?.("Failed to load banks. Please try again.");
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const loadCards = async () => {
    setIsLoadingCards(true);
    try {
      const fetchedCards = await fetchCards(selectedBank, isEmbedded);
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      onError?.("Failed to load cards. Please try again.");
    } finally {
      setIsLoadingCards(false);
    }
  };

  const loadCardQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const questions = await fetchCardQuestions(selectedBank, selectedCard, isEmbedded);
      setCardQuestions(questions);
    } catch (error) {
      handleQuestionsFetchError(error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionsFetchError = (error) => {
    if (error.message?.includes("too many requests")) {
      onError?.(error.message, "warning");
    } else {
      console.error("Error fetching card questions:", error);
      setCardQuestions(null);
      onError?.(
        error.response?.data?.error ||
          error.message ||
          "An error occurred while fetching card questions."
      );
    }
  };

  const debouncedFetchMCC = useCallback(
    _.debounce(async (value) => {
      if (value) {
        try {
          const mccData = await fetchMCC(value, isEmbedded);
          setMccOptions(mccData || []);
        } catch (error) {
          console.error("Error fetching MCC data:", error);
          setMccOptions([]);
        }
      } else {
        setMccOptions([]);
      }
    }, 300),
    [isEmbedded]
  );

  const handleMccInputChange = (event, newValue) => {
    setMccInputValue(newValue);
    debouncedFetchMCC(newValue);
  };

  const isCalculateDisabled =
    !selectedBank ||
    !selectedCard ||
    !spentAmount ||
    parseFloat(spentAmount) <= 0 ||
    isLoadingQuestions ||
    isCalculating;

  return (
    <Stack spacing={3}>
      <Autocomplete
        fullWidth
        options={banks}
        value={selectedBank}
        onChange={(event, newValue) => onBankChange(newValue)}
        loading={isLoadingBanks}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a bank"
            required
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingBanks && <CircularProgress size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Autocomplete
        fullWidth
        options={cards}
        value={selectedCard}
        onChange={(event, newValue) => onCardChange(newValue)}
        disabled={!selectedBank || isLoadingCards}
        loading={isLoadingCards}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a card"
            required
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingCards && <CircularProgress size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Autocomplete
        fullWidth
        options={mccOptions}
        value={selectedMcc}
        onChange={(event, newValue) => onMccChange(newValue)}
        inputValue={mccInputValue}
        onInputChange={handleMccInputChange}
        getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
        renderOption={(props, option) => (
          <li {...props}>
            <Box>
              <Typography variant="body1">
                {option.mcc} - {option.name}
              </Typography>
              {option.knownMerchants?.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Known merchants: {option.knownMerchants.join(", ")}
                </Typography>
              )}
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search MCC, Merchant Category, or Known Merchants"
          />
        )}
        filterOptions={(options, { inputValue }) => {
          const filterValue = inputValue.toLowerCase();
          return options.filter(
            (option) =>
              option.mcc.toLowerCase().includes(filterValue) ||
              option.name.toLowerCase().includes(filterValue) ||
              option.knownMerchants?.some((merchant) =>
                merchant.toLowerCase().includes(filterValue)
              )
          );
        }}
      />

      <TextField
        fullWidth
        label="Enter spent amount (INR)"
        type="number"
        value={spentAmount}
        onChange={(e) => onSpentAmountChange(e.target.value)}
        required
        InputProps={{
          inputProps: { min: 0 }
        }}
      />

      {isLoadingQuestions ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        cardQuestions && (
          <DynamicCardInputs
            cardConfig={cardQuestions}
            onChange={onAdditionalInputChange}
            currentInputs={additionalInputs}
            selectedMcc={selectedMcc}
          />
        )
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Button
          variant="contained"
          onClick={onCalculate}
          disabled={isCalculateDisabled}
          sx={{ flex: 1, height: 48 }}
        >
          {isCalculating ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Calculate"
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={onClear}
          sx={{ flex: 1, height: 48 }}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
};

export default CalculatorForm;