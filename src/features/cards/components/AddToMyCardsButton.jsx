import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddToMyCardsButton = ({
  user,
  selectedBank,
  selectedCard,
  userCards,
  onAddCard,
}) => {
  const isCardInCollection = userCards.some(
    (card) => card.bank === selectedBank && card.cardName === selectedCard
  );

  if (isCardInCollection) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={onAddCard}
      sx={{ mt: 2, width: "100%" }}
      slots={{
        root: "button",
        startIcon: "span",
      }}
      startIcon={<AddIcon />}
    >
      {user ? "Add to My Cards" : "Sign In & Add to My Cards"}
    </Button>
  );
};

export default AddToMyCardsButton;
